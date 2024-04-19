"use client";

import { CompleteSalesStage, SalesStage } from "@/lib/db/schema/salesStages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ElementRef, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@/components/ui/separator";
import { type TAddOptimistic } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import {
  copySalesStageAction,
  deleteSalesStageAction,
} from "@/lib/actions/salesStages";
import { Action } from "@/lib/utils";

function ListOption({
  onAddCard,
  data,
  addOptimistic,
}: {
  onAddCard: () => void;
  data: CompleteSalesStage;
  addOptimistic: TAddOptimistic;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [pending, startMutation] = useTransition();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: SalesStage }
  ) => {
    const failed = Boolean(data?.error);

    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      closeRef.current?.click();
      toast.success(`SalesStage ${action}d!`);
    }
  };

  const closeRef = useRef<ElementRef<"button">>(null);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Action
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="w-auto h-auto absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X size={16} />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form>
          <input hidden name="id" id="id" value={data?.id} />
          <Button
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
            disabled={isDeleting || pending}
            onClick={() => {
              setIsCopy(true);
              startMutation(async () => {
                addOptimistic &&
                  addOptimistic({ action: "copies", data: data });
                const error = await copySalesStageAction(data.id);
                setIsCopy(false);
                const errorFormatted = {
                  error: error ?? "Error",
                  values: data,
                };

                onSuccess("copies", error ? errorFormatted : undefined);
              });
            }}
          >
            {isCopy || pending ? "Copy listing..." : "Copy list"}
          </Button>
        </form>
        <Separator />
        <form>
          <input hidden name="id" id="id" value={data?.id} />
          <Button
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
            disabled={isDeleting || pending}
            onClick={() => {
              setIsDeleting(true);
              startMutation(async () => {
                addOptimistic &&
                  addOptimistic({ action: "delete", data: data });
                const error = await deleteSalesStageAction(data.id);
                setIsDeleting(false);
                const errorFormatted = {
                  error: error ?? "Error",
                  values: data,
                };

                onSuccess("delete", error ? errorFormatted : undefined);
              });
            }}
          >
            {isDeleting || pending ? "Deleted listing..." : "Delete list"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default ListOption;
