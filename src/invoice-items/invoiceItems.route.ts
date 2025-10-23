import * as express from "express";
import { InvoiceItemController } from "./invoiceItems.controller";
import { InvoiceItemService } from "./invoiceItems.service";
import { validateRequest } from "@middlewares/validation.middleware";
import { InvoiceItemCreateDtoSchema, InvoiceItemUpdateDtoSchema } from "@dtos";

export class InvoiceItemRoutes {
    private router = express.Router();
    private invoiceItemController: InvoiceItemController;

    constructor() {
        const invoiceItemService = new InvoiceItemService();
        this.invoiceItemController = new InvoiceItemController(invoiceItemService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create InvoiceItem
        this.router.post("/invoice-items", validateRequest(InvoiceItemCreateDtoSchema), this.invoiceItemController.createInvoiceItem);

        // Get All InvoiceItems with Pagination
        this.router.get("/invoice-items", this.invoiceItemController.getAllInvoiceItems);

        // Get InvoiceItem by ID
        this.router.get("/invoice-items/:id", this.invoiceItemController.getInvoiceItemById);

        // Update InvoiceItem
        this.router.put("/invoice-items/:id", validateRequest(InvoiceItemUpdateDtoSchema), this.invoiceItemController.updateInvoiceItem);

        // Delete InvoiceItem
        this.router.delete("/invoice-items/:id", this.invoiceItemController.deleteInvoiceItem);
    }

    public getRouter() {
        return this.router;
    }
}