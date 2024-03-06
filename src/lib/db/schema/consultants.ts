import { consultantSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getConsultants } from "@/lib/api/consultants/queries";

// Schema for consultants - used to validate API requests
const baseSchema = consultantSchema.omit(timestamps);

export const insertConsultantSchema = baseSchema.omit({
  id: true,
});
export const insertConsultantParams = baseSchema
  .extend({
    airDate: z.coerce.date(),
    customerName: z.string().min(1, { message: "Field is required" }),
    projectName: z.string().min(1, { message: "Field is required" }),
  })
  .omit({
    id: true,
    userId: true,
    creator: true,
    airDate: true,
  });

export const insertConsultantParamsCustom = baseSchema
  .extend({
    airDate: z.coerce.date(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateConsultantSchema = baseSchema;
export const updateConsultantParams = updateConsultantSchema
  .extend({
    airDate: z.coerce.date(),
  })
  .omit({
    userId: true,
  });
export const consultantIdSchema = baseSchema.pick({ id: true });

// Types for consultants - used to type API request params and within Components
export type Consultant = z.infer<typeof consultantSchema>;
export type NewConsultant = z.infer<typeof insertConsultantSchema>;
export type NewConsultantParams = z.infer<typeof insertConsultantParamsCustom>;
export type UpdateConsultantParams = z.infer<typeof updateConsultantParams>;
export type ConsultantId = z.infer<typeof consultantIdSchema>["id"];

// this type infers the return from getConsultants() - meaning it will include any joins
export type CompleteConsultant = Awaited<
  ReturnType<typeof getConsultants>
>["consultants"][number];
