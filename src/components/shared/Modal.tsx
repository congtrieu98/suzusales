import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Modal({
  title,
  open,
  setOpen,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="rounded-md w-10/12 h-[450px] overflow-y-scroll">
        <DialogHeader className="px-5 pt-2">
          <DialogTitle>{title ?? "Modal"}</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
