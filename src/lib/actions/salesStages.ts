"use server";

import { revalidatePath } from "next/cache";
import {
  copySalesStage,
  createSalesStage,
  deleteSalesStage,
  updateSalesStage,
  updateSalesStageOrder,
} from "@/lib/api/salesStages/mutations";
import {
  SalesStageId,
  NewSalesStageParams,
  UpdateSalesStageParams,
  salesStageIdSchema,
  insertSalesStageParams,
  updateSalesStageParams,
  CompleteSalesStage,
} from "@/lib/db/schema/salesStages";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateSalesStages = () => revalidatePath("/sales-stages");

export const createSalesStageAction = async (input: NewSalesStageParams) => {
  try {
    const payload = insertSalesStageParams.parse(input);
    await createSalesStage(payload);
    revalidateSalesStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSalesStageAction = async (input: UpdateSalesStageParams) => {
  try {
    const payload = updateSalesStageParams.parse(input);
    await updateSalesStage(payload.id, payload);
    revalidateSalesStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSalesStageOrderAction = async (
  input: CompleteSalesStage[]
) => {
  try {
    await updateSalesStageOrder(input);
    revalidateSalesStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteSalesStageAction = async (input: SalesStageId) => {
  try {
    const payload = salesStageIdSchema.parse({ id: input });
    await deleteSalesStage(payload.id);
    revalidateSalesStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const copySalesStageAction = async (input: SalesStageId) => {
  try {
    const payload = salesStageIdSchema.parse({ id: input });
    await copySalesStage(payload.id);
    revalidateSalesStages();
  } catch (e) {
    return handleErrors(e);
  }
};
