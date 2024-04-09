import { companySchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getCompanies } from "@/lib/api/companies/queries";


// Schema for companies - used to validate API requests
const baseSchema = companySchema.omit(timestamps)

export const insertCompanySchema = baseSchema.omit({ id: true });
export const insertCompanyParams = baseSchema.extend({
  name: z.string().min(1, { message: "Field is required" }),
  salesOwner: z.string().min(1, { message: "Field is required" }),
}).omit({
  id: true,
  userId: true
});

export const updateCompanySchema = baseSchema;
export const updateCompanyParams = updateCompanySchema.extend({}).omit({
  userId: true
});
export const companyIdSchema = baseSchema.pick({ id: true });

// Types for companies - used to type API request params and within Components
export type Company = z.infer<typeof companySchema>;
export type NewCompany = z.infer<typeof insertCompanySchema>;
export type NewCompanyParams = z.infer<typeof insertCompanyParams>;
export type UpdateCompanyParams = z.infer<typeof updateCompanyParams>;
export type CompanyId = z.infer<typeof companyIdSchema>["id"];

// this type infers the return from getCompanies() - meaning it will include any joins
export type CompleteCompany = Awaited<ReturnType<typeof getCompanies>>["companies"][number];

