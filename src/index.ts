import "reflect-metadata";
import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";

dotenv.config();

import AppDataSource from "./config/db-config";
import { errorHandler } from "@middlewares/error-handler.middleware";
const app = express();

import { CustomerRoutes, InvoiceItemRoutes, InvoiceRoutes, ProductRoutes, SellerRoutes } from "./app";

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL with TypeORM");

    app.use(express.json());
    app.use(cors({
      origin: "*",
      methods: ['PUT', "POST", "GET", "DELETE", "PATCH"],
      credentials: true
    }));

    const sellerRoutes = new SellerRoutes();
    const customerRoutes = new CustomerRoutes();
    const productRoutes = new ProductRoutes();
    const invoiceRoutes = new InvoiceRoutes();
    const invoiceItemRoutes = new InvoiceItemRoutes();

    // Ensure getRouter is called with parentheses
    app.use("/api", sellerRoutes.getRouter());
    app.use("/api", customerRoutes.getRouter());
    app.use("/api", productRoutes.getRouter());
    app.use("/api", invoiceRoutes.getRouter());
    app.use("/api", invoiceItemRoutes.getRouter());

    app.use(errorHandler);

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port} at 01:56 PM PKT, September 21, 2025`);
    });
  } catch (error) {
    console.log("Error connecting to database", error);
  }
})();