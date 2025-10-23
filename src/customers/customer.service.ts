import AppDataSource from "@config/db-config";
import { CustomerCreateDto, CustomerUpdateDto, PaginationDto } from "@dtos";
import { Customer } from "@entities";
import { ApiError } from "@helper/api-error.helper";
import { ApiResponse } from "@helper/api-success.helper";
import { ErrorResponse, statusCode, SuccessResponse } from "@messages";
import axios from "axios";

export class CustomerService {
    constructor(
        private readonly customerRepository = AppDataSource.getRepository(Customer)
    ){}

   private async lookupNtn(ntnCnic: string): Promise<{ registrationType: string; taxRate: number }> {
        try {
            // Use FBR IRIS public API for NTN validation (no token needed)
            const response = await axios.get(`https://e.fbr.gov.pk/NTNVerification/VerifyNTN?ntn=${ntnCnic}`);
            const data = response.data;

            // IRIS response: { "status": "Valid" or "Invalid" } (adjust based on actual response)
            const isValid = data.status === "Valid" || data.valid === true;
            return {
                registrationType: isValid ? 'Registered' : 'Unregistered',
                taxRate: 18.00, // Default; FBR doesn't return rate here
            };
        } catch (error: any) {
            console.error("NTN Lookup Error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            // Fallback to 'Unregistered' on error
            return { registrationType: 'Unregistered', taxRate: 18.00 };
        }
    }

    async createCustomer(customerDto: CustomerCreateDto): Promise<ApiResponse<any>> {
        const { address, businessName, city, ntnCnic, province } = customerDto;
        const lookup = await this.lookupNtn(ntnCnic);

        const customer = this.customerRepository.create({
            address,
            businessName,
            city,
            ntnCnic,
            province,
            registrationType: lookup.registrationType,
        });

        
        await this.customerRepository.save(customer);

        return new ApiResponse(statusCode.Created, customer, SuccessResponse.success);
    }

    async getAllCustomers(pagination: PaginationDto): Promise<ApiResponse<any>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.customerRepository.createQueryBuilder("customer")
            .take(limit)
            .skip(skip)
            .orderBy("customer.createdAt", "DESC");

        const [customers, total] = await qb.getManyAndCount();

        return new ApiResponse(statusCode.OK, { customers, total, page, limit }, SuccessResponse.success);
    }

    async getCustomerById(id: number): Promise<ApiResponse<any>> {
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.CustomersNotFound);
        }

        return new ApiResponse(statusCode.OK, customer, SuccessResponse.success);
    }

  async updateCustomer(id: number, customerDto: CustomerUpdateDto): Promise<ApiResponse<any>> {
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.CustomersNotFound);
        }

        const updatedData = {
            address: customerDto.address || customer.address,
            businessName: customerDto.businessName || customer.businessName,
            city: customerDto.city || customer.city,
            ntnCnic: customerDto.ntnCnic || customer.ntnCnic,
            province: customerDto.province || customer.province,
            registrationType : customerDto.registrationType || customer.registrationType
        };

        // Re-lookup if ntnCnic changed
        if (customerDto.ntnCnic && customerDto.ntnCnic !== customer.ntnCnic) {
            const lookup = await this.lookupNtn(customerDto.ntnCnic);
            updatedData.registrationType = lookup.registrationType;
        }

        await this.customerRepository.update(id, updatedData);

        const updatedCustomer = await this.customerRepository.findOneBy({ id });

        return new ApiResponse(statusCode.OK, updatedCustomer, SuccessResponse.success);
    }

    async deleteCustomer(id: number): Promise<ApiResponse<any>> {
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.CustomersNotFound);
        }

        await this.customerRepository.remove(customer);

        return new ApiResponse(statusCode.OK, null, SuccessResponse.success);
    }
}