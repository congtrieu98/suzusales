"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, formatDateSlash } from "@/lib/utils";
import { type Company, CompleteCompany } from "@/lib/db/schema/companies";
import Modal from "@/components/shared/Modal";

import { useOptimisticCompanies } from "@/app/(app)/companies/useOptimisticCompanies";
import { Button } from "@/components/ui/button";
import CompanyForm from "./CompanyForm";
import { PlusIcon } from "lucide-react";
import { CompleteUser } from "@/lib/db/schema/users";
import moment from "moment";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

type TOpenModal = (company?: CompleteCompany) => void;

export default function CompanyList({
  companies,
  users,
}: {
  companies: CompleteCompany[];
  users: CompleteUser[];
}) {
  const { optimisticCompanies, addOptimisticCompany } =
    useOptimisticCompanies(companies);
  const [open, setOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState<CompleteCompany | null>(null);
  const openModal = (company?: CompleteCompany) => {
    setOpen(true);
    company ? setActiveCompany(company) : setActiveCompany(null);
  };
  const closeModal = () => setOpen(false);

  const optimisticCompanyCustom = optimisticCompanies.map((item) => {
    return {
      id: item.id,

      name: item?.name,

      salesOwner: item?.salesOwner,

      creator: item?.user?.name,

      createdAt: moment(item.createdAt).format(formatDateSlash),

      updatedAt: item.updatedAt,
    };
  });
  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCompany ? "Edit Company" : "Create Company"}
      >
        <CompanyForm
          company={activeCompany}
          addOptimistic={addOptimisticCompany}
          openModal={openModal}
          closeModal={closeModal}
          users={users}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCompanies.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            //@ts-ignore
            data={optimisticCompanyCustom}
          />
        </div>
      )}
    </div>
  );
}

const Company = ({
  company,
  openModal,
}: {
  company: CompleteCompany;
  openModal: TOpenModal;
}) => {
  const optimistic = company.id === "optimistic";
  const deleting = company.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("companies")
    ? pathname
    : pathname + "/companies/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{company.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + company.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No companies
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new company.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Companies{" "}
        </Button>
      </div>
    </div>
  );
};
