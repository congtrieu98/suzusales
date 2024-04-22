"use client";

import { Draggable } from "@hello-pangea/dnd";

import { CardStage } from "@/lib/db/schema/cardStages";

interface CardItemProps {
  data: CardStage;
  index: number;
}

function CardItem({ data, index }: CardItemProps) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className="truncate border-2 border-transparent hover:border-gray-200 py-2 px-3 bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
