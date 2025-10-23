import AppDataSource from "@config/db-config";
import {  SellerUpdateDto, PaginationDto, SellerDto } from "@dtos";
import { Seller } from "@entities";
import { ApiError } from "@helper/api-error.helper";
import { ApiResponse } from "@helper/api-success.helper";
import { ErrorResponse, statusCode, SuccessResponse } from "@messages";

export class SellerService {
    constructor(
        private readonly sellerRepository = AppDataSource.getRepository(Seller)
    ){}

    async createSeller(sellerDto: SellerDto): Promise<ApiResponse<any>> {
        const { address, businessName, city, ntnCnic, province } = sellerDto;

        const seller = this.sellerRepository.create({
          address,
          businessName,
          city,
          ntnCnic,
          province  
        });

        await this.sellerRepository.save(seller);

        return new ApiResponse(statusCode.Created, seller, SuccessResponse.success);
    }

    async getAllSellers(pagination: PaginationDto): Promise<ApiResponse<any>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.sellerRepository.createQueryBuilder("seller")
            .take(limit)
            .skip(skip)
            .orderBy("seller.createdAt", "DESC"); 

        const [sellers, total] = await qb.getManyAndCount();

        return new ApiResponse(statusCode.OK, { sellers, total, page, limit }, SuccessResponse.success);
    }

    async getSellerById(id: number): Promise<ApiResponse<any>> {
        const seller = await this.sellerRepository.findOneBy({ id });

        if (!seller) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.SellersNotFound)
        }

        return new ApiResponse(statusCode.OK, seller, SuccessResponse.success);
    }

    async updateSeller(id: number, sellerDto: SellerUpdateDto): Promise<ApiResponse<any>> {
        const {address, businessName, city, ntnCnic, province} = sellerDto
        const seller = await this.sellerRepository.findOneBy({ id });

        if (!seller) {
           throw new ApiError(statusCode.NotFound, ErrorResponse.SellersNotFound)
        }

        await this.sellerRepository.update(id,{
            address: address || seller.address,
            businessName: businessName || seller.businessName,
            city: city || seller.city,
            ntnCnic: ntnCnic || seller.ntnCnic,
            province: province || seller.province
        })

        await this.sellerRepository.save(seller);

        return new ApiResponse(statusCode.OK, seller, SuccessResponse.success);
    }

    async deleteSeller(id: number): Promise<ApiResponse<any>> {
        const seller = await this.sellerRepository.findOneBy({ id });

        if (!seller) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.SellersNotFound)
        }

        await this.sellerRepository.delete(seller);

        return new ApiResponse(statusCode.OK, null, SuccessResponse.success);
    }
}