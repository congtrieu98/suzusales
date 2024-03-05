"use server";

import { revalidatePath } from "next/cache";
import {
  createContract,
  deleteContract,
  updateContract,
} from "@/lib/api/contracts/mutations";
import {
  ContractId,
  NewContractParams,
  UpdateContractParams,
  contractIdSchema,
  insertContractParams,
  updateContractParams,
} from "@/lib/db/schema/contracts";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateContracts = () => revalidatePath("/contracts");

export const createContractAction = async (input: NewContractParams) => {
  try {
    const payload = insertContractParams.parse(input);
    await createContract(payload);
    revalidateContracts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateContractAction = async (input: UpdateContractParams) => {
  try {
    const payload = updateContractParams.parse(input);
    await updateContract(payload.id, payload);
    revalidateContracts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteContractAction = async (input: ContractId) => {
  try {
    const payload = contractIdSchema.parse({ id: input });
    await deleteContract(payload.id);
    revalidateContracts();
  } catch (e) {
    return handleErrors(e);
  }
};