
import { type Contact, type CompleteContact } from "@/lib/db/schema/contacts";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<CompleteContact>) => void;

export const useOptimisticContacts = (
  contacts: CompleteContact[],

) => {
  const [optimisticContacts, addOptimisticContact] = useOptimistic(
    contacts,
    (
      currentState: CompleteContact[],
      action: OptimisticAction<Contact>,
    ): CompleteContact[] => {
      const { data } = action;



      const optimisticContact = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          //@ts-ignore
          return currentState.length === 0
            ? [optimisticContact]
            : [...currentState, optimisticContact];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticContact } : item,
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

  return { addOptimisticContact, optimisticContacts };
};
