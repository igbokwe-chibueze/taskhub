"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentSession } from "@/lib/auth/session";
import {
  createTodo,
  getTodoById,
  updateTodo,
  updateTodoFavorite,
} from "@/features/todos/repositories/todos.repository";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/features/todos/schemas/create-todo.schema";
import {
  updateTodoFavoriteSchema,
  type UpdateTodoFavoriteInput,
} from "@/features/todos/schemas/update-todo-favorite.schema";
import {
  updateTodoSchema,
  type UpdateTodoInput,
} from "@/features/todos/schemas/update-todo.schema";

type CreateTodoField = keyof CreateTodoInput;
type UpdateTodoField = keyof UpdateTodoInput;

export type CreateTodoActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<CreateTodoField, string>>;
    };

export type UpdateTodoFavoriteActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export type UpdateTodoActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<UpdateTodoField, string>>;
    };

function getFieldErrors<TField extends string>(
  error: z.ZodError,
): Partial<Record<TField, string>> {
  const fieldErrors: Partial<Record<TField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field as TField]) {
      fieldErrors[field as TField] = issue.message;
    }
  }

  return fieldErrors;
}

export async function createTodoAction(
  input: CreateTodoInput,
): Promise<CreateTodoActionResult> {
  // 1. Verify authentication before trusting any mutation request.
  const session = await getCurrentSession();

  if (!session) {
    return {
      ok: false,
      message: "You must be signed in to create todos.",
    };
  }

  // 2. Validate input on the server even though the client form also validates.
  const parsedInput = createTodoSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<CreateTodoField>(parsedInput.error),
    };
  }

  // 3. For creates, ownership is established here from the trusted session.
  // The client never sends userId, so there is no client-provided owner to verify.
  await createTodo({
    title: parsedInput.data.title,
    description: parsedInput.data.description,
    userId: session.user.id,
  });

  // 4-5. Repository did the database write; return a typed result and refresh
  // the protected dashboard so future list rendering receives fresh data.
  revalidatePath("/todos");

  return {
    ok: true,
  };
}

export async function updateTodoFavoriteAction(
  input: UpdateTodoFavoriteInput,
): Promise<UpdateTodoFavoriteActionResult> {
  // 1. Authenticate first so ownership can be checked against a trusted user.
  const session = await getCurrentSession();

  if (!session) {
    return {
      ok: false,
      message: "You must be signed in to update todos.",
    };
  }

  // 2. Validate the todo id and target favorite state before any repository write.
  const parsedInput = updateTodoFavoriteSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Favorite status could not be updated.",
    };
  }

  // 3. Verify ownership before allowing the mutation. Missing todos and todos
  // owned by another user are treated the same way to avoid leaking data.
  const todo = await getTodoById(parsedInput.data.todoId);

  if (!todo || todo.userId !== session.user.id) {
    return {
      ok: false,
      message: "Todo not found.",
    };
  }

  // 4-5. The repository performs the write and the action returns a typed result.
  await updateTodoFavorite({
    todoId: parsedInput.data.todoId,
    favorite: parsedInput.data.favorite,
  });

  revalidatePath("/todos");

  return {
    ok: true,
  };
}

export async function updateTodoAction(
  input: UpdateTodoInput,
): Promise<UpdateTodoActionResult> {
  // 1. Authenticate before validating ownership or applying edits.
  const session = await getCurrentSession();

  if (!session) {
    return {
      ok: false,
      message: "You must be signed in to update todos.",
    };
  }

  // 2. Validate editable fields and the todo id at the Server Action boundary.
  const parsedInput = updateTodoSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<UpdateTodoField>(parsedInput.error),
    };
  }

  // 3. Verify ownership before updating. This prevents a signed-in user from
  // editing another user's todo by guessing or submitting a different id.
  const todo = await getTodoById(parsedInput.data.todoId);

  if (!todo || todo.userId !== session.user.id) {
    return {
      ok: false,
      message: "Todo not found.",
    };
  }

  // 4-5. Repository performs the Prisma write; the action returns a typed result.
  await updateTodo({
    todoId: parsedInput.data.todoId,
    title: parsedInput.data.title,
    description: parsedInput.data.description,
  });

  revalidatePath("/todos");

  return {
    ok: true,
  };
}
