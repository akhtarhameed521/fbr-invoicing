import { z } from "zod";

// Schema for creating a new invoice (required fields + relationships)
const InvoiceCreateDtoSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, { message: "Invoice number is required" })
    .max(50, { message: "Invoice number must not exceed 50 characters" }),
  invoiceType: z
    .string()
    .min(1, { message: "Invoice type is required" })
    .max(50, { message: "Invoice type must not exceed 50 characters" })
    .refine((val) => ["Sale Invoice", "Debit Note"].includes(val), {
      message: "Invoice type must be 'Sale Invoice' or 'Debit Note'",
    }),
  invoiceDate: z.coerce.date({ message: "Invoice date is required" }),
  refNo: z
    .string()
    .max(30, { message: "Reference number must not exceed 30 characters" })
    .optional(),
  scenarioId: z
    .string()
    .max(10, { message: "Scenario ID must not exceed 10 characters" })
    .optional(),
  sellerId: z.string({ message: "Seller ID is required" }), // Assuming UUID from BaseAppEntity
  customerId: z.string({ message: "Customer ID is required" }), // Assuming UUID from BaseAppEntity
  items: z.array(z.object({
    productId: z.string({ message: "Product ID is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    unitPrice: z.number().min(0, { message: "Unit price must be at least 0" }),
  })).min(1, { message: "At least one item is required" }),
}).strict();

export type InvoiceCreateDto = z.infer<typeof InvoiceCreateDtoSchema>;

export { InvoiceCreateDtoSchema };

