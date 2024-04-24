import { cardStageSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getCardStages } from "@/lib/api/cardStages/queries";
import { title } from "process";

// Schema for cardStages - used to validate API requests
const baseSchema = cardStageSchema.omit(timestamps);

export const insertCardStageSchema = baseSchema.omit({ id: true });
export const insertCardStageParams = baseSchema
  .extend({
    title: z.string().min(1, { message: "Field is required" }),
  })
  .omit({
    id: true,
    order: true,
  });

export const updateCardStageSchema = baseSchema;
export const updateCardStageParams = updateCardStageSchema.extend({});
export const cardStageIdSchema = baseSchema.pick({ id: true });

// Types for cardStages - used to type API request params and within Components
export type CardStage = z.infer<typeof cardStageSchema>;
export type NewCardStage = z.infer<typeof insertCardStageSchema>;
export type NewCardStageParams = z.infer<typeof insertCardStageParams>;
export type UpdateCardStageParams = z.infer<typeof updateCardStageParams>;
export type CardStageId = z.infer<typeof cardStageIdSchema>["id"];

// this type infers the return from getCardStages() - meaning it will include any joins
export type CompleteCardStage = Awaited<
  ReturnType<typeof getCardStages>
>["cardStages"][number];
