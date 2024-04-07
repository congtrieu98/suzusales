"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, formatDateSlash } from "@/lib/utils";
import {
  CompleteConsultant,
  type Consultant,
} from "@/lib/db/schema/consultants";
import Modal from "@/components/shared/Modal";

import { useOptimisticConsultants } from "@/app/(app)/consultants/useOptimisticConsultants";
import { Button } from "@/components/ui/button";
import ConsultantForm from "./ConsultantForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import moment from "moment";
import { CompleteStaff } from "@/lib/db/schema/staffs";
import { useSession } from "next-auth/react";

type TOpenModal = (consultant?: Consultant) => void;
// type CompleteConsultant = {
//   id: string;
//   customerName: string;
//   projectName: string;
//   content: string;
//   airDate: Date;
//   status: string;
//   creator: string;
//   userId: string;
//   assignedId: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   consultant: {
//     id: string;
//     customerName: string;
//     projectName: string;
//     content: string;
//     airDate: Date;
//     status: string;
//     creator: string;
//     userId: string;
//     assignedId: string[];
//     createdAt: Date;
//     updatedAt: Date;
//     // Các trường khác nếu có
//   };
//   staff: {
//     createdAt: Date;
//     email: string;
//     id: string;
//     role: string;
//   };
// }[];

export default function ConsultantList({
  consultants,
  staffs,
}: {
  consultants: CompleteConsultant[];
  staffs: CompleteStaff[];
}) {
  const { data: session } = useSession();
  const { optimisticConsultants, addOptimisticConsultant } =
    useOptimisticConsultants(consultants);
  const [open, setOpen] = useState(false);
  const [activeConsultant, setActiveConsultant] = useState<Consultant | null>(
    null
  );
  const openModal = (consultant?: Consultant) => {
    setOpen(true);
    consultant ? setActiveConsultant(consultant) : setActiveConsultant(null);
  };
  const closeModal = () => setOpen(false);

  const optimisticConsultantsCustom = optimisticConsultants.map((item) => {
    console.log("item:", item);
    if (session?.user.role !== "ADMIN") {
      console.log("vaof ddaay")
      return {
        id: item.id,

        customerName: item.customerName,

        projectName: item.projectName,

        content: item.content,

        airDate: item.airDate,

        status: item.status,

        creator: item.creator,

        userId: item.userId,

        // assignedId: item?.staff.email.split("@")[0],

        createdAt: moment(item.createdAt).format(formatDateSlash),

        updatedAt: item.updatedAt,
      };
    } else {
      return {
        id: item.id,

        customerName: item?.customerName,

        projectName: item?.projectName,

        content: item?.content,

        airDate: item?.airDate,

        status: item?.status,

        creator: item?.creator,

        userId: item?.userId,
        assignedId: staffs
          .map((st) => {
            const check = item?.assignedId.includes(st.id);
            if (check) {
              return st.email;
            } else {
              return "";
            }
          })
          .map((email) => {
            const part = email!.split("@");
            return part[0];
          })
          .join(",")
          .startsWith(",")
          ? staffs
            .map((st) => {
              const check = item.assignedId.includes(st.id);
              if (check) {
                return st.email;
              } else {
                return "";
              }
            })
            .map((email) => {
              const part = email!.split("@");
              return part[0];
            })
            .join(",")
            .slice(1)
          : staffs
            .map((st) => {
              const check = item.assignedId.includes(st.id);
              if (check) {
                return st.email;
              } else {
                return "";
              }
            })
            .map((email) => {
              const part = email!.split("@");
              return part[0];
            })
            .join(", "),

        createdAt: moment(item.createdAt).format(formatDateSlash),

        updatedAt: item.updatedAt,
      };
    }
  });

  console.log("consultants", consultants);
  console.log("role", session?.user?.role);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeConsultant ? "Edit Consultant" : "Create Consultant"}
      >
        <ConsultantForm
          consultant={activeConsultant}
          addOptimistic={addOptimisticConsultant}
          openModal={openModal}
          closeModal={closeModal}
          staffs={staffs}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticConsultants.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={optimisticConsultantsCustom} />
        </div>
      )}
    </div>
  );
}

const Consultant = ({
  consultant,
  openModal,
}: {
  consultant: CompleteConsultant;
  openModal: TOpenModal;
}) => {
  const optimistic = consultant.id === "optimistic";

  const deleting = consultant.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("consultants")
    ? pathname
    : pathname + "/consultants/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{consultant.customerName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + consultant.id}>Details</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No consultants
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new consultant.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Consultants{" "}
        </Button>
      </div>
    </div>
  );
};
