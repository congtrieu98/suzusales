import { dealSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getDeals } from "@/lib/api/deals/queries";

// Schema for deals - used to validate API requests
const baseSchema = dealSchema.omit(timestamps);

export const insertDealSchema = baseSchema.omit({ id: true });
export const insertDealParams = baseSchema
  .extend({
    name: z.string().min(1, { message: "Field is required" }),
    companyId: z.string().min(1, { message: "Field is required" }),
    dealValue: z.coerce.number().min(1, { message: "Field is required" }),
    dealOwner: z.string().min(1, { message: "Field is required" }),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateDealSchema = baseSchema;
export const updateDealParams = updateDealSchema.extend({}).omit({
  userId: true,
});
export const dealIdSchema = baseSchema.pick({ id: true });

// Types for deals - used to type API request params and within Components
export type Deal = z.infer<typeof dealSchema>;
export type NewDeal = z.infer<typeof insertDealSchema>;
export type NewDealParams = z.infer<typeof insertDealParams>;
export type UpdateDealParams = z.infer<typeof updateDealParams>;
export type DealId = z.infer<typeof dealIdSchema>["id"];

// this type infers the return from getDeals() - meaning it will include any joins
export type CompleteDeal = Awaited<
  ReturnType<typeof getDeals>
>["deals"][number];
