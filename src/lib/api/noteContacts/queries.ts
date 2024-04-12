import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type NoteContactId, noteContactIdSchema } from "@/lib/db/schema/noteContacts";

export const getNoteContacts = async () => {
  const { session } = await getUserAuth();
  const n = await db.noteContact.findMany({ where: {userId: session?.user.id!}});
  return { noteContacts: n };
};

export const getNoteContactById = async (id: NoteContactId) => {
  const { session } = await getUserAuth();
  const { id: noteContactId } = noteContactIdSchema.parse({ id });
  const n = await db.noteContact.findFirst({
    where: { id: noteContactId, userId: session?.user.id!}});
  return { noteContact: n };
};


