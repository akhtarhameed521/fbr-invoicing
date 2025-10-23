import { asyncHandler } from "@helper/async-handler.helper";
import { ProductService } from "./product.service";
import { NextFunction, Request, Response } from "express";
import { ProductCreateDtoSchema, ProductUpdateDtoSchema, PaginationSchema } from "@dtos";

export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    createProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const validateData = ProductCreateDtoSchema.parse(req.body);
        const result = await this.productService.createProduct(validateData);
        res.status(result.statusCode).json(result);
    });

    getAllProducts = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const queryParams = PaginationSchema.parse({
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        });
        const result = await this.productService.getAllProducts(queryParams);
        res.status(result.statusCode).json(result);
    });

    getProductById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.productService.getProductById(id);
        res.status(result.statusCode).json(result);
    });

    updateProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const validateData = ProductUpdateDtoSchema.parse(req.body);
        const result = await this.productService.updateProduct(id, validateData);
        res.status(result.statusCode).json(result);
    });

    deleteProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.productService.deleteProduct(id);
        res.status(result.statusCode).json(result);
    });
}