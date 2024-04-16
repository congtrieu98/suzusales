"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type SalesStage, CompleteSalesStage } from "@/lib/db/schema/salesStages";
import Modal from "@/components/shared/Modal";

import { useOptimisticSalesStages } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import { Button } from "@/components/ui/button";
import SalesStageForm from "./SalesStageForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (salesStage?: SalesStage) => void;

export default function SalesStageList({
  salesStages,
   
}: {
  salesStages: CompleteSalesStage[];
   
}) {
  const { optimisticSalesStages, addOptimisticSalesStage } = useOptimisticSalesStages(
    salesStages,
     
  );
  const [open, setOpen] = useState(false);
  const [activeSalesStage, setActiveSalesStage] = useState<SalesStage | null>(null);
  const openModal = (salesStage?: SalesStage) => {
    setOpen(true);
    salesStage ? setActiveSalesStage(salesStage) : setActiveSalesStage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeSalesStage ? "Edit SalesStage" : "Create Sales Stage"}
      >
        <SalesStageForm
          salesStage={activeSalesStage}
          addOptimistic={addOptimisticSalesStage}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticSalesStages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSalesStages.map((salesStage) => (
            <SalesStage
              salesStage={salesStage}
              key={salesStage.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const SalesStage = ({
  salesStage,
  openModal,
}: {
  salesStage: CompleteSalesStage;
  openModal: TOpenModal;
}) => {
  const optimistic = salesStage.id === "optimistic";
  const deleting = salesStage.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("sales-stages")
    ? pathname
    : pathname + "/sales-stages/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{salesStage.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + salesStage.id }>
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
        No sales stages
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new sales stage.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Sales Stages </Button>
      </div>
    </div>
  );
};
