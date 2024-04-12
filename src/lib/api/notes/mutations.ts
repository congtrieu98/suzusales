import { db } from "@/lib/db/index";
import { 
  NoteId, 
  NewNoteParams,
  UpdateNoteParams, 
  updateNoteSchema,
  insertNoteSchema, 
  noteIdSchema 
} from "@/lib/db/schema/notes";
import { getUserAuth } from "@/lib/auth/utils";

export const createNote = async (note: NewNoteParams) => {
  const { session } = await getUserAuth();
  const newNote = insertNoteSchema.parse({ ...note, userId: session?.user.id! });
  try {
    const n = await db.note.create({ data: newNote });
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateNote = async (id: NoteId, note: UpdateNoteParams) => {
  const { session } = await getUserAuth();
  const { id: noteId } = noteIdSchema.parse({ id });
  const newNote = updateNoteSchema.parse({ ...note, userId: session?.user.id! });
  try {
    const n = await db.note.update({ where: { id: noteId, userId: session?.user.id! }, data: newNote})
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteNote = async (id: NoteId) => {
  const { session } = await getUserAuth();
  const { id: noteId } = noteIdSchema.parse({ id });
  try {
    const n = await db.note.delete({ where: { id: noteId, userId: session?.user.id! }})
    return { note: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

