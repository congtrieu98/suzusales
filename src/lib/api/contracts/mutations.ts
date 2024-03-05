import { db } from "@/lib/db/index";
import { 
  ContractId, 
  NewContractParams,
  UpdateContractParams, 
  updateContractSchema,
  insertContractSchema, 
  contractIdSchema 
} from "@/lib/db/schema/contracts";
import { getUserAuth } from "@/lib/auth/utils";

export const createContract = async (contract: NewContractParams) => {
  const { session } = await getUserAuth();
  const newContract = insertContractSchema.parse({ ...contract, userId: session?.user.id! });
  try {
    const c = await db.contract.create({ data: newContract });
    return { contract: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateContract = async (id: ContractId, contract: UpdateContractParams) => {
  const { session } = await getUserAuth();
  const { id: contractId } = contractIdSchema.parse({ id });
  const newContract = updateContractSchema.parse({ ...contract, userId: session?.user.id! });
  try {
    const c = await db.contract.update({ where: { id: contractId, userId: session?.user.id! }, data: newContract})
    return { contract: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteContract = async (id: ContractId) => {
  const { session } = await getUserAuth();
  const { id: contractId } = contractIdSchema.parse({ id });
  try {
    const c = await db.contract.delete({ where: { id: contractId, userId: session?.user.id! }})
    return { contract: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

