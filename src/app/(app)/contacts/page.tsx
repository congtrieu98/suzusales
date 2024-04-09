import { Suspense } from "react";

import Loading from "@/app/loading";
import ContactList from "@/components/contacts/ContactList";
import { getContacts } from "@/lib/api/contacts/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ContactsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Contacts</h1>
        </div>
        <Contacts />
      </div>
    </main>
  );
}

const Contacts = async () => {
  await checkAuth();

  const { contacts } = await getContacts();
  
  return (
    <Suspense fallback={<Loading />}>
      <ContactList contacts={contacts}  />
    </Suspense>
  );
};
