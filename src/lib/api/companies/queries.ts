import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type CompanyId, companyIdSchema } from "@/lib/db/schema/companies";

export const getCompanies = async () => {
  const { session } = await getUserAuth();
  const c = await db.company.findMany({
    // where: {userId: session?.user.id!},
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
  return { companies: c };
};

export const getCompanyById = async (id: CompanyId) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  const c = await db.company.findFirst({
    where: { id: companyId },
  });
  return { company: c };
};
