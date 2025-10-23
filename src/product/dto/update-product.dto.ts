
import { z } from "zod";

const ProductUpdateDtoSchema = z.object({
  hsCode: z
    .string()
   // .length(10, { message: "HS Code must be exactly 10 characters long" })
   // .regex(/^[0-9A-Za-z-]+$/, { message: "HS Code must contain only alphanumeric characters and hyphens" })
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required if provided" })
    .max(255, { message: "Description must not exceed 255 characters" })
    .optional(),
  uom: z
    .string()
    .min(1, { message: "Unit of Measure is required if provided" })
    .max(50, { message: "Unit of Measure must not exceed 50 characters" })
    .optional(),
  taxRate: z
    .number()
    .min(0, { message: "Tax rate must be at least 0" })
    .max(100, { message: "Tax rate must not exceed 100" })
    .refine((val) => Number.isFinite(val), { message: "Tax rate must be a valid number" })
    .optional(),
  saleType: z
    .string()
    .min(1, { message: "Sale type is required if provided" })
    .max(50, { message: "Sale type must not exceed 50 characters" })
    .optional(),
  fixedPrice: z
    .number()
    .min(0, { message: "Fixed price must be at least 0" })
    .refine((val) => Number.isFinite(val), { message: "Fixed price must be a valid number" })
    .optional(),
}).strict();

export type ProductUpdateDto = z.infer<typeof ProductUpdateDtoSchema>;

export { ProductUpdateDtoSchema };