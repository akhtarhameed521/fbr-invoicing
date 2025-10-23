import AppDataSource from "@config/db-config";
import { ProductCreateDto, ProductUpdateDto, PaginationDto } from "@dtos";
import { Product } from "@entities";
import { ApiError } from "@helper/api-error.helper";
import { ApiResponse } from "@helper/api-success.helper";
import { ErrorResponse, statusCode, SuccessResponse } from "@messages";

export class ProductService {
    constructor(
        private readonly productRepository = AppDataSource.getRepository(Product)
    ){}

    async createProduct(productDto: ProductCreateDto): Promise<ApiResponse<any>> {
        const { hsCode, description, uom, taxRate, saleType, fixedPrice } = productDto;

        const product = this.productRepository.create({
            hsCode,
            description,
            uom,
            taxRate,
            saleType,
            fixedPrice,
        });

        await this.productRepository.save(product);

        return new ApiResponse(statusCode.Created, product, SuccessResponse.success);
    }

    async getAllProducts(pagination: PaginationDto): Promise<ApiResponse<any>> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.productRepository.createQueryBuilder("product")
            .take(limit)
            .skip(skip)
            .orderBy("product.createdAt", "DESC");

        const [products, total] = await qb.getManyAndCount();

        return new ApiResponse(statusCode.OK, { products, total, page, limit }, SuccessResponse.success);
    }

    async getProductById(id: number): Promise<ApiResponse<any>> {
        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);
        }

        return new ApiResponse(statusCode.OK, product, SuccessResponse.success);
    }

    async updateProduct(id: number, productDto: ProductUpdateDto): Promise<ApiResponse<any>> {
        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);
        }

        const updatedData = {
            hsCode: productDto.hsCode || product.hsCode,
            description: productDto.description || product.description,
            uom: productDto.uom || product.uom,
            taxRate: productDto.taxRate || product.taxRate,
            saleType: productDto.saleType || product.saleType,
            fixedPrice: productDto.fixedPrice || product.fixedPrice,
        };

        await this.productRepository.update(id, updatedData);

        const updatedProduct = await this.productRepository.findOneBy({ id });

        return new ApiResponse(statusCode.OK, updatedProduct, SuccessResponse.success);
    }

    async deleteProduct(id: number): Promise<ApiResponse<any>> {
        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            throw new ApiError(statusCode.NotFound, ErrorResponse.ProductsNotFound);
        }

        await this.productRepository.delete(product);

        return new ApiResponse(statusCode.OK, null, SuccessResponse.success);
    }
}