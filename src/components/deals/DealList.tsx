"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Deal, CompleteDeal } from "@/lib/db/schema/deals";
import Modal from "@/components/shared/Modal";

import { useOptimisticDeals } from "@/app/(app)/deals/useOptimisticDeals";
import { Button } from "@/components/ui/button";
import DealForm from "./DealForm";
import { PlusIcon } from "lucide-react";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteUser } from "@/lib/db/schema/users";

type TOpenModal = (deal?: Deal) => void;

export default function DealList({
  deals,
  companies,
  users,
}: {
  deals: CompleteDeal[];
  companies: CompleteCompany[];
  users: CompleteUser[];
}) {
  const { optimisticDeals, addOptimisticDeal } = useOptimisticDeals(deals);
  const [open, setOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const openModal = (deal?: Deal) => {
    setOpen(true);
    deal ? setActiveDeal(deal) : setActiveDeal(null);
  };
  const closeModal = () => setOpen(false);

  const data = {
    lanes: [
      {
        id: "lane1",
        title: "Planned Tasks",
        label: "2/2",
        cards: [
          {
            id: "Card1",
            title: "Write Blog",
            description: "Can AI make memes",
            label: "30 mins",
            draggable: false,
          },
          {
            id: "Card2",
            title: "Pay Rent",
            description: "Transfer via NEFT",
            label: "5 mins",
            metadata: { sha: "be312a1" },
          },
        ],
      },
      {
        id: "lane2",
        title: "Completed",
        label: "0/0",
        cards: [],
      },
    ],
  };
  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeDeal ? "Edit Deal" : "Create Deal"}
      >
        <DealForm
          deal={activeDeal}
          addOptimistic={addOptimisticDeal}
          openModal={openModal}
          closeModal={closeModal}
          companies={companies}
          users={users}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticDeals.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticDeals.map((deal) => (
            <Deal deal={deal} key={deal.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Deal = ({
  deal,
  openModal,
}: {
  deal: CompleteDeal;
  openModal: TOpenModal;
}) => {
  const optimistic = deal.id === "optimistic";
  const deleting = deal.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("deals") ? pathname : pathname + "/deals/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{deal.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + deal.id}>Edit</Link>
      </Button>
    </li>
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
