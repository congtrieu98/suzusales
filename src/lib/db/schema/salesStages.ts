import { salesStageSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getSalesStages } from "@/lib/api/salesStages/queries";

// Schema for salesStages - used to validate API requests
const baseSchema = salesStageSchema.omit(timestamps);

export const insertSalesStageSchema = baseSchema.omit({ id: true });
export const insertSalesStageParams = baseSchema
  .extend({
    name: z.string().min(1, { message: "Field is required" }),
  })
  .omit({
    id: true,
    userId: true,
    order: true,
  });

export const updateSalesStageSchema = baseSchema;
export const updateSalesStageParams = updateSalesStageSchema.extend({}).omit({
  userId: true,
});
export const salesStageIdSchema = baseSchema.pick({ id: true });

// Types for salesStages - used to type API request params and within Components
export type SalesStage = z.infer<typeof salesStageSchema>;
export type NewSalesStage = z.infer<typeof insertSalesStageSchema>;
export type NewSalesStageParams = z.infer<typeof insertSalesStageParams>;
export type UpdateSalesStageParams = z.infer<typeof updateSalesStageParams>;
export type SalesStageId = z.infer<typeof salesStageIdSchema>["id"];

// this type infers the return from getSalesStages() - meaning it will include any joins
export type CompleteSalesStage = Awaited<
  ReturnType<typeof getSalesStages>
>["salesStages"][number];
