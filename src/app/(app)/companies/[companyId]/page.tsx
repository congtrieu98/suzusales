import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCompanyById } from "@/lib/api/companies/queries";
import OptimisticCompany from "./OptimisticCompany";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getContacts } from "@/lib/api/contacts/queries";

export const revalidate = 0;

export default async function CompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  return (
    <main className="overflow-auto">
      <Company id={params.companyId} />
    </main>
  );
}

const Company = async ({ id }: { id: string }) => {
  await checkAuth();

  const { company } = await getCompanyById(id);
  const { contacts } = await getContacts();

  if (!company) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="companies" />
        <OptimisticCompany company={company} contacts={contacts} />
      </div>
    </Suspense>
  );
};
