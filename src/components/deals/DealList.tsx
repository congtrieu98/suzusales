"use client";

import { useEffect, useState } from "react";

import { CompleteDeal } from "@/lib/db/schema/deals";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteUser } from "@/lib/db/schema/users";
import { CompleteSalesStage } from "@/lib/db/schema/salesStages";
import { useOptimisticSalesStages } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import { ListForm } from "./components/list-form";
import ListItem from "./components/list-item";
import { updateSalesStageOrderAction } from "@/lib/actions/salesStages";
import { toast } from "sonner";
import { updateCardStageOrderAction } from "@/lib/actions/cardStages";

export default function DealList({
  salesStages,
}: {
  deals: CompleteDeal[];
  companies: CompleteCompany[];
  users: CompleteUser[];
  salesStages: CompleteSalesStage[];
}) {
  const { optimisticSalesStages, addOptimisticSalesStage } =
    useOptimisticSalesStages(salesStages);

  const [dataSalesStageDrag, setDataSalesStageDrag] = useState(salesStages);

  useEffect(() => {
    setDataSalesStageDrag(salesStages);
  }, [salesStages]);

  // TODO: TH nếu chưa drag thì ok, còn nếu đã có drag thì lúc tạo vẫn bị lỗi do chưa set lại status

  // const [isDrag, setIsDrag] = useState(false);

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User move a list
    if (type === "list") {
      const items = reorder(
        dataSalesStageDrag,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));
      setDataSalesStageDrag(items);
      // Trigger Server Action
      await updateSalesStageOrderAction(items);
      toast.success("Deal reordered");
    }

    // User move a card
    if (type === "card") {
      let newDataSalesStageDrag = [...dataSalesStageDrag];

      // Source and destination list
      const sourceList = newDataSalesStageDrag.find(
        (list) => list.id === source.droppableId
      );
      const destList = newDataSalesStageDrag.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if card exists on the sourceList
      if (!sourceList.cardStage) {
        sourceList.cardStage = [];
      }

      // Check if card exists on the desList
      if (!destList.cardStage) {
        destList.cardStage = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderdCards = reorder(
          sourceList.cardStage,
          source.index,
          destination.index
        );

        reorderdCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cardStage = reorderdCards;

        setDataSalesStageDrag(newDataSalesStageDrag);
        // Trigger Server Action
        await updateCardStageOrderAction(newDataSalesStageDrag);
        toast.success("Card reordered");

        // User move the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cardStage.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.id = destination.droppableId;

        // Add card to the destination list
        destList.cardStage.splice(destination.index, 0, movedCard);

        sourceList.cardStage.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list

        destList.cardStage.forEach((card, idx) => {
          card.order = idx;
        });

        setDataSalesStageDrag(newDataSalesStageDrag);
        // setIsDrag(false);
        // Trigger Server Action
        await updateCardStageOrderAction(newDataSalesStageDrag);
        toast.success("Card reordered");
      }
    }
  };

  return (
    <div>
      {salesStages.length === 0 ? (
        <ol>
          <ListForm />
        </ol>
      ) : (
        <div className="max-h-screen">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list" type="list" direction="horizontal">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-3 h-full flex-wrap"
                >
                  {dataSalesStageDrag.map((stage, index) => (
                    <ListItem
                      stage={stage}
                      key={stage.id}
                      index={index}
                      addOptimistic={addOptimisticSalesStage}
                    />
                  ))}
                  {provided.placeholder}
                  <ListForm />
                </ol>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
