import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type NoteId, noteIdSchema } from "@/lib/db/schema/notes";

export const getNotes = async () => {
  const { session } = await getUserAuth();
  const n = await db.note.findMany({
    include: {
      company: true,
      user: true,
    },
  });
  return { notes: n };
};

export const getNoteById = async (id: NoteId) => {
  const { session } = await getUserAuth();
  const { id: noteId } = noteIdSchema.parse({ id });
  const n = await db.note.findFirst({
    where: { id: noteId },
    include: {
      company: true,
      user: true,
    },
  });
  return { note: n };
};
