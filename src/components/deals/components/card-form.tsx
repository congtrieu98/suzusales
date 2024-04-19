"use client";

import CardStageForm from "@/components/cardStages/CardStageForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { forwardRef } from "react";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}
export const CardForm = forwardRef<HTMLInputElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    if (isEditing) {
      return (
        <CardStageForm
          listId={listId}
          //@ts-ignore
          ref={ref}
          disableEditing={disableEditing}
        />
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="mr-2" size={16} />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
