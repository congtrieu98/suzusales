import { z } from "zod";

import { ForwardedRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/card-stages/useOptimisticCardStages";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  type CardStage,
  insertCardStageParams,
} from "@/lib/db/schema/cardStages";
import {
  createCardStageAction,
  deleteCardStageAction,
  updateCardStageAction,
} from "@/lib/actions/cardStages";
import { DoorClosed, Plus, X } from "lucide-react";

const CardStageForm = ({
  listId,
  cardStage,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  disableEditing,
  ref,
}: {
  cardStage?: CardStage | null;
  listId: string;
  openModal?: (cardStage?: CardStage) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
  ref: ForwardedRef<HTMLTextAreaElement>;
  disableEditing: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<CardStage>(insertCardStageParams);
  const editing = !!cardStage?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("card-stages");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CardStage }
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
      toast.success(`CardStage ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const cardStageParsed = await insertCardStageParams.safeParseAsync({
      ...payload,
    });
    if (!cardStageParsed.success) {
      setErrors(cardStageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = cardStageParsed.data;
    const pendingCardStage: CardStage = {
      updatedAt: cardStage?.updatedAt ?? new Date(),
      createdAt: cardStage?.createdAt ?? new Date(),
      id: cardStage?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCardStage,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateCardStageAction({ ...values, id: cardStage.id })
          : await createCardStageAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCardStage,
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
    <form action={handleSubmit} onChange={handleChange}>
      {/* Schema fields start */}
      <div>
        <Input
          // @ts-ignore
          ref={ref}
          type="text"
          name="title"
          placeholder="Enter title card..."
          className={cn(errors?.title ? "border border-red-500" : "")}
          defaultValue={cardStage?.title ?? ""}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : null}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton
        errors={hasErrors}
        editing={editing}
        disableEditing={disableEditing}
      />

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
                addOptimistic({ action: "delete", data: cardStage });
              const error = await deleteCardStageAction(cardStage.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: cardStage,
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

export default CardStageForm;

const SaveButton = ({
  editing,
  errors,
  disableEditing,
}: {
  editing: Boolean;
  errors: boolean;
  disableEditing: () => void;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <div className="flex space-x-3">
      <Button
        type="submit"
        className="mr-2 mt-2 bg-blue-400 hover:bg-blue-400"
        disabled={isCreating || isUpdating || errors}
        aria-disabled={isCreating || isUpdating || errors}
      >
        {editing
          ? `Sav${isUpdating ? "ing..." : "e"}`
          : `Add${isCreating ? "ing... card" : " card"}`}
      </Button>
      <Button variant="ghost" className="mt-2">
        <X size={16} onClick={disableEditing} />
      </Button>
    </div>
  );
};
