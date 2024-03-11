"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/contracts/useOptimisticContracts";
import { CompleteContract, type Contract } from "@/lib/db/schema/contracts";
import { cn, formatDateSlash } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ContractForm from "@/components/contracts/ContractForm";
import {
  type Consultant,
  type ConsultantId,
} from "@/lib/db/schema/consultants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AudioWaveform,
  BadgeDollarSign,
  BookOpenCheck,
  CalendarCheck,
  FileScan,
  Loader,
  NotebookPen,
  ReceiptText,
  User,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default function OptimisticContract({
  contract,
  consultants,
  consultantId,
}: {
  contract: CompleteContract;
  consultants: Consultant[];
  consultantId?: ConsultantId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Contract) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticContract, setOptimisticContract] = useOptimistic(contract);
  const updateContract: TAddOptimistic = (input) =>
    setOptimisticContract({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ContractForm
          contract={optimisticContract}
          consultants={consultants}
          consultantId={consultantId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateContract}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{"Contract"}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticContract.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        <div className="">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle
                  className={
                    optimisticContract.customerContract ? "opacity-75" : ""
                  }
                >
                  {"Infomations Contract"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex mr-2">
                    <User />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Creator: <br />
                      <span className="font-semibold">
                        {optimisticContract.consultant.creator}
                      </span>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <CalendarCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Create At: <br />
                      <span className="font-semibold">
                        {moment(optimisticContract.createdAt).format(
                          formatDateSlash
                        )}
                      </span>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <ReceiptText />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Customer contract link: <br />
                      <Link
                        href={optimisticContract.customerContract}
                        legacyBehavior
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                        >
                          Link here
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <BadgeDollarSign />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Payment schedule: <br />
                      <span className="font-semibold">
                        {optimisticContract.paymentSchedule}
                      </span>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <FileScan />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Scan contract link: <br />
                      <Link
                        href={optimisticContract.scanContract}
                        legacyBehavior
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                        >
                          Link here
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <BookOpenCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Final contract link: <br />
                      <Link
                        href={optimisticContract.finalContract}
                        legacyBehavior
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                        >
                          Link here
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <AudioWaveform />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Customer address: <br />
                      <span className="font-semibold">
                        {optimisticContract.customerAddress}
                      </span>
                    </p>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <Loader />
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-medium">
                      <div className="mb-2">
                        Status:
                        <br />
                        <span className="font-semibold">
                          {optimisticContract.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* =======||====== */}
                  <span className="flex mr-2">
                    <NotebookPen />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Note: <br />
                      <span className="font-semibold">
                        {optimisticContract.note}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </pre>
    </div>
  );
}
