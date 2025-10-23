import { z } from "zod";


const SellerUpdateDtoSchema = z.object({
  ntnCnic: z
    .string()
    .length(13, { message: "NTN/CNIC must be exactly 13 characters long" })
    .regex(/^\d{13}$/, { message: "NTN/CNIC must contain only 13 digits" })
    .optional(),
  businessName: z
    .string()
    .min(1, { message: "Business name is required if provided" })
    .max(255, { message: "Business name must not exceed 255 characters" })
    .optional(),
  province: z
    .string()
    .min(1, { message: "Province is required if provided" })
    .max(55, { message: "Province must not exceed 55 characters" })
    .optional(),
  city: z
    .string()
    .min(1, { message: "City is required if provided" })
    .max(55, { message: "City must not exceed 55 characters" })
    .optional(),
  address: z
    .string()
    .min(1, { message: "Address is required if provided" })
    .max(1000, { message: "Address must not exceed 1000 characters" })
    .optional(),
}).strict();

export type SellerUpdateDto = z.infer<typeof SellerUpdateDtoSchema>;

export { SellerUpdateDtoSchema };