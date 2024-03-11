import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/staffs/useOptimisticStaffs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { type Staff, insertStaffParams } from "@/lib/db/schema/staffs";
import {
  createStaffAction,
  deleteStaffAction,
  updateStaffAction,
} from "@/lib/actions/staffs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const StaffForm = ({
  staff,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  staff?: Staff | null;

  openModal?: (staff?: Staff) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Staff>(insertStaffParams);
  const editing = !!staff?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("staffs");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Staff }
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
      toast.success(`Staff ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const staffParsed = await insertStaffParams.safeParseAsync({ ...payload });
    if (!staffParsed.success) {
      setErrors(staffParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = staffParsed.data;
    const pendingStaff: Staff = {
      updatedAt: staff?.updatedAt ?? new Date(),
      createdAt: staff?.createdAt ?? new Date(),
      id: staff?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingStaff,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateStaffAction({ ...values, id: staff.id })
          : await createStaffAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingStaff,
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

  return (
    <form action={handleSubmit} onChange={handleChange} className={""}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.email ? "text-destructive" : ""
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={staff?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.role ? "text-destructive" : ""
          )}
        >
          Role
        </Label>
        <Select name="role" defaultValue={staff?.role ?? "GUESTS"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="GUESTS">Guests</SelectItem>
              <SelectItem value="SALES">Sales</SelectItem>
              <SelectItem value="PRODUCTS">Products</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.role ? (
          <p className="text-xs text-destructive mt-2">{errors.role[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: staff });
              const error = await deleteStaffAction(staff.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: staff,
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

export default StaffForm;

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
