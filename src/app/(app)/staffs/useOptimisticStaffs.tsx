
import { type Staff, type CompleteStaff } from "@/lib/db/schema/staffs";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Staff>) => void;

export const useOptimisticStaffs = (
  staffs: CompleteStaff[],
  
) => {
  const [optimisticStaffs, addOptimisticStaff] = useOptimistic(
    staffs,
    (
      currentState: CompleteStaff[],
      action: OptimisticAction<Staff>,
    ): CompleteStaff[] => {
      const { data } = action;

      

      const optimisticStaff = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticStaff]
            : [...currentState, optimisticStaff];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticStaff } : item,
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

  return { addOptimisticStaff, optimisticStaffs };
};
