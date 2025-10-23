import * as express from "express";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { validateRequest } from "@middlewares/validation.middleware";
import { InvoiceCreateDtoSchema, InvoiceUpdateDtoSchema } from "@dtos";

export class InvoiceRoutes {
    private router = express.Router();
    private invoiceController: InvoiceController;

    constructor() {
        const invoiceService = new InvoiceService();
        this.invoiceController = new InvoiceController(invoiceService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Invoice
        this.router.post("/invoices", validateRequest(InvoiceCreateDtoSchema), this.invoiceController.createInvoice);

        // Get All Invoices with Pagination
        this.router.get("/invoices", this.invoiceController.getAllInvoices);

        // Get Invoice by ID
        this.router.get("/invoices/:id", this.invoiceController.getInvoiceById);

        this.router.get("/fbr-details/:id", this.invoiceController.getFbrInvoiceDetails);

        // Update Invoice
        this.router.put("/invoices/:id", validateRequest(InvoiceUpdateDtoSchema), this.invoiceController.updateInvoice);

        // Delete Invoice
        this.router.delete("/invoices/:id", this.invoiceController.deleteInvoice);
    }

    public getRouter() {
        return this.router;
    }
}