import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Todo } from "@/features/todos/types/todo";

const sessionMock = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
}));

const revalidateMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

const todoRepositoryMock = vi.hoisted(() => ({
  createTodo: vi.fn(),
  deleteTodo: vi.fn(),
  getTodoById: vi.fn(),
  updateTodo: vi.fn(),
  updateTodoCompleted: vi.fn(),
  updateTodoFavorite: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => sessionMock);

vi.mock("next/cache", () => revalidateMock);

vi.mock("@/features/todos/repositories/todos.repository", () => todoRepositoryMock);

import {
  createTodoAction,
  deleteTodoAction,
  updateTodoAction,
  updateTodoCompletedAction,
  updateTodoFavoriteAction,
} from "@/features/todos/actions/todo.actions";

const session = {
  user: {
    id: "user_1",
    name: "Pat",
    email: "pat@example.com",
  },
};

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

describe("todo Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.getCurrentSession.mockResolvedValue(session);
  });

  it("requires authentication before creating a todo", async () => {
    sessionMock.getCurrentSession.mockResolvedValue(null);

    await expect(
      createTodoAction({ title: "Write tests", description: "" }),
    ).resolves.toEqual({
      ok: false,
      message: "You must be signed in to create todos.",
    });
    expect(todoRepositoryMock.createTodo).not.toHaveBeenCalled();
  });

  it("validates create input before writing", async () => {
    await expect(
      createTodoAction({ title: "", description: "" }),
    ).resolves.toMatchObject({
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        title: "Title is required.",
      },
    });
    expect(todoRepositoryMock.createTodo).not.toHaveBeenCalled();
  });

  it("creates todos with the session user id and revalidates the dashboard", async () => {
    todoRepositoryMock.createTodo.mockResolvedValue(todo);

    await expect(
      createTodoAction({
        title: "  Write tests  ",
        description: "  Cover the core todo flow.  ",
      }),
    ).resolves.toEqual({ ok: true });

    expect(todoRepositoryMock.createTodo).toHaveBeenCalledWith({
      title: "Write tests",
      description: "Cover the core todo flow.",
      userId: "user_1",
    });
    expect(revalidateMock.revalidatePath).toHaveBeenCalledWith("/todos");
  });

  it("prevents favorite updates for todos outside the session owner", async () => {
    todoRepositoryMock.getTodoById.mockResolvedValue({
      ...todo,
      userId: "other_user",
    });

    await expect(
      updateTodoFavoriteAction({ todoId: "todo_1", favorite: true }),
    ).resolves.toEqual({
      ok: false,
      message: "Todo not found.",
    });
    expect(todoRepositoryMock.updateTodoFavorite).not.toHaveBeenCalled();
  });

  it("updates favorite and completed state after ownership passes", async () => {
    todoRepositoryMock.getTodoById.mockResolvedValue(todo);
    todoRepositoryMock.updateTodoFavorite.mockResolvedValue({
      ...todo,
      favorite: true,
    });
    todoRepositoryMock.updateTodoCompleted.mockResolvedValue({
      ...todo,
      completed: true,
    });

    await expect(
      updateTodoFavoriteAction({ todoId: "todo_1", favorite: true }),
    ).resolves.toEqual({ ok: true });
    await expect(
      updateTodoCompletedAction({ todoId: "todo_1", completed: true }),
    ).resolves.toEqual({ ok: true });

    expect(todoRepositoryMock.updateTodoFavorite).toHaveBeenCalledWith({
      todoId: "todo_1",
      favorite: true,
    });
    expect(todoRepositoryMock.updateTodoCompleted).toHaveBeenCalledWith({
      todoId: "todo_1",
      completed: true,
    });
  });

  it("updates editable todo fields after validating ownership", async () => {
    todoRepositoryMock.getTodoById.mockResolvedValue(todo);
    todoRepositoryMock.updateTodo.mockResolvedValue({
      ...todo,
      title: "Updated",
    });

    await expect(
      updateTodoAction({
        todoId: "todo_1",
        title: "  Updated  ",
        description: "  Better notes.  ",
      }),
    ).resolves.toEqual({ ok: true });

    expect(todoRepositoryMock.updateTodo).toHaveBeenCalledWith({
      todoId: "todo_1",
      title: "Updated",
      description: "Better notes.",
    });
  });

  it("deletes only owned todos", async () => {
    todoRepositoryMock.getTodoById.mockResolvedValue(todo);
    todoRepositoryMock.deleteTodo.mockResolvedValue(todo);

    await expect(deleteTodoAction({ todoId: "todo_1" })).resolves.toEqual({
      ok: true,
    });
    expect(todoRepositoryMock.deleteTodo).toHaveBeenCalledWith("todo_1");
  });
});
