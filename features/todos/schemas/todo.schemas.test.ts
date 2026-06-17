import { describe, expect, it } from "vitest";

import { createTodoSchema } from "@/features/todos/schemas/create-todo.schema";
import { deleteTodoSchema } from "@/features/todos/schemas/delete-todo.schema";
import { updateTodoCompletedSchema } from "@/features/todos/schemas/update-todo-completed.schema";
import { updateTodoFavoriteSchema } from "@/features/todos/schemas/update-todo-favorite.schema";
import { updateTodoSchema } from "@/features/todos/schemas/update-todo.schema";

describe("todo schemas", () => {
  it("trims todo titles and descriptions on create", () => {
    const result = createTodoSchema.parse({
      title: "  Review roadmap  ",
      description: "  Keep the next step scoped.  ",
    });

    expect(result).toEqual({
      title: "Review roadmap",
      description: "Keep the next step scoped.",
    });
  });

  it("rejects empty titles", () => {
    const result = createTodoSchema.safeParse({
      title: "   ",
      description: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Title is required.");
  });

  it("validates update payloads with ids and editable fields", () => {
    const result = updateTodoSchema.parse({
      todoId: "todo_1",
      title: "  Ship tests  ",
      description: "  Cover core flows.  ",
    });

    expect(result).toEqual({
      todoId: "todo_1",
      title: "Ship tests",
      description: "Cover core flows.",
    });
  });

  it("validates favorite, completed, and delete targets", () => {
    expect(
      updateTodoFavoriteSchema.parse({ todoId: "todo_1", favorite: true }),
    ).toEqual({ todoId: "todo_1", favorite: true });
    expect(
      updateTodoCompletedSchema.parse({ todoId: "todo_1", completed: true }),
    ).toEqual({ todoId: "todo_1", completed: true });
    expect(deleteTodoSchema.parse({ todoId: "todo_1" })).toEqual({
      todoId: "todo_1",
    });
  });
});
