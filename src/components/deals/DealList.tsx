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
import { type SalesStage, CompleteSalesStage } from "@/lib/db/schema/salesStages";
import { useOptimisticSalesStages } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import SalesStageForm from "../salesStages/SalesStageForm";
// import { type SalesStage } from "@/lib/db/schema/salesStages";

type TOpenModal = (deal?: Deal) => void;

export default function DealList({
  deals,
  companies,
  users,
  salesStages
}: {
  deals: CompleteDeal[];
  companies: CompleteCompany[];
  users: CompleteUser[];
  salesStages: CompleteSalesStage[];

}) {
  const { optimisticDeals, addOptimisticDeal } = useOptimisticDeals(deals);
  const { optimisticSalesStages, addOptimisticSalesStage } = useOptimisticSalesStages(salesStages);
  const [open, setOpen] = useState(false);
  // const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  // const openModal = (deal?: Deal) => {
  //   setOpen(true);
  //   deal ? setActiveDeal(deal) : setActiveDeal(null);
  // };

  const [activeSalesStage, setActiveSalesStage] = useState<SalesStage | null>(null);
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
        <ul>
          {optimisticSalesStages.map((stage) => (
            <SalesStage stage={stage} key={stage.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const SalesStage = ({
  stage,
  openModal,
}: {
  stage: CompleteSalesStage;
  openModal: TOpenModal;
}) => {
  const optimistic = stage.id === "optimistic";
  const deleting = stage.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("deals") ? pathname : pathname + "/deals/";

  return (
    // <li
    //   className={cn(
    //     "flex justify-between my-2",
    //     mutating ? "opacity-30 animate-pulse" : "",
    //     deleting ? "text-destructive" : ""
    //   )}
    // >
    //   <div className="w-full">
    //     <div>{deal.name}</div>
    //   </div>
    //   <Button variant={"link"} asChild>
    //     <Link href={basePath + "/" + deal.id}>Edit</Link>
    //   </Button>
    // </li>
    <div className="grid grid-cols-5 max-w-screen-xl scroll-auto gap-5 bg-gray-100 p-10">

      <div>
        <div className="flex justify-between">
          <div className="text-xl uppercase">unssigned</div>
          <div>
            <CircleFadingPlusIcon />
          </div>
        </div>
        <div className="price block mt-5">
          {
            currencyNumber(0)
          }
        </div>
      </div>

      {/* ========== item 1 =========== */}

      <div>
        <div className="flex justify-between">
          <div className="text-xl uppercase">unssigned</div>
          <div>
            <CircleFadingPlusIcon />
          </div>
        </div>
        <div className="price block">
          Price
        </div>
      </div>

    </div>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No deals
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new deal.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Deals{" "}
        </Button>
      </div>
    </div>
  );
};

