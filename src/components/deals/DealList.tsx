"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { type Deal, CompleteDeal } from "@/lib/db/schema/deals";
import Modal from "@/components/shared/Modal";

import { useOptimisticDeals } from "@/app/(app)/deals/useOptimisticDeals";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
import { type TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";
import ListItem from "./components/list-item";

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

      {optimisticSalesStages.length === 0 ? (
        <ol>
          <ListForm />
        </ol>
      ) : (
        <div className="max-h-screen">
          <ol className="flex gap-3 h-full flex-wrap">
            {optimisticSalesStages.map((stage) => (
              <ListItem
                stage={stage}
                key={stage.id}
                addOptimistic={addOptimisticSalesStage}
              />
            ))}
            <ListForm />
          </ol>
        </div>
      )}
    </div>
  );
}
