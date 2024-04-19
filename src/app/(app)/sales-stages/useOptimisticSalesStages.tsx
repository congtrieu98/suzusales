import {
  type SalesStage,
  type CompleteSalesStage,
} from "@/lib/db/schema/salesStages";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<SalesStage>) => void;

export const useOptimisticSalesStages = (salesStages: CompleteSalesStage[]) => {
  const [optimisticSalesStages, addOptimisticSalesStage] = useOptimistic(
    salesStages,
    (
      currentState: CompleteSalesStage[],
      action: OptimisticAction<SalesStage>
    ): CompleteSalesStage[] => {
      const { data } = action;

      const optimisticSalesStage = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticSalesStage]
            : [...currentState, optimisticSalesStage];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticSalesStage } : item
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item
          );
        case "copies":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "copies" } : item
          );
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticSalesStage, optimisticSalesStages };
};
