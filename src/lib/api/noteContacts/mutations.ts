import { db } from "@/lib/db/index";
import { 
  NoteContactId, 
  NewNoteContactParams,
  UpdateNoteContactParams, 
  updateNoteContactSchema,
  insertNoteContactSchema, 
  noteContactIdSchema 
} from "@/lib/db/schema/noteContacts";
import { getUserAuth } from "@/lib/auth/utils";

export const createNoteContact = async (noteContact: NewNoteContactParams) => {
  const { session } = await getUserAuth();
  const newNoteContact = insertNoteContactSchema.parse({ ...noteContact, userId: session?.user.id! });
  try {
    const n = await db.noteContact.create({ data: newNoteContact });
    return { noteContact: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateNoteContact = async (id: NoteContactId, noteContact: UpdateNoteContactParams) => {
  const { session } = await getUserAuth();
  const { id: noteContactId } = noteContactIdSchema.parse({ id });
  const newNoteContact = updateNoteContactSchema.parse({ ...noteContact, userId: session?.user.id! });
  try {
    const n = await db.noteContact.update({ where: { id: noteContactId, userId: session?.user.id! }, data: newNoteContact})
    return { noteContact: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteNoteContact = async (id: NoteContactId) => {
  const { session } = await getUserAuth();
  const { id: noteContactId } = noteContactIdSchema.parse({ id });
  try {
    const n = await db.noteContact.delete({ where: { id: noteContactId, userId: session?.user.id! }})
    return { noteContact: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

