import { z } from "zod";

const SellerDtoSchema = z.object({
  ntnCnic: z
    .string(),
   // .length(13, { message: "NTN/CNIC must be exactly 13 characters long" })
   // .regex(/^\d{13}$/, { message: "NTN/CNIC must contain only 13 digits" }),
  businessName: z
    .string()
    .min(1, { message: "Business name is required" })
    .max(255, { message: "Business name must not exceed 255 characters" }),
  province: z
    .string()
    .min(1, { message: "Province is required" })
    .max(55, { message: "Province must not exceed 55 characters" }),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(55, { message: "City must not exceed 55 characters" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(1000, { message: "Address must not exceed 1000 characters" }),
}).strict(); 

export type SellerDto = z.infer<typeof SellerDtoSchema>;

export { SellerDtoSchema };