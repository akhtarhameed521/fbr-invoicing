import * as express from "express";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { validateRequest } from "@middlewares/validation.middleware";
import { CustomerCreateDtoSchema, CustomerUpdateDtoSchema } from "@dtos";

export class CustomerRoutes {
    private router = express.Router();
    private customerController: CustomerController;

    constructor() {
        const customerService = new CustomerService();
        this.customerController = new CustomerController(customerService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Customer
        this.router.post("/customers", validateRequest(CustomerCreateDtoSchema), this.customerController.createCustomer);

        // Get All Customers with Pagination
        this.router.get("/customers", this.customerController.getAllCustomers);

        // Get Customer by ID
        this.router.get("/customers/:id", this.customerController.getCustomerById);

        // Update Customer
        this.router.put("/customers/:id", validateRequest(CustomerUpdateDtoSchema), this.customerController.updateCustomer);

        // Delete Customer
        this.router.delete("/customers/:id", this.customerController.deleteCustomer);
    }

    public getRouter() {
        return this.router;
    }
}