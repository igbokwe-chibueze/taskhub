"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth/session";
import { updateUserPreferences } from "@/features/users/repositories/users.repository";
import {
  updateUserPreferencesSchema,
  type UpdateUserPreferencesInput,
} from "@/features/users/schemas/update-user-preferences.schema";

export type UpdateUserPreferencesActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export async function updateUserPreferencesAction(
  input: UpdateUserPreferencesInput,
): Promise<UpdateUserPreferencesActionResult> {
  // 1. Verify authentication before mutating account-owned preferences.
  // Preferences are account-owned state, so the user id always comes from the
  // authenticated session rather than from the client payload.
  const session = await getCurrentSession();

  if (!session) {
    return {
      ok: false,
      message: "You must be signed in to update preferences.",
    };
  }

  // 2. Validate the theme payload against the only supported values.
  const parsedInput = updateUserPreferencesSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Theme preference could not be updated.",
    };
  }

  // 3. Ownership is established from the session because the client never sends
  // userId. This prevents one account from targeting another account's settings.
  // 4. The users repository is the only layer that writes preference fields.
  await updateUserPreferences({
    userId: session.user.id,
    themeColor: parsedInput.data.themeColor,
    themeMode: parsedInput.data.themeMode,
  });

  revalidatePath("/");

  // 5. Return a typed result so the client can show deterministic feedback.
  return {
    ok: true,
  };
}
