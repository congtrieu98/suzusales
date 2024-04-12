"use server";

import { revalidatePath } from "next/cache";
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/lib/api/contacts/mutations";
import {
  ContactId,
  NewContactParams,
  UpdateContactParams,
  contactIdSchema,
  insertContactParams,
  updateContactParams,
} from "@/lib/db/schema/contacts";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateContacts = () => revalidatePath("/contacts");

export const createContactAction = async (input: NewContactParams) => {
  try {
    const payload = insertContactParams.parse(input);
    await createContact(payload);
    revalidateContacts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateContactAction = async (input: UpdateContactParams) => {
  try {
    const payload = updateContactParams.parse(input);
    await updateContact(payload.id, payload);
    revalidateContacts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteContactAction = async (input: ContactId) => {
  try {
    const payload = contactIdSchema.parse({ id: input });
    await deleteContact(payload.id);
    revalidateContacts();
  } catch (e) {
    return handleErrors(e);
  }
};