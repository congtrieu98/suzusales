import * as z from "zod"
import { CompleteConsultantStaff, relatedConsultantStaffSchema } from "./index"

export const staffSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteStaff extends z.infer<typeof staffSchema> {
  ConsultantStaff: CompleteConsultantStaff[]
}

/**
 * relatedStaffSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedStaffSchema: z.ZodSchema<CompleteStaff> = z.lazy(() => staffSchema.extend({
  ConsultantStaff: relatedConsultantStaffSchema.array(),
}))
