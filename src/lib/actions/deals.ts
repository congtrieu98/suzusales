"use server";

import { revalidatePath } from "next/cache";
import {
  createDeal,
  deleteDeal,
  updateDeal,
} from "@/lib/api/deals/mutations";
import {
  DealId,
  NewDealParams,
  UpdateDealParams,
  dealIdSchema,
  insertDealParams,
  updateDealParams,
} from "@/lib/db/schema/deals";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateDeals = () => revalidatePath("/deals");

export const createDealAction = async (input: NewDealParams) => {
  try {
    const payload = insertDealParams.parse(input);
    await createDeal(payload);
    revalidateDeals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateDealAction = async (input: UpdateDealParams) => {
  try {
    const payload = updateDealParams.parse(input);
    await updateDeal(payload.id, payload);
    revalidateDeals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteDealAction = async (input: DealId) => {
  try {
    const payload = dealIdSchema.parse({ id: input });
    await deleteDeal(payload.id);
    revalidateDeals();
  } catch (e) {
    return handleErrors(e);
  }
};