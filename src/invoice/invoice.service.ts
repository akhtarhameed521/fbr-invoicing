import AppDataSource from "@config/db-config";
import { InvoiceCreateDto, InvoiceUpdateDto, PaginationDto } from "@dtos";
import { Invoice } from "@entities";
import { Seller } from "@entities";
import { Customer } from "@entities";
import { ApiError } from "@helper/api-error.helper";
import { ApiResponse } from "@helper/api-success.helper";
import { ErrorResponse, statusCode, SuccessResponse } from "@messages";
import { InvoiceItem } from "@entities";
import { Product } from "@entities"; // Import Product entity
import axios from "axios";

export class InvoiceService {
    constructor(
        private readonly invoiceRepository = AppDataSource.getRepository(Invoice),
        private readonly sellerRepository = AppDataSource.getRepository(Seller),
        private readonly customerRepository = AppDataSource.getRepository(Customer),
        private readonly invoiceItemRepository = AppDataSource.getRepository(InvoiceItem),
        private readonly productRepository = AppDataSource.getRepository(Product)
    ) { }

    private async validateInvoice(irn: string): Promise<any> {
        try {
            const response = await axios.post(process.env.FBR_VALIDATE_URL || "https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb", { irn }, {
                headers: {
                    Authorization: `Bearer ${process.env.FBR_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data; // { totalTax: ..., items: [{ salesTaxApplicable: ... }], approved: true }
        } catch (error: any) {
            console.error("FBR Validation Error:", error.response?.data || error.message);
            throw new ApiError(statusCode.BadRequest, "Invoice validation failed");
        }
    }

private async submitToFbr(invoice: Invoice): Promise<any> {
  const payload = {
    invoiceType: invoice.invoiceType,
    invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
    sellerNTNCNIC: invoice.seller.ntnCnic,
    sellerBusinessName: invoice.seller.businessName,
    sellerProvince: invoice.seller.province,
    sellerAddress: invoice.seller.address,
    buyerNTNCNIC: invoice.customer.ntnCnic,
    buyerBusinessName: invoice.customer.businessName,
    buyerProvince: invoice.customer.province,
    buyerAddress: invoice.customer.address,
    buyerRegistrationType: invoice.customer.registrationType,
    invoiceRefNo: invoice.refNo || "",
    scenarioId: invoice.scenarioId,
    items: invoice.items.map(item => {
      const taxRate = item.product?.taxRate ? parseFloat(String(item.product.taxRate)) : 0;
      return {
        hsCode: item.product?.hsCode && /^[0-9]{4}\.[0-9]{4}$/.test(item.product.hsCode) ? item.product.hsCode : "0000.0000",
        productDescription: item.product?.description || "Default Description",
        rate: `${taxRate.toFixed(2)}%`,
        uoM: item.product?.uom || "Unit",
        quantity: Number(parseFloat(String(item.quantity || 0)).toFixed(4)),
        totalValues: Number(parseFloat(String((item.quantity || 0) * (item.unitPrice || 0))).toFixed(2)),
        valueSalesExcludingST: Number(parseFloat(String(item.valueExclSt || 0)).toFixed(2)),
        fixedNotifiedValueOrRetailPrice: Number(parseFloat(String(item.product?.fixedPrice || 0)).toFixed(2)),
        salesTaxApplicable: Number(parseFloat(String(item.salesTaxApplicable || 0)).toFixed(2)),
        salesTaxWithheldAtSource: Number(parseFloat(String(item.salesTaxWithheld || 0)).toFixed(2)),
        extraTax: item.extraTax != null ? String(item.extraTax) : "",
        furtherTax: Number(parseFloat(String(item.furtherTax || 0)).toFixed(2)),
        sroScheduleNo: item.sroScheduleNo || "",
        fedPayable: Number(parseFloat(String(item.fedPayable || 0)).toFixed(2)),
        discount: Number(parseFloat(String(item.discount || 0)).toFixed(2)),
        saleType: item?.product?.saleType,
        sroItemSerialNo: item.sroItemSerialNo || "",
      };
    }),
  };

  console.log("FBR Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      process.env.FBR_SUBMIT_URL || "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FBR_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("FBR Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.validationResponse?.invoiceStatuses?.map((status: any) => `${status.errorCode}: ${status.error}`).join(', ') || 
                        (error.response?.data?.validationResponse?.error ? `${error.response.data.validationResponse.errorCode}: ${error.response.data.validationResponse.error}` : error.message) || 
                        'Unknown FBR error';
    console.error("FBR Submission Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new ApiError(statusCode.BadRequest, `FBR submission failed: ${errorMessage}`);
  }
}

async createInvoice(invoiceDto: InvoiceCreateDto): Promise<ApiResponse<any>> {
  const { invoiceNumber, invoiceType, invoiceDate, refNo, scenarioId, sellerId, customerId, items } = invoiceDto;

  // Validate seller and customer existence
  const seller = await this.sellerRepository.findOneBy({ id: +sellerId });
  if (!seller) throw new ApiError(statusCode.NotFound, ErrorResponse.SellersNotFound);

  const customer = await this.customerRepository.findOneBy({ id: +customerId });
  if (!customer) throw new ApiError(statusCode.NotFound, ErrorResponse.CustomersNotFound);

  // Calculate totals
  let subtotal = 0;
  const invoiceItems = await Promise.all(items.map(async (item) => {
    const product = await this.productRepository.findOneBy({ id: +item.productId });
    if (!product) throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);

    const itemSubtotal = item.quantity * item.unitPrice;
    subtotal += itemSubtotal;

    return this.invoiceItemRepository.create({
      invoice: { id: null },
      product,
      quantity: Number(parseFloat(String(item.quantity)).toFixed(4)),
      unitPrice: Number(parseFloat(String(item.unitPrice)).toFixed(2)),
      valueExclSt: Number(parseFloat(String(itemSubtotal)).toFixed(2)),
      salesTaxApplicable: Number(parseFloat(String(itemSubtotal * (parseFloat(String(product.taxRate)) / 100 || 0.18))).toFixed(2)),
      discount: 0.00,
      salesTaxWithheld: 5.00,
      extraTax: 0.00,
      furtherTax: 0.00,
      fedPayable: 0.00,
      sroScheduleNo: null,
      sroItemSerialNo: "ABC123", // Trimmed trailing space
    });
  }));

  const totalTax = invoiceItems.reduce((sum, item) => sum + (item.salesTaxApplicable || 0), 0);
  const grandTotal = subtotal + totalTax;

  const invoice = this.invoiceRepository.create({
    invoiceNumber,
    invoiceType,
    invoiceDate,
    refNo,
    scenarioId,
    subtotal: Number(parseFloat(String(subtotal)).toFixed(2)),
    totalTax: Number(parseFloat(String(totalTax)).toFixed(2)),
    grandTotal: Number(parseFloat(String(grandTotal)).toFixed(2)),
    InvoiceStatus: "Draft",
    seller,
    customer,
    items: invoiceItems,
  });

  const savedInvoice = await this.invoiceRepository.save(invoice);

  // Update invoice reference in items
  invoiceItems.forEach(item => (item.invoice = savedInvoice));
  await this.invoiceItemRepository.save(invoiceItems);

  // Submit to FBR
  const fbrResponse = await this.submitToFbr(savedInvoice);
  console.log("FBR Response in createInvoice:", JSON.stringify(fbrResponse, null, 2));
  if (fbrResponse.irn) {
    savedInvoice.irn = fbrResponse.irn;
    savedInvoice.qrCodeData = fbrResponse.qrCode;
    savedInvoice.fbrResponse = fbrResponse;
    savedInvoice.InvoiceStatus = "Submitted";
    await this.invoiceRepository.save(savedInvoice);
  } else {
    const errors = fbrResponse.validationResponse?.invoiceStatuses?.map((status: any) => `${status.errorCode}: ${status.error}`).join(', ') || fbrResponse.message || 'Unknown error';
    throw new ApiError(statusCode.BadRequest, `FBR submission failed: ${errors}`);
  }

  return new ApiResponse(statusCode.Created, savedInvoice, SuccessResponse.success);
}

    async getAllInvoices(pagination: PaginationDto): Promise<ApiResponse<any>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.invoiceRepository.createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.seller", "seller")
            .leftJoinAndSelect("invoice.customer", "customer")
            .leftJoinAndSelect("invoice.items", "items")
            .leftJoinAndSelect("items.product", "product") // Include product details
            .take(limit)
            .skip(skip)
            .orderBy("invoice.createdAt", "DESC");

        const [invoices, total] = await qb.getManyAndCount();

        return new ApiResponse(statusCode.OK, { invoices, total, page, limit }, SuccessResponse.success);
    }

    async getInvoiceById(id: number): Promise<ApiResponse<any>> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ["seller", "customer", "items", "items.product"],
        });

        if (!invoice) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);
        }

        // Fetch FBR data if IRN exists
        if (invoice.irn) {
            const validation = await this.validateInvoice(invoice.irn);
            invoice.fbrResponse = { ...invoice.fbrResponse, validation };
            // Extract and log sales tax for display
            const salesTax = validation.totalTax || invoice.totalTax;
            console.log(`Sales Tax from FBR for Invoice ${id}: ${salesTax}`);
        }

        return new ApiResponse(statusCode.OK, invoice, SuccessResponse.success);
    }

    async getFbrInvoiceDetails(id: number): Promise<ApiResponse<any>> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ["seller", "customer", "items", "items.product"],
        });

        if (!invoice) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);
        }

        if (!invoice.irn) {
            throw new ApiResponse(statusCode.BadRequest, null, "No IRN available for validation");
        }

        const validation = await this.validateInvoice(invoice.irn);
        return new ApiResponse(statusCode.OK, validation, SuccessResponse.success);
    }

    async updateInvoice(id: number, invoiceDto: InvoiceUpdateDto): Promise<ApiResponse<any>> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ["seller", "customer", "items", "items.product"],
        });

        if (!invoice) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);
        }

        // Handle updates to items if provided
        if (invoiceDto.items) {
            await this.invoiceItemRepository.remove(invoice.items); // Remove existing items
            const newItems = await Promise.all(invoiceDto.items.map(async (item) => {
                const product = item.productId ? await this.productRepository.findOneBy({ id: +item.productId }) : null;
                if (item.productId && !product) throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);

                const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
                return this.invoiceItemRepository.create({
                    invoice: { id },
                    product: product || undefined,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    valueExclSt: itemSubtotal,
                    salesTaxApplicable: itemSubtotal * (product?.taxRate / 100 || 0.18), // Use product taxRate or default
                });
            }));
            invoice.items = await this.invoiceItemRepository.save(newItems);

            // Recalculate totals
            const subtotal = invoice.items.reduce((sum, item) => sum + (item.valueExclSt || 0), 0);
            const totalTax = invoice.items.reduce((sum, item) => sum + (item.salesTaxApplicable || 0), 0);
            invoice.subtotal = subtotal;
            invoice.totalTax = totalTax;
            invoice.grandTotal = subtotal + totalTax;
        }

        Object.assign(invoice, invoiceDto, {
            seller: invoiceDto.sellerId ? await this.sellerRepository.findOneBy({ id: +invoiceDto.sellerId }) : invoice.seller,
            customer: invoiceDto.customerId ? await this.customerRepository.findOneBy({ id: +invoiceDto.customerId }) : invoice.customer,
        });

        await this.invoiceRepository.save(invoice);

        return new ApiResponse(statusCode.OK, invoice, SuccessResponse.success);
    }

    async deleteInvoice(id: number): Promise<ApiResponse<any>> {
        const invoice = await this.invoiceRepository.findOneBy({ id });

        if (!invoice) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);
        }

        await this.invoiceRepository.delete(invoice);

        return new ApiResponse(statusCode.OK, null, SuccessResponse.success);
    }


}