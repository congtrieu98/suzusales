import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getContactById } from "@/lib/api/contacts/queries";
import OptimisticContact from "./OptimisticContact";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ContactPage({
  params,
}: {
  params: { contactId: string };
}) {

  return (
    <main className="overflow-auto">
      <Contact id={params.contactId} />
    </main>
  );
}

const Contact = async ({ id }: { id: string }) => {
  await checkAuth();

  const { contact } = await getContactById(id);
  

  if (!contact) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="contacts" />
        <OptimisticContact contact={contact}  />
      </div>
    </Suspense>
  );
};
