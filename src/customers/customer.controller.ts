import { asyncHandler } from "@helper/async-handler.helper";
import { CustomerService } from "./customer.service";
import { NextFunction, Request, Response } from "express";
import { CustomerCreateDtoSchema, CustomerUpdateDtoSchema, PaginationSchema } from "@dtos";

export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ){}

    createCustomer = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const validateData = CustomerCreateDtoSchema.parse(req.body);
        const result = await this.customerService.createCustomer(validateData);
        res.status(result.statusCode).json(result);
    });

    getAllCustomers = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const queryParams = PaginationSchema.parse({
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        });
        const result = await this.customerService.getAllCustomers(queryParams);
        res.status(result.statusCode).json(result);
    });

    getCustomerById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.customerService.getCustomerById(id);
        res.status(result.statusCode).json(result);
    });

    updateCustomer = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const validateData = CustomerUpdateDtoSchema.parse(req.body);
        const result = await this.customerService.updateCustomer(id, validateData);
        res.status(result.statusCode).json(result);
    });

    deleteCustomer = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.customerService.deleteCustomer(id);
        res.status(result.statusCode).json(result);
    });
}