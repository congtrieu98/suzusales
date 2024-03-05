import * as z from "zod"
import { CompleteConsultant, relatedConsultantSchema, CompleteUser, relatedUserSchema } from "./index"

export const contractSchema = z.object({
  id: z.string(),
  customerContract: z.string(),
  paymentSchedule: z.string(),
  scanContract: z.string(),
  finalContract: z.string(),
  customerAddress: z.string(),
  note: z.string(),
  status: z.string(),
  checkSteps: z.string().array(),
  consultantId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteContract extends z.infer<typeof contractSchema> {
  consultant: CompleteConsultant
  user: CompleteUser
}

/**
 * relatedContractSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedContractSchema: z.ZodSchema<CompleteContract> = z.lazy(() => contractSchema.extend({
  consultant: relatedConsultantSchema,
  user: relatedUserSchema,
}))
