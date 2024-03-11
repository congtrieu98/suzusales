import * as z from "zod"

export const staffSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
