"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { getCurrentSession } from "@/lib/auth/session";
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

// React Hook Form expects errors keyed by field name; keep that translation
// here so client forms do not need to understand Zod's issue format.
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
  // 1. Verify auth state first. Sign-in is an unauthenticated workflow, so an
  // already-authenticated user should not create another session accidentally.
  const session = await getCurrentSession();

  if (session) {
    redirect("/todos");
  }

  // 2. Validate credentials at the Server Action boundary.
  // Server Actions are the trust boundary, so validate again even though the
  // client form already runs the same schema for immediate feedback.
  const parsedInput = signInSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<SignInField>(parsedInput.error),
    };
  }

  try {
    // 3-4. There is no app-owned record to authorize here; Better Auth owns the
    // credential check and its internal persistence instead of a feature repository.
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

  // 5. Successful auth workflows redirect; validation/auth failures return the
  // typed action result above for the form to render accessibly.
  redirect("/todos");
}

export async function signUpAction(
  input: SignUpInput,
): Promise<AuthActionResult<SignUpField>> {
  // 1. Verify auth state first. Sign-up is only for visitors; signed-in users
  // already have an account and should stay in the private app area.
  const session = await getCurrentSession();

  if (session) {
    redirect("/todos");
  }

  // 2. Validate account creation input before handing it to Better Auth.
  // Keep sign-up validation server-side as well so direct action calls cannot
  // bypass the client form rules.
  const parsedInput = signUpSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<SignUpField>(parsedInput.error),
    };
  }

  try {
    // 3-4. Ownership is not applicable until the account exists; Better Auth
    // owns user creation and its internal persistence for this auth workflow.
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

  // 5. Successful auth workflows redirect; validation/auth failures return the
  // typed action result above for the form to render accessibly.
  redirect("/todos");
}

export async function signOutAction(): Promise<never> {
  // 1. Verify auth state before clearing a session. Visitors are redirected to
  // the sign-in page without invoking Better Auth's sign-out mutation.
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Sign-out only depends on the current session cookie; the redirect keeps the
  // user on an explicit auth route after the cookie is cleared.
  // 2-4. There is no user input or app-owned record to authorize; Better Auth
  // owns its session persistence instead of a feature repository.
  await auth.api.signOut({
    headers: await headers(),
  });

  // 5. Sign-out always completes with an explicit redirect.
  redirect("/auth/sign-in");
}
