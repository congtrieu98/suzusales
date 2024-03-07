"use server";

import { revalidatePath } from "next/cache";
import {
  createConsultant,
  deleteConsultant,
  updateConsultant,
} from "@/lib/api/consultants/mutations";
import {
  ConsultantId,
  NewConsultantParams,
  UpdateConsultantParams,
  consultantIdSchema,
  insertConsultantParams,
  insertConsultantParamsCustom,
  updateConsultantParams,
} from "@/lib/db/schema/consultants";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateConsultants = () => revalidatePath("/consultants");

export const createConsultantAction = async (input: NewConsultantParams) => {
  try {
    const payload = insertConsultantParamsCustom.parse(input);
    await createConsultant(payload);
    revalidateConsultants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateConsultantAction = async (input: UpdateConsultantParams) => {
  try {
    const payload = updateConsultantParams.parse(input);
    await updateConsultant(payload.id, payload);
    revalidateConsultants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteConsultantAction = async (input: ConsultantId) => {
  try {
    const payload = consultantIdSchema.parse({ id: input });
    // await deleteConsultant(payload.id);
    revalidateConsultants();
  } catch (e) {
    return handleErrors(e);
  }
};
