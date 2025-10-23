import AppDataSource from "@config/db-config";
import { InvoiceItemCreateDto, InvoiceItemUpdateDto, PaginationDto } from "@dtos";
import { InvoiceItem } from "@entities";
import { Invoice } from "@entities";
import { Product } from "@entities";
import { ApiError } from "@helper/api-error.helper";
import { ApiResponse } from "@helper/api-success.helper";
import { ErrorResponse, statusCode, SuccessResponse } from "@messages";

export class InvoiceItemService {
    constructor(
        private readonly invoiceItemRepository = AppDataSource.getRepository(InvoiceItem),
        private readonly invoiceRepository = AppDataSource.getRepository(Invoice),
        private readonly productRepository = AppDataSource.getRepository(Product)
    ) {}

    async createInvoiceItem(invoiceItemDto: InvoiceItemCreateDto): Promise<ApiResponse<any>> {
        const { invoiceId, productId, quantity, unitPrice, discount, valueExclSt, salesTaxApplicable, salesTaxWithheld, extraTax, furtherTax, fedPayable, sroScheduleNo, sroItemSerialNo } = invoiceItemDto;

        // Validate invoice existence
        const invoice = await this.invoiceRepository.findOneBy({ id: +invoiceId });
        if (!invoice) throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);

        // Validate product existence
        const product = await this.productRepository.findOneBy({ id: +productId });
        if (!product) throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);

        // Calculate valueExclSt if not provided
        const calculatedValueExclSt = valueExclSt || (quantity * unitPrice) - ((discount / 100) * (quantity * unitPrice));
        const calculatedSalesTaxApplicable = salesTaxApplicable || calculatedValueExclSt * (product.taxRate / 100);

        const invoiceItem = this.invoiceItemRepository.create({
            invoice,
            product,
            quantity,
            unitPrice,
            discount,
            valueExclSt: calculatedValueExclSt,
            salesTaxApplicable: calculatedSalesTaxApplicable,
            salesTaxWithheld,
            extraTax,
            furtherTax,
            fedPayable,
            sroScheduleNo,
            sroItemSerialNo,
        });

        const savedInvoiceItem = await this.invoiceItemRepository.save(invoiceItem);

        // Update invoice totals within a transaction
        await AppDataSource.transaction(async (manager) => {
            const invoiceRepository = manager.withRepository(this.invoiceRepository);
            await this.updateInvoiceTotals(invoice.id, invoiceRepository);
        });

        return new ApiResponse(statusCode.Created, savedInvoiceItem, SuccessResponse.success);
    }

    async getAllInvoiceItems(pagination: PaginationDto): Promise<ApiResponse<any>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.invoiceItemRepository.createQueryBuilder("invoiceItem")
            .leftJoinAndSelect("invoiceItem.invoice", "invoice")
            .leftJoinAndSelect("invoiceItem.product", "product")
            .take(limit)
            .skip(skip)
            .orderBy("invoiceItem.createdAt", "DESC");

        const [invoiceItems, total] = await qb.getManyAndCount();

        return new ApiResponse(statusCode.OK, { invoiceItems, total, page, limit }, SuccessResponse.success);
    }

    async getInvoiceItemById(id: number): Promise<ApiResponse<any>> {
        const invoiceItem = await this.invoiceItemRepository.findOne({
            where: { id },
            relations: ["invoice", "product"],
        });

        if (!invoiceItem) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoiceItemsNotFound);
        }

        return new ApiResponse(statusCode.OK, invoiceItem, SuccessResponse.success);
    }

    async updateInvoiceItem(id: number, invoiceItemDto: InvoiceItemUpdateDto): Promise<ApiResponse<any>> {
        const invoiceItem = await this.invoiceItemRepository.findOne({
            where: { id },
            relations: ["invoice", "product"],
        });

        if (!invoiceItem) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoiceItemsNotFound);
        }

        // Update relationships if provided
        if (invoiceItemDto.invoiceId) {
            const invoice = await this.invoiceRepository.findOneBy({ id: +invoiceItemDto.invoiceId });
            if (!invoice) throw new ApiError(statusCode.NotFound, ErrorResponse.InvoicesNotFound);
            invoiceItem.invoice = invoice;
        }
        if (invoiceItemDto.productId) {
            const product = await this.productRepository.findOneBy({ id: +invoiceItemDto.productId });
            if (!product) throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);
            invoiceItem.product = product;
        }

        // Calculate updated values
        const calculatedValueExclSt = invoiceItemDto.valueExclSt || ((invoiceItemDto.quantity || invoiceItem.quantity) * (invoiceItemDto.unitPrice || invoiceItem.unitPrice)) - ((invoiceItemDto.discount || invoiceItem.discount) / 100) * ((invoiceItemDto.quantity || invoiceItem.quantity) * (invoiceItemDto.unitPrice || invoiceItem.unitPrice));
        const calculatedSalesTaxApplicable = invoiceItemDto.salesTaxApplicable || calculatedValueExclSt * (invoiceItem.product?.taxRate / 100 || 0.18);

        Object.assign(invoiceItem, invoiceItemDto, {
            valueExclSt: calculatedValueExclSt,
            salesTaxApplicable: calculatedSalesTaxApplicable,
        });

        const savedInvoiceItem = await this.invoiceItemRepository.save(invoiceItem);

        // Update invoice totals within a transaction
        await AppDataSource.transaction(async (manager) => {
            const invoiceRepository = manager.withRepository(this.invoiceRepository);
            await this.updateInvoiceTotals(invoiceItem.invoice.id, invoiceRepository);
        });

        return new ApiResponse(statusCode.OK, savedInvoiceItem, SuccessResponse.success);
    }

    async deleteInvoiceItem(id: number): Promise<ApiResponse<any>> {
        const invoiceItem = await this.invoiceItemRepository.findOne({
            where: { id },
            relations: ["invoice"],
        });

        if (!invoiceItem) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.InvoiceItemsNotFound);
        }

        const invoiceId = invoiceItem.invoice.id;
        await this.invoiceItemRepository.remove(invoiceItem);

        // Update invoice totals within a transaction
        await AppDataSource.transaction(async (manager) => {
            const invoiceRepository = manager.withRepository(this.invoiceRepository);
            await this.updateInvoiceTotals(invoiceId, invoiceRepository);
        });

        return new ApiResponse(statusCode.OK, null, SuccessResponse.success);
    }

    private async updateInvoiceTotals(invoiceId: number, invoiceRepository?: any): Promise<void> {
        const repository = invoiceRepository || this.invoiceRepository;
        const invoice = await repository.findOne({
            where: { id: invoiceId },
            relations: ["items"],
            // Ensure unique items by selecting distinct
            // Note: This requires a custom query if duplicates persist
        });

        if (invoice) {
            console.log("Invoice items before calculation:", invoice.items.map(item => ({ id: item.id, valueExclSt: item.valueExclSt, salesTaxApplicable: item.salesTaxApplicable }))); // Debug log

            const subtotal = invoice.items.reduce((sum, item) => {
                const value = Number(item.valueExclSt) || 0;
                console.log(`Adding valueExclSt for item ${item.id}: ${value}`);
                return sum + value;
            }, 0);

            const totalTax = invoice.items.reduce((sum, item) => {
                const tax = Number(item.salesTaxApplicable) || 0;
                console.log(`Adding salesTaxApplicable for item ${item.id}: ${tax}`);
                return sum + tax;
            }, 0);

            const grandTotal = subtotal + totalTax;

            console.log(`Calculated totals - subtotal: ${subtotal}, totalTax: ${totalTax}, grandTotal: ${grandTotal}`); // Debug log

            invoice.subtotal = subtotal;
            invoice.totalTax = totalTax;
            invoice.grandTotal = grandTotal;

            await repository.save(invoice);
        } else {
            console.log(`No invoice found with id: ${invoiceId}`);
        }
    }
}