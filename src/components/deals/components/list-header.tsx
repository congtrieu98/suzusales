"use client";

import { type TAddOptimistic } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import SalesStageForm from "@/components/salesStages/SalesStageForm";
import { CompleteSalesStage } from "@/lib/db/schema/salesStages";
import { useState } from "react";
import ListOption from "./list-option";

interface ListHeaderProps {
  stage: CompleteSalesStage;
  addOptimistic?: TAddOptimistic;
  onAddCard: () => void;
}

export const ListHeader = ({
  stage,
  addOptimistic,
  onAddCard,
}: ListHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <SalesStageForm
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          salesStage={stage}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {stage?.name}
        </div>
      )}
      <ListOption
        onAddCard={onAddCard}
        data={stage}
        addOptimistic={addOptimistic!}
      />
    </div>
  );
};
