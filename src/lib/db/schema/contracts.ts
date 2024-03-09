import { contractSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getContracts } from "@/lib/api/contracts/queries";


// Schema for contracts - used to validate API requests
const baseSchema = contractSchema.omit(timestamps)

export const insertContractSchema = baseSchema.omit({ id: true });
export const insertContractParams = baseSchema.extend({
  consultantId: z.coerce.string().min(1),
  customerContract: z.string().min(1, { message: "Field is required" })
}).omit({
  id: true,
  userId: true,
  checkSteps: true
});

export const insertContractParamsCustom = baseSchema.extend({
  consultantId: z.coerce.string().min(1)
}).omit({
  id: true,
  userId: true,
});

export const updateContractSchema = baseSchema;
export const updateContractParams = updateContractSchema.extend({
  consultantId: z.coerce.string().min(1)
}).omit({
  userId: true
});
export const contractIdSchema = baseSchema.pick({ id: true });

// Types for contracts - used to type API request params and within Components
export type Contract = z.infer<typeof contractSchema>;
export type NewContract = z.infer<typeof insertContractSchema>;
export type NewContractParams = z.infer<typeof insertContractParamsCustom>;
export type UpdateContractParams = z.infer<typeof updateContractParams>;
export type ContractId = z.infer<typeof contractIdSchema>["id"];

// this type infers the return from getContracts() - meaning it will include any joins
export type CompleteContract = Awaited<ReturnType<typeof getContracts>>["contracts"][number];

