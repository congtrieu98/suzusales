"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/consultants/useOptimisticConsultants";
import { type Consultant } from "@/lib/db/schema/consultants";
import { cn, formatDateSlash } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck,
  Loader,
  Timer,
  User,
  UserRoundCheck,
} from "lucide-react";
import moment from "moment";
import { Staff } from "@/lib/db/schema/staffs";

export default function OptimisticConsultant({
  consultant,
  staffs,
}: {
  consultant: Consultant;
  staffs: Staff[];
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Consultant) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticConsultant, setOptimisticConsultant] =
    useOptimistic(consultant);
  const updateConsultant: TAddOptimistic = (input) =>
    setOptimisticConsultant({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ConsultantForm
          consultant={optimisticConsultant}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateConsultant}
          staffs={staffs}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {optimisticConsultant.customerName}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticConsultant.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        <div className="">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle
                  className={
                    optimisticConsultant.projectName ? "opacity-75" : ""
                  }
                >
                  {optimisticConsultant.projectName}
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
                        {optimisticConsultant.creator}
                      </span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <CalendarCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Create At: <br />
                      <span className="font-semibold">
                        {moment(optimisticConsultant.createdAt).format(
                          formatDateSlash
                        )}
                      </span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <Loader />
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-medium">
                      <div className="mb-2">
                        Status:
                        <br />
                        <span className="font-semibold">
                          {optimisticConsultant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="flex mr-2">
                    <UserRoundCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-medium">
                      <div className="mb-2">
                        Asigned:
                        <br />
                        <span className="font-semibold">
                          {staffs
                            .map((st) => {
                              const check =
                                optimisticConsultant?.assignedId.includes(
                                  st.id
                                );
                              if (check) {
                                return st.email;
                              } else {
                                return "";
                              }
                            })
                            .map((item) => {
                              const part = item!.split("@");
                              return part[0];
                            })
                            .join(",")
                            .startsWith(",")
                            ? staffs
                                .map((st) => {
                                  const check =
                                    optimisticConsultant.assignedId.includes(
                                      st.id
                                    );
                                  if (check) {
                                    return st.email;
                                  } else {
                                    return "";
                                  }
                                })
                                .map((item) => {
                                  const part = item!.split("@");
                                  return part[0];
                                })
                                .join(",")
                                .slice(1)
                            : staffs
                                .map((st) => {
                                  const check =
                                    optimisticConsultant.assignedId.includes(
                                      st.id
                                    );
                                  if (check) {
                                    return st.email;
                                  } else {
                                    return "";
                                  }
                                })
                                .map((item) => {
                                  const part = item!.split("@");
                                  return part[0];
                                })
                                .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="flex mr-2">
                    <Timer />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium ">Create Air</p>
                    <span className="font-semibold">
                      {moment(optimisticConsultant.airDate).format(
                        formatDateSlash
                      )}
                    </span>
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
