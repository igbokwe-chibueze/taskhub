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

export function DeleteTodoDialog({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

      setOpen(false);
      router.refresh();
      toast.success("Todo deleted");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete todo?</DialogTitle>
          <DialogDescription>
            This will permanently delete this todo from your private dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
