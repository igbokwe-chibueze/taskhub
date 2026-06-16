import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TodoActionsMenu } from "@/features/todos/components/todo-actions-menu";
import { TodoCompletedToggle } from "@/features/todos/components/todo-completed-toggle";
import { TodoFavoriteToggle } from "@/features/todos/components/todo-favorite-toggle";
import type { Todo } from "@/features/todos/types/todo";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function TodosList({ todos }: { todos: Todo[] }) {
  return (
    <div className="grid gap-3">
      {todos.map((todo) => (
        <Card key={todo.id} className="bg-background">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <TodoCompletedToggle todoId={todo.id} completed={todo.completed} />
                  <span className={todo.completed ? "truncate text-muted-foreground line-through" : "truncate"}>
                    {todo.title}
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  Created {dateFormatter.format(todo.createdAt)}
                </CardDescription>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Badge variant="outline">
                  {todo.completed ? "Complete" : "Open"}
                </Badge>
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
      ))}
    </div>
  );
}
