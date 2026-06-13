"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { signInSchema, type SignInInput } from "@/features/auth/schemas/sign-in.schema";
import { signUpSchema, type SignUpInput } from "@/features/auth/schemas/sign-up.schema";

type AuthActionResult<TField extends string> =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<TField, string>>;
    };

type SignInField = keyof SignInInput;
type SignUpField = keyof SignUpInput;

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

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function signInAction(
  input: SignInInput,
): Promise<AuthActionResult<SignInField>> {
  const parsedInput = signInSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<SignInField>(parsedInput.error),
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsedInput.data.email,
        password: parsedInput.data.password,
        callbackURL: "/todos",
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      ok: false,
      message: getAuthErrorMessage(error, "Unable to sign in."),
    };
  }

  redirect("/todos");
}

export async function signUpAction(
  input: SignUpInput,
): Promise<AuthActionResult<SignUpField>> {
  const parsedInput = signUpSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<SignUpField>(parsedInput.error),
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsedInput.data.name,
        email: parsedInput.data.email,
        password: parsedInput.data.password,
        callbackURL: "/todos",
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      ok: false,
      message: getAuthErrorMessage(error, "Unable to create your account."),
    };
  }

  redirect("/todos");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/auth/sign-in");
}
