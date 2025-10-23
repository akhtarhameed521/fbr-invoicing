import * as express from "express";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { validateRequest } from "@middlewares/validation.middleware";
import { ProductCreateDtoSchema, ProductUpdateDtoSchema } from "@dtos";

export class ProductRoutes {
    private router = express.Router();
    private productController: ProductController;

    constructor() {
        const productService = new ProductService();
        this.productController = new ProductController(productService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Product
        this.router.post("/products", validateRequest(ProductCreateDtoSchema), this.productController.createProduct);

        // Get All Products with Pagination
        this.router.get("/products", this.productController.getAllProducts);

        // Get Product by ID
        this.router.get("/products/:id", this.productController.getProductById);

        // Update Product
        this.router.put("/products/:id", validateRequest(ProductUpdateDtoSchema), this.productController.updateProduct);

        // Delete Product
        this.router.delete("/products/:id", this.productController.deleteProduct);
    }

    public getRouter() {
        return this.router;
    }
}