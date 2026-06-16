import { TodoListItem } from "@/features/todos/components/todo-list-item";
import type { Todo } from "@/features/todos/types/todo";

export function TodosList({ todos }: { todos: Todo[] }) {
  return (
    <div className="grid gap-3">
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
