import { z } from "zod";

const InvoiceItemUpdateDtoSchema = z.object({
  invoiceId: z.string().optional(),
  productId: z.string().optional(),
  quantity: z
    .number()
    .min(0.0001, { message: "Quantity must be greater than 0" })
    .max(999999.9999, { message: "Quantity must not exceed 999999.9999" })
    .optional(),
  unitPrice: z
    .number()
    .min(0, { message: "Unit price must be at least 0" })
    .optional(),
  discount: z
    .number()
    .min(0, { message: "Discount must be at least 0" })
    .max(100, { message: "Discount must not exceed 100%" })
    .optional(),
  valueExclSt: z
    .number()
    .min(0, { message: "Value excluding tax must be at least 0" })
    .optional(),
  salesTaxApplicable: z
    .number()
    .min(0, { message: "Sales tax applicable must be at least 0" })
    .optional(),
  salesTaxWithheld: z
    .number()
    .min(0, { message: "Sales tax withheld must be at least 0" })
    .optional(),
  extraTax: z
    .number()
    .min(0, { message: "Extra tax must be at least 0" })
    .optional(),
  furtherTax: z
    .number()
    .min(0, { message: "Further tax must be at least 0" })
    .optional(),
  fedPayable: z
    .number()
    .min(0, { message: "FED payable must be at least 0" })
    .optional(),
  sroScheduleNo: z
    .string()
    .max(50, { message: "SRO Schedule No must not exceed 50 characters" })
    .optional(),
  sroItemSerialNo: z
    .string()
    .max(50, { message: "SRO Item Serial No must not exceed 50 characters" })
    .optional(),
}).strict();

export type InvoiceItemUpdateDto = z.infer<typeof InvoiceItemUpdateDtoSchema>;

export { InvoiceItemUpdateDtoSchema };