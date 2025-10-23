import { asyncHandler } from "@helper/async-handler.helper";
import { SellerService } from "./seller.service";
import { NextFunction, Request, Response } from "express";
import {  SellerUpdateDtoSchema, PaginationSchema, SellerDtoSchema } from "@dtos";

export class SellerController {
    constructor(
        private readonly sellerService: SellerService
    ){}

    createSeller = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
        const validateData = SellerDtoSchema.parse(req.body);
        const result = await this.sellerService.createSeller(validateData);
        res.status(result.statusCode).json(result);
    });

    getAllSellers = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
        const queryParams = PaginationSchema.parse({
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        });
        const result = await this.sellerService.getAllSellers(queryParams);
        res.status(result.statusCode).json(result);
    });

    getSellerById = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
        const id = req.params.id;
        const result = await this.sellerService.getSellerById(+id);
        res.status(result.statusCode).json(result);
    });

    updateSeller = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
        const id = req.params.id;
        const validateData = SellerUpdateDtoSchema.parse(req.body);
        const result = await this.sellerService.updateSeller(+id, validateData);
        res.status(result.statusCode).json(result);
    });

    deleteSeller = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
        const id = req.params.id;
        const result = await this.sellerService.deleteSeller(+id);
        res.status(result.statusCode).json(result);
    });
}