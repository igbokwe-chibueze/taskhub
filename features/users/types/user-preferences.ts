export const userThemeColors = ["neutral", "blue", "emerald", "rose"] as const;
export const userThemeModes = ["light", "dark"] as const;

export type UserThemeColor = (typeof userThemeColors)[number];
export type UserThemeMode = (typeof userThemeModes)[number];

export type UserPreferences = {
  themeColor: UserThemeColor;
  themeMode: UserThemeMode;
};

export const defaultUserPreferences: UserPreferences = {
  themeColor: "neutral",
  themeMode: "light",
};
