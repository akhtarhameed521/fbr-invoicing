import { z } from "zod";


// Schema for updating an invoice (partial, most fields optional)
const InvoiceUpdateDtoSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, { message: "Invoice number is required if provided" })
    .max(50, { message: "Invoice number must not exceed 50 characters" })
    .optional(),
  invoiceType: z
    .string()
    .min(1, { message: "Invoice type is required if provided" })
    .max(50, { message: "Invoice type must not exceed 50 characters" })
    .refine((val) => ["Sale Invoice", "Debit Note"].includes(val), {
      message: "Invoice type must be 'Sale Invoice' or 'Debit Note'",
    })
    .optional(),
  invoiceDate: z.coerce.date({ message: "Invoice date is required" }).optional(),
  refNo: z
    .string()
    .max(30, { message: "Reference number must not exceed 30 characters" })
    .optional(),
  scenarioId: z
    .string()
    .max(10, { message: "Scenario ID must not exceed 10 characters" })
    .optional(),
  sellerId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }).optional(),
    unitPrice: z.number().min(0, { message: "Unit price must be at least 0" }).optional(),
  })).optional(),
  InvoiceStatus: z
    .string()
    .max(20, { message: "Invoice status must not exceed 20 characters" })
    .refine((val) => ["Draft", "Submitted", "Error"].includes(val), {
      message: "Invoice status must be 'Draft', 'Submitted', or 'Error'",
    })
    .optional(),
}).strict();

export type InvoiceUpdateDto = z.infer<typeof InvoiceUpdateDtoSchema>;

export { InvoiceUpdateDtoSchema };