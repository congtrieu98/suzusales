import { db } from "@/lib/db/index";
import {
  CompanyId,
  NewCompanyParams,
  UpdateCompanyParams,
  updateCompanySchema,
  insertCompanySchema,
  companyIdSchema
} from "@/lib/db/schema/companies";
import { getUserAuth } from "@/lib/auth/utils";

export const createCompany = async (company: NewCompanyParams) => {
  const { session } = await getUserAuth();
  const newCompany = insertCompanySchema.parse(
    {
      ...company,
      userId: session?.user.id!,

    });
  console.log("NewCompanyParams:", company)
  try {
    // const c = await db.company.create({ data: newCompany });
    // return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCompany = async (id: CompanyId, company: UpdateCompanyParams) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  const newCompany = updateCompanySchema.parse({ ...company, userId: session?.user.id! });
  try {
    const c = await db.company.update({ where: { id: companyId, userId: session?.user.id! }, data: newCompany })
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCompany = async (id: CompanyId) => {
  const { session } = await getUserAuth();
  const { id: companyId } = companyIdSchema.parse({ id });
  try {
    const c = await db.company.delete({ where: { id: companyId, userId: session?.user.id! } })
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

