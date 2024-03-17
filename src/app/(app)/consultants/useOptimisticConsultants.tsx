
import { type Consultant, type CompleteConsultant } from "@/lib/db/schema/consultants";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Consultant>) => void;

export const useOptimisticConsultants = (
  consultants: CompleteConsultant[],

) => {
  const [optimisticConsultants, addOptimisticConsultant] = useOptimistic(
    consultants,
    (
      currentState: CompleteConsultant[],
      action: OptimisticAction<Consultant>,
    ): CompleteConsultant[] => {
      const { data } = action;

      const optimisticConsultant = {
        ...data,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticConsultant]
            : [...currentState, optimisticConsultant];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticConsultant } : item,
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

  return { addOptimisticConsultant, optimisticConsultants };
};
