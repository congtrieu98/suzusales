"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import { TAddOptimistic } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import { type CompleteSalesStage } from "@/lib/db/schema/salesStages";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";

function ListItem({
  stage,
  addOptimistic,
  index,
}: {
  stage: CompleteSalesStage;
  addOptimistic?: TAddOptimistic;
  index: number;
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
    <Draggable draggableId={stage.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-gray-50 shadow-md pb-2"
          >
            <ListHeader
              stage={stage}
              onAddCard={enableEditing}
              //@ts-ignore
              addOptimistic={addOptimistic}
            />

            <Droppable droppableId={stage.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex-col gap-y-2 space-y-2",
                    stage.cardStage.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {stage.cardStage.map((card, index) => (
                    <CardItem key={card.id} data={card} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm
              listId={stage.id}
              ref={inputRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default ListItem;
