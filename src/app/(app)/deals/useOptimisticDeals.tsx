
import { type Deal, type CompleteDeal } from "@/lib/db/schema/deals";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Deal>) => void;

export const useOptimisticDeals = (
  deals: CompleteDeal[],
  
) => {
  const [optimisticDeals, addOptimisticDeal] = useOptimistic(
    deals,
    (
      currentState: CompleteDeal[],
      action: OptimisticAction<Deal>,
    ): CompleteDeal[] => {
      const { data } = action;

      

      const optimisticDeal = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticDeal]
            : [...currentState, optimisticDeal];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticDeal } : item,
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

  return { addOptimisticDeal, optimisticDeals };
};
