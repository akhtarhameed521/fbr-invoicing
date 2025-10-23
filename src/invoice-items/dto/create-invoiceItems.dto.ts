import { z } from "zod";

// Schema for creating a new invoice item (required fields + relationships)
const InvoiceItemCreateDtoSchema = z.object({
  invoiceId: z.number({ error: "Invoice ID is required" }), // Assuming UUID from BaseAppEntity
  productId: z.number({ error: "Product ID is required" }), // Assuming UUID from BaseAppEntity
  quantity: z
    .number()
    .min(0.0001, { message: "Quantity must be greater than 0" })
    .max(999999.9999, { message: "Quantity must not exceed 999999.9999" }),
  unitPrice: z
    .number()
    .min(0, { message: "Unit price must be at least 0" }),
  discount: z
    .number()
    .min(0, { message: "Discount must be at least 0" })
    .max(100, { message: "Discount must not exceed 100%" })
    .default(0.00),
  valueExclSt: z
    .number()
    .min(0, { message: "Value excluding tax must be at least 0" })
    .optional(), // Can be calculated
  salesTaxApplicable: z
    .number()
    .min(0, { message: "Sales tax applicable must be at least 0" })
    .optional(), // Can be calculated
  salesTaxWithheld: z
    .number()
    .min(0, { message: "Sales tax withheld must be at least 0" })
    .default(0.00),
  extraTax: z
    .number()
    .min(0, { message: "Extra tax must be at least 0" })
    .default(0.00),
  furtherTax: z
    .number()
    .min(0, { message: "Further tax must be at least 0" })
    .default(0.00),
  fedPayable: z
    .number()
    .min(0, { message: "FED payable must be at least 0" })
    .default(0.00),
  sroScheduleNo: z
    .string()
    .max(50, { message: "SRO Schedule No must not exceed 50 characters" })
    .optional(),
  sroItemSerialNo: z
    .string()
    .max(50, { message: "SRO Item Serial No must not exceed 50 characters" })
    .optional(),
}).strict();

export type InvoiceItemCreateDto = z.infer<typeof InvoiceItemCreateDtoSchema>;

export { InvoiceItemCreateDtoSchema };

