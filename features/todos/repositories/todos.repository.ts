import { prisma } from "@/lib/prisma";
import type { Todo } from "@/features/todos/types/todo";

type CreateTodoRepositoryInput = {
  title: string;
  description: string;
  userId: string;
};

type UpdateTodoFavoriteRepositoryInput = {
  todoId: string;
  favorite: boolean;
};

type UpdateTodoCompletedRepositoryInput = {
  todoId: string;
  completed: boolean;
};

type UpdateTodoRepositoryInput = {
  todoId: string;
  title: string;
  description: string;
};

export async function getTodosByUserId(userId: string): Promise<Todo[]> {
  // All todo reads stay scoped to the authenticated owner. Callers pass the
  // user id from the server session, not from route params or client state.
  return prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  });
}

export async function createTodo(input: CreateTodoRepositoryInput): Promise<Todo> {
  // Repositories are the only todos feature files allowed to import Prisma.
  // The caller must already have authenticated the request and chosen userId
  // from the trusted server session.
  return prisma.todo.create({
    data: {
      title: input.title,
      description: input.description,
      userId: input.userId,
    },
  });
}

export async function getTodoById(todoId: string): Promise<Todo | null> {
  return prisma.todo.findUnique({
    where: {
      id: todoId,
    },
  });
}

export async function updateTodoFavorite(
  input: UpdateTodoFavoriteRepositoryInput,
): Promise<Todo> {
  return prisma.todo.update({
    where: {
      id: input.todoId,
    },
    data: {
      favorite: input.favorite,
    },
  });
}

export async function updateTodoCompleted(
  input: UpdateTodoCompletedRepositoryInput,
): Promise<Todo> {
  return prisma.todo.update({
    where: {
      id: input.todoId,
    },
    data: {
      completed: input.completed,
    },
  });
}

export async function updateTodo(input: UpdateTodoRepositoryInput): Promise<Todo> {
  return prisma.todo.update({
    where: {
      id: input.todoId,
    },
    data: {
      title: input.title,
      description: input.description,
    },
  });
}

export async function deleteTodo(todoId: string): Promise<Todo> {
  return prisma.todo.delete({
    where: {
      id: todoId,
    },
  });
}
