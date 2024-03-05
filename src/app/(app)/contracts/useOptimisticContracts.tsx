import { type Consultant } from "@/lib/db/schema/consultants";
import { type Contract, type CompleteContract } from "@/lib/db/schema/contracts";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Contract>) => void;

export const useOptimisticContracts = (
  contracts: CompleteContract[],
  consultants: Consultant[]
) => {
  const [optimisticContracts, addOptimisticContract] = useOptimistic(
    contracts,
    (
      currentState: CompleteContract[],
      action: OptimisticAction<Contract>,
    ): CompleteContract[] => {
      const { data } = action;

      const optimisticConsultant = consultants.find(
        (consultant) => consultant.id === data.consultantId,
      )!;

      const optimisticContract = {
        ...data,
        consultant: optimisticConsultant,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticContract]
            : [...currentState, optimisticContract];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticContract } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticContract, optimisticContracts };
};
