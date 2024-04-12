import { db } from "@/lib/db/index";
import { 
  ContactId, 
  NewContactParams,
  UpdateContactParams, 
  updateContactSchema,
  insertContactSchema, 
  contactIdSchema 
} from "@/lib/db/schema/contacts";
import { getUserAuth } from "@/lib/auth/utils";

export const createContact = async (contact: NewContactParams) => {
  const { session } = await getUserAuth();
  const newContact = insertContactSchema.parse({ ...contact, userId: session?.user.id! });
  try {
    const c = await db.contact.create({ data: newContact });
    return { contact: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateContact = async (id: ContactId, contact: UpdateContactParams) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  const newContact = updateContactSchema.parse({ ...contact, userId: session?.user.id! });
  try {
    const c = await db.contact.update({ where: { id: contactId, userId: session?.user.id! }, data: newContact})
    return { contact: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteContact = async (id: ContactId) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  try {
    const c = await db.contact.delete({ where: { id: contactId, userId: session?.user.id! }})
    return { contact: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

