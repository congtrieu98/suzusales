import { consultantStaffSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getConsultantStaffs } from "@/lib/api/consultantStaff/queries";

// Schema for consultantStaff - used to validate API requests
export const insertConsultantStafSchema = consultantStaffSchema.omit({
  id: true,
});

export const insertConsultantStafParams = consultantStaffSchema
  .extend({})
  .omit({
    id: true,
  });

export const updateConsultantStafSchema = consultantStaffSchema;

export const updateConsultantStafParams = updateConsultantStafSchema.extend({});

export const consultantStafIdSchema = updateConsultantStafSchema.pick({
  id: true,
});

// Types for consultantStaff - used to type API request params and within Components
export type ConsultantStaf = z.infer<typeof updateConsultantStafSchema>;
export type NewConsultantStaf = z.infer<typeof insertConsultantStafSchema>;
export type NewConsultantStafParams = z.infer<
  typeof insertConsultantStafParams
>;
export type UpdateConsultantStafParams = z.infer<
  typeof updateConsultantStafParams
>;
export type ConsultantStafId = z.infer<typeof consultantStafIdSchema>["id"];

// this type infers the return from getConsultantStaff() - meaning it will include any joins
export type CompleteConsultantStaff = Awaited<
  ReturnType<typeof getConsultantStaffs>
>["consultantStaff"][number];
