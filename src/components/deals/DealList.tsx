"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, currencyNumber } from "@/lib/utils";
import { type Deal, CompleteDeal } from "@/lib/db/schema/deals";
import Modal from "@/components/shared/Modal";

import { useOptimisticDeals } from "@/app/(app)/deals/useOptimisticDeals";
import { Button } from "@/components/ui/button";
import DealForm from "./DealForm";
import { CircleFadingPlusIcon, Plus, PlusIcon } from "lucide-react";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteUser } from "@/lib/db/schema/users";
import {
  type SalesStage,
  CompleteSalesStage,
} from "@/lib/db/schema/salesStages";
import { useOptimisticSalesStages } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import SalesStageForm from "../salesStages/SalesStageForm";
import { ListHeader } from "./components/list-header";
import { ListForm } from "./components/list-form";
// import { type SalesStage } from "@/lib/db/schema/salesStages";

type TOpenModal = (deal?: Deal) => void;

export default function DealList({
  deals,
  companies,
  users,
  salesStages,
}: {
  deals: CompleteDeal[];
  companies: CompleteCompany[];
  users: CompleteUser[];
  salesStages: CompleteSalesStage[];
}) {
  const { optimisticDeals, addOptimisticDeal } = useOptimisticDeals(deals);
  const { optimisticSalesStages, addOptimisticSalesStage } =
    useOptimisticSalesStages(salesStages);
  const [open, setOpen] = useState(false);
  // const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  // const openModal = (deal?: Deal) => {
  //   setOpen(true);
  //   deal ? setActiveDeal(deal) : setActiveDeal(null);
  // };

  const [activeSalesStage, setActiveSalesStage] = useState<SalesStage | null>(
    null
  );
  const openModal = (salesStage?: SalesStage) => {
    setOpen(true);
    salesStage ? setActiveSalesStage(salesStage) : setActiveSalesStage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      {/* <Modal
        open={open}
        setOpen={setOpen}
        title={activeDeal ? "Edit Stages" : "Create Stages"}
      >
        <DealForm
          deal={activeDeal}
          addOptimistic={addOptimisticDeal}
          openModal={openModal}
          closeModal={closeModal}
          companies={companies}
          users={users}
        />
      </Modal> */}
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
        <div className="max-h-screen">
          <ol className="flex gap-x-3 h-full">
            {optimisticSalesStages.map((stage) => (
              <SalesStage stage={stage} key={stage.id} />
            ))}
            <ListForm />
          </ol>
        </div>
      )}
    </div>
  );
}

const SalesStage = ({ stage }: { stage: CompleteSalesStage }) => {
  const optimistic = stage.id === "optimistic";
  const deleting = stage.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("deals") ? pathname : pathname + "/deals/";

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader />
      </div>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No stages
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new stages.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Stages{" "}
        </Button>
      </div>
    </div>
  );
};
