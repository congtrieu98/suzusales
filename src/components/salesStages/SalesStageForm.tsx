import { z } from "zod";

import {
  Dispatch,
  ElementRef,
  SetStateAction,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/sales-stages/useOptimisticSalesStages";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  type SalesStage,
  insertSalesStageParams,
} from "@/lib/db/schema/salesStages";
import {
  createSalesStageAction,
  deleteSalesStageAction,
  updateSalesStageAction,
} from "@/lib/actions/salesStages";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

const SalesStageForm = ({
  salesStage,
  openModal,
  closeModal,
  addOptimistic,
  isEditing,
  setIsEditing,
}: // postSuccess,
{
  salesStage?: SalesStage | null;

  openModal?: (salesStage?: SalesStage) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  isEditing?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  // postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<SalesStage>(insertSalesStageParams);
  const editing = !!salesStage?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("sales-stages");

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  // const enableEditing = () => {
  //   console.log("gsafdhjdfv");
  //   setIsEditing(true);
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   });
  // };

  const disableEditing = () => {
    //@ts-ignore
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSuccess = (
    action: Action,
    data?: { error: string; values: SalesStage }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      // postSuccess && postSuccess();
      toast.success(`SalesStage ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const salesStageParsed = await insertSalesStageParams.safeParseAsync({
      ...payload,
    });
    if (!salesStageParsed.success) {
      setErrors(salesStageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = salesStageParsed.data;
    const pendingSalesStage: SalesStage = {
      updatedAt: salesStage?.updatedAt ?? new Date(),
      createdAt: salesStage?.createdAt ?? new Date(),
      id: salesStage?.id ?? "",
      userId: salesStage?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingSalesStage,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateSalesStageAction({ ...values, id: salesStage.id })
          : await createSalesStageAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingSalesStage,
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
    <form ref={formRef} action={handleSubmit} onChange={handleChange}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : ""
          )}
        >
          Name
        </Label>
        <Input
          ref={inputRef}
          type="text"
          name="name"
          className={cn(errors?.name ? "border border-red-500" : "")}
          defaultValue={salesStage?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs mt-2">{errors.name[0]}</p>
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
                addOptimistic({ action: "delete", data: salesStage });
              const error = await deleteSalesStageAction(salesStage.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: salesStage,
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

export default SalesStageForm;

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
      className="text-sm bg-blue-500 hover:bg-blue-500"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
