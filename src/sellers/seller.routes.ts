import * as express from "express";
import { SellerController } from "./sellers.controller";
import { SellerService } from "./seller.service";
import { validateRequest } from "@middlewares/validation.middleware";
import { SellerDtoSchema, SellerUpdateDtoSchema } from "@dtos";

export class SellerRoutes {
    private router = express.Router();
    private sellerController: SellerController;

    constructor() {
        const sellerService = new SellerService();
        this.sellerController = new SellerController(sellerService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Seller
        this.router.post("/sellers", validateRequest(SellerDtoSchema), this.sellerController.createSeller);

        // Get All Sellers with Pagination
        this.router.get("/sellers", this.sellerController.getAllSellers);

        // Get Seller by ID
        this.router.get("/sellers/:id", this.sellerController.getSellerById);

        // Update Seller
        this.router.put("/sellers/:id", validateRequest(SellerUpdateDtoSchema), this.sellerController.updateSeller);

        // Delete Seller
        this.router.delete("/sellers/:id", this.sellerController.deleteSeller);
    }

     getRouter() {
        return this.router;
    }
}