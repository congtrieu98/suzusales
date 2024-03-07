"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { formatDateSlash } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ConsultantTypeColumns = {
    id: string;
    customerName: string;
    projectName: string;
    content: string;
    airDate: Date;
    status: string;
    creator: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const columns: ColumnDef<ConsultantTypeColumns>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => {
            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            );
        },
    },
    {
        accessorKey: "customerName",
        header: "Customer Name"
    },
    {
        accessorKey: "projectName",
        header: "Project Name",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        accessorKey: "Action",
        cell: ({ row }) => {
            const consultant = row.original
            return <Consultant consultant={consultant} />
        }
    },
]

const Consultant = (
    {
        consultant,
        // openModal,
    }: {
        consultant: CompleteConsultant;
        // openModal: TOpenModal;
    }
) => {
    // const optimistic = consultant.id === "optimistic";
    // const deleting = consultant.id === "delete";
    // const mutating = optimistic || deleting;
    const pathname = usePathname();
    const basePath = pathname.includes("consultants")
        ? pathname
        : pathname + "/consultants/";

    return (
        //   <li
        //     className={cn(
        //       "flex justify-between my-2",
        //       mutating ? "opacity-30 animate-pulse" : "",
        //       deleting ? "text-destructive" : ""
        //     )}
        //   >
        //     <div className="w-full">
        //       <div>{consultant.customerName}</div>
        //     </div>
        <Button variant={"link"} asChild>
            <Link href={basePath + "/" + consultant.id}>Details</Link>
        </Button>
        //   </li>
    );
};
