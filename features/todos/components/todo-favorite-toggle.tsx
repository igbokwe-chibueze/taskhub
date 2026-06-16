"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateTodoFavoriteAction } from "@/features/todos/actions/todo.actions";

export function TodoFavoriteToggle({
  todoId,
  favorite,
}: {
  todoId: string;
  favorite: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const nextFavorite = !favorite;
      const result = await updateTodoFavoriteAction({
        todoId,
        favorite: nextFavorite,
      });

      if (!result.ok) {
        toast.error("Favorite status was not updated", {
          description: result.message,
        });
        return;
      }

      router.refresh();
      toast.success(nextFavorite ? "Added to favorites" : "Removed from favorites");
    });
  }

  return (
    <Button
      type="button"
      variant={favorite ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={favorite}
    >
      <Star aria-hidden="true" className={favorite ? "fill-current" : undefined} />
      {favorite ? "Favorited" : "Favorite"}
    </Button>
  );
}
