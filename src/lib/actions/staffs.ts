"use server";

import { revalidatePath } from "next/cache";
import {
  createStaff,
  deleteStaff,
  updateStaff,
} from "@/lib/api/staffs/mutations";
import {
  StaffId,
  NewStaffParams,
  UpdateStaffParams,
  staffIdSchema,
  insertStaffParams,
  updateStaffParams,
} from "@/lib/db/schema/staffs";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateStaffs = () => revalidatePath("/staffs");

export const createStaffAction = async (input: NewStaffParams) => {
  try {
    const payload = insertStaffParams.parse(input);
    await createStaff(payload);
    revalidateStaffs();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateStaffAction = async (input: UpdateStaffParams) => {
  try {
    const payload = updateStaffParams.parse(input);
    await updateStaff(payload.id, payload);
    revalidateStaffs();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteStaffAction = async (input: StaffId) => {
  try {
    const payload = staffIdSchema.parse({ id: input });
    await deleteStaff(payload.id);
    revalidateStaffs();
  } catch (e) {
    return handleErrors(e);
  }
};