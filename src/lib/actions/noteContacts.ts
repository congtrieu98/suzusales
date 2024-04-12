"use server";

import { revalidatePath } from "next/cache";
import {
  createNoteContact,
  deleteNoteContact,
  updateNoteContact,
} from "@/lib/api/noteContacts/mutations";
import {
  NoteContactId,
  NewNoteContactParams,
  UpdateNoteContactParams,
  noteContactIdSchema,
  insertNoteContactParams,
  updateNoteContactParams,
} from "@/lib/db/schema/noteContacts";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateNoteContacts = () => revalidatePath("/note-contacts");

export const createNoteContactAction = async (input: NewNoteContactParams) => {
  try {
    const payload = insertNoteContactParams.parse(input);
    await createNoteContact(payload);
    revalidateNoteContacts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateNoteContactAction = async (input: UpdateNoteContactParams) => {
  try {
    const payload = updateNoteContactParams.parse(input);
    await updateNoteContact(payload.id, payload);
    revalidateNoteContacts();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteNoteContactAction = async (input: NoteContactId) => {
  try {
    const payload = noteContactIdSchema.parse({ id: input });
    await deleteNoteContact(payload.id);
    revalidateNoteContacts();
  } catch (e) {
    return handleErrors(e);
  }
};