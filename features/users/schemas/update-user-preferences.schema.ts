import { z } from "zod";

import {
  userThemeColors,
  userThemeModes,
} from "@/features/users/types/user-preferences";

export const updateUserPreferencesSchema = z.object({
  themeColor: z.enum(userThemeColors),
  themeMode: z.enum(userThemeModes),
});

export type UpdateUserPreferencesInput = z.infer<
  typeof updateUserPreferencesSchema
>;
