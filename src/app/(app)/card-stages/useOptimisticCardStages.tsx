
import { type CardStage, type CompleteCardStage } from "@/lib/db/schema/cardStages";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<CardStage>) => void;

export const useOptimisticCardStages = (
  cardStages: CompleteCardStage[],
  
) => {
  const [optimisticCardStages, addOptimisticCardStage] = useOptimistic(
    cardStages,
    (
      currentState: CompleteCardStage[],
      action: OptimisticAction<CardStage>,
    ): CompleteCardStage[] => {
      const { data } = action;

      

      const optimisticCardStage = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCardStage]
            : [...currentState, optimisticCardStage];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCardStage } : item,
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

  return { addOptimisticCardStage, optimisticCardStages };
};
