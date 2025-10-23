import { asyncHandler } from "@helper/async-handler.helper";
import { InvoiceService } from "./invoice.service";
import { NextFunction, Request, Response } from "express";
import { InvoiceCreateDtoSchema, InvoiceUpdateDtoSchema, PaginationSchema } from "@dtos";

export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService
    ){}

    createInvoice = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const validateData = InvoiceCreateDtoSchema.parse(req.body);
        const result = await this.invoiceService.createInvoice(validateData);
        res.status(result.statusCode).json(result);
    });

    getAllInvoices = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const queryParams = PaginationSchema.parse({
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        });
        const result = await this.invoiceService.getAllInvoices(queryParams);
        res.status(result.statusCode).json(result);
    });

    getFbrInvoiceDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const result = await this.invoiceService.getFbrInvoiceDetails(Number(req.params.id));
        res.status(result.statusCode).json(result);
    });

    getInvoiceById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.invoiceService.getInvoiceById(id);
        res.status(result.statusCode).json(result);
    });

    updateInvoice = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const validateData = InvoiceUpdateDtoSchema.parse(req.body);
        const result = await this.invoiceService.updateInvoice(id, validateData);
        res.status(result.statusCode).json(result);
    });

    deleteInvoice = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id, 10);
        const result = await this.invoiceService.deleteInvoice(id);
        res.status(result.statusCode).json(result);
    });
}