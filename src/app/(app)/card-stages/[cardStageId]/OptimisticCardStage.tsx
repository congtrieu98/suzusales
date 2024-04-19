"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/card-stages/useOptimisticCardStages";
import { type CardStage } from "@/lib/db/schema/cardStages";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CardStageForm from "@/components/cardStages/CardStageForm";


export default function OptimisticCardStage({ 
  cardStage,
   
}: { 
  cardStage: CardStage; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CardStage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCardStage, setOptimisticCardStage] = useOptimistic(cardStage);
  const updateCardStage: TAddOptimistic = (input) =>
    setOptimisticCardStage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CardStageForm
          cardStage={optimisticCardStage}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCardStage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCardStage.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCardStage.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCardStage, null, 2)}
      </pre>
    </div>
  );
}
