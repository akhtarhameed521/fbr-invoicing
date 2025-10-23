import { z } from "zod";


const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
}).strict();

export type PaginationDto = z.infer<typeof PaginationSchema>;

export { PaginationSchema };