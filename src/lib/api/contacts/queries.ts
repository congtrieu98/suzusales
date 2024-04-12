import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type ContactId, contactIdSchema } from "@/lib/db/schema/contacts";

export const getContacts = async () => {
  const { session } = await getUserAuth();
  const c = await db.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      company: true
    },
  });
  return { contacts: c };
};

export const getContactById = async (id: ContactId) => {
  const { session } = await getUserAuth();
  const { id: contactId } = contactIdSchema.parse({ id });
  const c = await db.contact.findFirst({
    where: { id: contactId },
    include: {
      user: true,
      company: true
    }
  });
  return { contact: c };
};
