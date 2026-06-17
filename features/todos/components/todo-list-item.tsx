"use client";

import { CalendarDays } from "lucide-react";
import { useOptimistic } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TodoActionsMenu } from "@/features/todos/components/todo-actions-menu";
import { TodoCompletedToggle } from "@/features/todos/components/todo-completed-toggle";
import { TodoFavoriteToggle } from "@/features/todos/components/todo-favorite-toggle";
import type { Todo } from "@/features/todos/types/todo";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function TodoListItem({ todo }: { todo: Todo }) {
  const [completed, setCompleted] = useOptimistic(
    todo.completed,
    (_currentCompleted: boolean, nextCompleted: boolean) => nextCompleted,
  );

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2">
              <TodoCompletedToggle
                todoId={todo.id}
                completed={completed}
                onCompletedChange={setCompleted}
              />
              <span
                className={cn(
                  "min-w-0 break-words leading-6 [overflow-wrap:anywhere]",
                  completed && "text-muted-foreground line-through",
                )}
              >
                {todo.title}
              </span>
            </CardTitle>
            <CardDescription className="mt-2 flex flex-wrap items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              Created {dateFormatter.format(todo.createdAt)}
            </CardDescription>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            <Badge variant="outline">{completed ? "Complete" : "Open"}</Badge>
            <TodoFavoriteToggle todoId={todo.id} favorite={todo.favorite} />
            <TodoActionsMenu todo={todo} />
          </div>
        </div>
      </CardHeader>

      {todo.description ? (
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {todo.description}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
