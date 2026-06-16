"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateTodoCompletedAction } from "@/features/todos/actions/todo.actions";

export function TodoCompletedToggle({
  todoId,
  completed,
  onCompletedChange,
}: {
  todoId: string;
  completed: boolean;
  onCompletedChange?: (completed: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const Icon = completed ? CheckCircle2 : Circle;

  function handleToggle() {
    const nextCompleted = !completed;

    startTransition(async () => {
      // Optimistically update the surrounding row before the Server Action
      // resolves so the checkbox, title style, and status badge all feel instant.
      onCompletedChange?.(nextCompleted);

      const result = await updateTodoCompletedAction({
        todoId,
        completed: nextCompleted,
      });

      if (!result.ok) {
        onCompletedChange?.(completed);
        toast.error("Todo status was not updated", {
          description: result.message,
        });
        return;
      }

      router.refresh();
      toast.success(nextCompleted ? "Todo marked complete" : "Todo reopened");
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={completed ? "Mark todo open" : "Mark todo complete"}
      aria-pressed={completed}
      className="shrink-0"
    >
      <Icon
        aria-hidden="true"
        className={completed ? "text-primary" : "text-muted-foreground"}
      />
    </Button>
  );
}
