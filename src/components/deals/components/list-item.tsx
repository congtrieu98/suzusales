"use client";

import { TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";
import { type CompleteSalesStage } from "@/lib/db/schema/salesStages";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";

function ListItem({
  stage,
  addOptimistic,
}: {
  stage: CompleteSalesStage;
  addOptimistic?: TAddOptimistic;
}) {
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-gray-50 shadow-md pb-2">
        <ListHeader
          stage={stage}
          onAddcard={enableEditing}
          //@ts-ignore
          addOptimistic={addOptimistic}
        />

        <CardForm
          listId={stage.id}
          ref={inputRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
}

export default ListItem;
