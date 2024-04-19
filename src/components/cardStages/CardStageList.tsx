"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type CardStage, CompleteCardStage } from "@/lib/db/schema/cardStages";
import Modal from "@/components/shared/Modal";

import { useOptimisticCardStages } from "@/app/(app)/card-stages/useOptimisticCardStages";
import { Button } from "@/components/ui/button";
import CardStageForm from "./CardStageForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (cardStage?: CardStage) => void;

export default function CardStageList({
  cardStages,
   
}: {
  cardStages: CompleteCardStage[];
   
}) {
  const { optimisticCardStages, addOptimisticCardStage } = useOptimisticCardStages(
    cardStages,
     
  );
  const [open, setOpen] = useState(false);
  const [activeCardStage, setActiveCardStage] = useState<CardStage | null>(null);
  const openModal = (cardStage?: CardStage) => {
    setOpen(true);
    cardStage ? setActiveCardStage(cardStage) : setActiveCardStage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCardStage ? "Edit CardStage" : "Create Card Stage"}
      >
        <CardStageForm
          cardStage={activeCardStage}
          addOptimistic={addOptimisticCardStage}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCardStages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCardStages.map((cardStage) => (
            <CardStage
              cardStage={cardStage}
              key={cardStage.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const CardStage = ({
  cardStage,
  openModal,
}: {
  cardStage: CompleteCardStage;
  openModal: TOpenModal;
}) => {
  const optimistic = cardStage.id === "optimistic";
  const deleting = cardStage.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("card-stages")
    ? pathname
    : pathname + "/card-stages/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{cardStage.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + cardStage.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No card stages
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new card stage.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Card Stages </Button>
      </div>
    </div>
  );
};
