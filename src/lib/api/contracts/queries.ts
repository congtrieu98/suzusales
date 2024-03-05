import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type ContractId, contractIdSchema } from "@/lib/db/schema/contracts";

export const getContracts = async () => {
  const { session } = await getUserAuth();
  const c = await db.contract.findMany({ where: {userId: session?.user.id!}, include: { consultant: true}});
  return { contracts: c };
};

export const getContractById = async (id: ContractId) => {
  const { session } = await getUserAuth();
  const { id: contractId } = contractIdSchema.parse({ id });
  const c = await db.contract.findFirst({
    where: { id: contractId, userId: session?.user.id!},
    include: { consultant: true }
  });
  return { contract: c };
};


