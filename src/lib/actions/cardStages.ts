"use server";

import { revalidatePath } from "next/cache";
import {
  createCardStage,
  deleteCardStage,
  updateCardStage,
  updateCardStageOrder,
} from "@/lib/api/cardStages/mutations";
import {
  CardStageId,
  NewCardStageParams,
  UpdateCardStageParams,
  cardStageIdSchema,
  insertCardStageParams,
  updateCardStageParams,
} from "@/lib/db/schema/cardStages";
import { CompleteSalesStage } from "../db/schema/salesStages";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCardStages = () => revalidatePath("/card-stages");

export const createCardStageAction = async (input: NewCardStageParams) => {
  try {
    const payload = insertCardStageParams.parse(input);
    await createCardStage(payload);
    revalidateCardStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCardStageAction = async (input: UpdateCardStageParams) => {
  try {
    const payload = updateCardStageParams.parse(input);
    await updateCardStage(payload.id, payload);
    revalidateCardStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCardStageOrderAction = async (
  input: CompleteSalesStage[]
) => {
  try {
    await updateCardStageOrder(input);
    revalidateCardStages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCardStageAction = async (input: CardStageId) => {
  try {
    const payload = cardStageIdSchema.parse({ id: input });
    await deleteCardStage(payload.id);
    revalidateCardStages();
  } catch (e) {
    return handleErrors(e);
  }
};
