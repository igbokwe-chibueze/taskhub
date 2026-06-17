# TaskHub Security Audit

Date: 2026-06-17

Scope: Roadmap step 16, covering every current Server Action against the
`AGENTS.md` checklist:

1. Verify authentication or auth state.
2. Validate input with Zod, when input exists.
3. Verify ownership, when an app-owned record exists.
4. Use repositories for app database access.
5. Return typed results or complete with an explicit redirect.

## Server Action Results

| Action | Auth check | Zod validation | Ownership verification | Database access | Typed result |
| --- | --- | --- | --- | --- | --- |
| `signInAction` | Checks for an existing session and redirects signed-in users. | `signInSchema.safeParse` | Not applicable; Better Auth owns credential verification. | No Prisma import; uses Better Auth integration. | Typed form errors or redirect. |
| `signUpAction` | Checks for an existing session and redirects signed-in users. | `signUpSchema.safeParse` | Not applicable until account creation; Better Auth owns user creation. | No Prisma import; uses Better Auth integration. | Typed form errors or redirect. |
| `signOutAction` | Requires a current session before invoking sign-out. | Not applicable; no user input. | Not applicable; current session cookie is the target. | No Prisma import; uses Better Auth integration. | Explicit redirect. |
| `createTodoAction` | Requires a current session. | `createTodoSchema.safeParse` | Establishes `userId` from the session only. | Calls `createTodo` repository. | `CreateTodoActionResult`. |
| `updateTodoFavoriteAction` | Requires a current session. | `updateTodoFavoriteSchema.safeParse` | Fetches todo and compares `todo.userId` with session user id. | Calls todo repository functions. | `UpdateTodoFavoriteActionResult`. |
| `updateTodoCompletedAction` | Requires a current session. | `updateTodoCompletedSchema.safeParse` | Fetches todo and compares `todo.userId` with session user id. | Calls todo repository functions. | `UpdateTodoCompletedActionResult`. |
| `updateTodoAction` | Requires a current session. | `updateTodoSchema.safeParse` | Fetches todo and compares `todo.userId` with session user id. | Calls todo repository functions. | `UpdateTodoActionResult`. |
| `deleteTodoAction` | Requires a current session. | `deleteTodoSchema.safeParse` | Fetches todo and compares `todo.userId` with session user id. | Calls todo repository functions. | `DeleteTodoActionResult`. |
| `updateUserPreferencesAction` | Requires a current session. | `updateUserPreferencesSchema.safeParse` | Establishes `userId` from the session only. | Calls `updateUserPreferences` repository. | `UpdateUserPreferencesActionResult`. |

## Repository Boundary Check

Application Prisma imports are limited to:

- `lib/prisma.ts`, which creates the Prisma client.
- `lib/auth/auth.ts`, which wires Better Auth to Prisma.
- Feature repositories under `features/*/repositories/`.
- Generated Prisma client files under `app/generated/prisma/`.

No route files, views, components, hooks, or Server Actions import Prisma
directly.
