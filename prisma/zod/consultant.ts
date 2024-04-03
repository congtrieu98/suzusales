import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteContract, relatedContractSchema } from "./index"

export const consultantSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  projectName: z.string(),
  content: z.string(),
  airDate: z.date(),
  status: z.string(),
  creator: z.string(),
  userId: z.string(),
  assignedId: z.string().array(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteConsultant extends z.infer<typeof consultantSchema> {
  user: CompleteUser
  Contract: CompleteContract[]
}

/**
 * relatedConsultantSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedConsultantSchema: z.ZodSchema<CompleteConsultant> = z.lazy(() => consultantSchema.extend({
  user: relatedUserSchema,
  Contract: relatedContractSchema.array(),
}))
