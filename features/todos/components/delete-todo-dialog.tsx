"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteTodoAction } from "@/features/todos/actions/todo.actions";
import type { Todo } from "@/features/todos/types/todo";

export function DeleteTodoDialog({
  todo,
  open,
  onOpenChange,
}: {
  todo: Todo;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTodoAction({
        todoId: todo.id,
      });

      if (!result.ok) {
        toast.error("Todo was not deleted", {
          description: result.message,
        });
        return;
      }

      setDialogOpen(false);
      router.refresh();
      toast.success("Todo deleted");
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {open === undefined ? (
        <DialogTrigger asChild>
          <Button type="button" variant="destructive" size="sm">
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete todo?</DialogTitle>
          <DialogDescription>
            This will permanently delete this todo from your private dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter aria-busy={isPending}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-live="polite"
          >
            {isPending ? "Deleting..." : "Delete todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
