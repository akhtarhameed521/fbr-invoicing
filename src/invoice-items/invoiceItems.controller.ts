import { asyncHandler } from "@helper/async-handler.helper";
import { InvoiceItemService } from "./invoiceItems.service";
import { NextFunction, Request, Response } from "express";
import { InvoiceItemCreateDtoSchema, InvoiceItemUpdateDtoSchema, PaginationSchema } from "@dtos";

export class InvoiceItemController {
    constructor(
        private readonly invoiceItemService: InvoiceItemService
    ){}

    createInvoiceItem = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const validateData = InvoiceItemCreateDtoSchema.parse(req.body);
        const result = await this.invoiceItemService.createInvoiceItem(validateData);
        res.status(result.statusCode).json(result);
    });

    getAllInvoiceItems = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const queryParams = PaginationSchema.parse({
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        });
        const result = await this.invoiceItemService.getAllInvoiceItems(queryParams);
        res.status(result.statusCode).json(result);
    });

    getInvoiceItemById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.invoiceItemService.getInvoiceItemById(id);
        res.status(result.statusCode).json(result);
    });

    updateInvoiceItem = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const validateData = InvoiceItemUpdateDtoSchema.parse(req.body);
        const result = await this.invoiceItemService.updateInvoiceItem(id, validateData);
        res.status(result.statusCode).json(result);
    });

    deleteInvoiceItem = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.invoiceItemService.deleteInvoiceItem(id);
        res.status(result.statusCode).json(result);
    });
}