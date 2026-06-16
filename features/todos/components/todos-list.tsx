import { CalendarDays, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteTodoDialog } from "@/features/todos/components/delete-todo-dialog";
import { EditTodoDialog } from "@/features/todos/components/edit-todo-dialog";
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
                  <Circle aria-hidden="true" className="size-4 text-muted-foreground" />
                  <span className="truncate">{todo.title}</span>
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
                <EditTodoDialog todo={todo} />
                <TodoFavoriteToggle todoId={todo.id} favorite={todo.favorite} />
                <DeleteTodoDialog todo={todo} />
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
