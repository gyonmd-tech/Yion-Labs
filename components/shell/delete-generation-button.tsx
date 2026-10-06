"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { appCopy } from "@/content/app";
import { deleteGenerationAction } from "@/app/app/library/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteGenerationButton({ id, title }: { id: string; title: string }) {
  const copy = appCopy.library;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await deleteGenerationAction(id);
      if (result.ok) {
        toast.success(copy.deleted);
        setOpen(false);
      } else {
        toast.error(copy.deleteFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`${copy.delete}: ${title}`}>
          <Trash2 aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.deleteTitle}</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{title}</span>. {copy.deleteBody}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{copy.cancel}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={confirm} disabled={pending} aria-busy={pending}>
            {copy.deleteConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
