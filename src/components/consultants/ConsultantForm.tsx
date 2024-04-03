"use client";

import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn, formatDatetime } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/consultants/useOptimisticConsultants";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import moment from "moment";

import {
  type Consultant,
  insertConsultantParams,
} from "@/lib/db/schema/consultants";
import { type CompleteStaff } from "@/lib/db/schema/staffs";
import {
  createConsultantAction,
  deleteConsultantAction,
  updateConsultantAction,
} from "@/lib/actions/consultants";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import Selector from "react-select";

const ConsultantForm = ({
  consultant,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  staffs,
}: {
  consultant?: Consultant | null;
  staffs: CompleteStaff[];
  openModal?: (consultant?: Consultant) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Consultant>(insertConsultantParams);
  const editing = !!consultant?.id;
  const [airDate, setAirDate] = useState<string>(
    moment().format(formatDatetime).toString()
  );
  const { data: session } = useSession();

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("consultants");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Consultant }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Consultant ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };
  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const consultantParsed = await insertConsultantParams.safeParseAsync({
      ...payload,
    });
    console.log("consultantParsed:", consultantParsed);
    if (!consultantParsed.success) {
      setErrors(consultantParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = consultantParsed.data;
    console.log("values:", values);
    const pendingConsultant: Consultant = {
      updatedAt: consultant?.updatedAt ?? new Date(),
      createdAt: consultant?.createdAt ?? new Date(),
      id: consultant?.id ?? "",
      userId: consultant?.userId ?? "",
      creator: session?.user.name as string,
      airDate: moment(airDate).toDate(),
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingConsultant,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateConsultantAction({
              ...values,
              id: consultant.id,
              airDate: consultant?.airDate
                ? consultant?.airDate
                : moment(airDate).toDate(),
              creator: session?.user.name as string,
            })
          : await createConsultantAction({
              ...values,
              airDate: moment(airDate).toDate(),
              creator: session?.user.name as string,
            });

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingConsultant,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const options = staffs.map((s) => ({
    value: s.id,
    label: s.email,
  }));

  console.log("selectedOption:", selectedOption);

  return (
    <form action={handleSubmit} onChange={handleChange} className={""}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.customerName ? "text-destructive" : ""
          )}
        >
          Customer Name
        </Label>
        <Input
          type="text"
          name="customerName"
          className={cn(errors?.customerName ? "ring ring-destructive" : "")}
          defaultValue={consultant?.customerName ?? ""}
        />
        {errors?.customerName ? (
          <p className="text-xs text-destructive mt-2">
            {errors.customerName[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.projectName ? "text-destructive" : ""
          )}
        >
          Project Name
        </Label>
        <Input
          type="text"
          name="projectName"
          className={cn(errors?.projectName ? "ring ring-destructive" : "")}
          defaultValue={consultant?.projectName ?? ""}
        />
        {errors?.projectName ? (
          <p className="text-xs text-destructive mt-2">
            {errors.projectName[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.content ? "text-destructive" : ""
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? "ring ring-destructive" : "")}
          defaultValue={consultant?.content ?? ""}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.status ? "text-destructive" : ""
          )}
        >
          Assigned
        </Label>
        <Selector
          name="assignedId"
          // defaultValue={selectedOption}
          //@ts-ignore
          value={selectedOption?.map((item) => item?.value)}
          //@ts-ignore
          onChange={setSelectedOption}
          options={options}
          isMulti
          isSearchable
        />
        {errors?.assignedId ? (
          <p className="text-xs text-destructive mt-2">
            {errors.assignedId[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.airDate ? "text-destructive" : ""
          )}
        >
          Air Date
        </Label>
        <br />
        <input
          type="datetime-local"
          name="airDate"
          value={
            consultant?.airDate
              ? moment(consultant?.airDate).format(formatDatetime).toString()
              : airDate
          }
          // disabled={editing && name === "createAt"}
          onChange={(e) => setAirDate(e.target.value)}
          className="p-2 w-full inline-flex items-center justify-center whitespace-nowrap
          rounded-md text-sm font-medium ring-offset-background transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
          border border-input bg-background hover:bg-accent hover:text-accent-foreground
          "
        />
        {errors?.airDate ? (
          <p className="text-xs text-destructive mt-2">{errors.airDate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.status ? "text-destructive" : ""
          )}
        >
          Status
        </Label>
        <Select name="status" defaultValue={consultant?.status ?? "Reviewing"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Cancel">Cancel</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: "delete", data: consultant });
              const error = await deleteConsultantAction(consultant.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: consultant,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default ConsultantForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
