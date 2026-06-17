import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Todo } from "@/features/todos/types/todo";

const prismaMock = vi.hoisted(() => ({
  todo: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodosByUserId,
  updateTodo,
  updateTodoCompleted,
  updateTodoFavorite,
} from "@/features/todos/repositories/todos.repository";

const todo: Todo = {
  id: "todo_1",
  title: "Write tests",
  description: "Cover the core todo flow.",
  completed: false,
  favorite: false,
  createdAt: new Date("2026-06-18T00:00:00.000Z"),
  updatedAt: new Date("2026-06-18T00:00:00.000Z"),
  userId: "user_1",
};

describe("todos repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("scopes todo reads to the supplied user id", async () => {
    prismaMock.todo.findMany.mockResolvedValue([todo]);

    await expect(getTodosByUserId("user_1")).resolves.toEqual([todo]);
    expect(prismaMock.todo.findMany).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  });

  it("creates todos with the trusted owner id", async () => {
    prismaMock.todo.create.mockResolvedValue(todo);

    await expect(
      createTodo({
        title: "Write tests",
        description: "Cover the core todo flow.",
        userId: "user_1",
      }),
    ).resolves.toEqual(todo);
    expect(prismaMock.todo.create).toHaveBeenCalledWith({
      data: {
        title: "Write tests",
        description: "Cover the core todo flow.",
        userId: "user_1",
      },
    });
  });

  it("reads, updates, and deletes by todo id through Prisma", async () => {
    prismaMock.todo.findUnique.mockResolvedValue(todo);
    prismaMock.todo.update.mockResolvedValue(todo);
    prismaMock.todo.delete.mockResolvedValue(todo);

    await getTodoById("todo_1");
    await updateTodoFavorite({ todoId: "todo_1", favorite: true });
    await updateTodoCompleted({ todoId: "todo_1", completed: true });
    await updateTodo({
      todoId: "todo_1",
      title: "Updated",
      description: "Updated description",
    });
    await deleteTodo("todo_1");

    expect(prismaMock.todo.findUnique).toHaveBeenCalledWith({
      where: { id: "todo_1" },
    });
    expect(prismaMock.todo.update).toHaveBeenNthCalledWith(1, {
      where: { id: "todo_1" },
      data: { favorite: true },
    });
    expect(prismaMock.todo.update).toHaveBeenNthCalledWith(2, {
      where: { id: "todo_1" },
      data: { completed: true },
    });
    expect(prismaMock.todo.update).toHaveBeenNthCalledWith(3, {
      where: { id: "todo_1" },
      data: {
        title: "Updated",
        description: "Updated description",
      },
    });
    expect(prismaMock.todo.delete).toHaveBeenCalledWith({
      where: { id: "todo_1" },
    });
  });
});
