<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md — TaskHub

This file gives AI coding agents (Claude, Codex, Cursor, etc.) the context and rules needed to work on this codebase correctly. **Read this before generating or modifying any code.**

> Sections marked `[CONFIRM]` are inferred from the stated tech stack and should be checked against the actual `package.json` / project config and adjusted if they differ.

---

## 1. Project Overview

TaskHub (working title "TodoMaster" in early planning docs) is a production-quality todo management application. It is primarily a **learning project for mastering AI-assisted software development** — the goal is not just a todo app, but a reference implementation of clean architecture, security, maintainability, and scalability that future projects can be modeled on.

Every change should reinforce: clean separation of concerns, security-first defaults, and strict adherence to the architecture standard below.

---

## 2. Tech Stack

- Next.js (App Router)
- TypeScript
- Better Auth
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Server Actions

---

## 3. Architecture Standard — Feature-Based Architecture (MANDATORY)

This project strictly follows **Feature-Based Architecture**. Code is organized by business domain (feature), never by technical type. Every AI-generated implementation must follow this standard without exception.

### 3.1 Organize by Feature

```txt
features/
├── auth/
├── users/
├── todos/
└── marketing/
```

Do **not** create top-level technical folders (e.g. `components/`, `actions/`, `hooks/`) that contain feature-specific code. Feature ownership must always be unambiguous.

### 3.2 Server Actions Are the Default

Server Actions are the preferred — and default — mechanism for all mutations:

- Create operations
- Update operations
- Delete operations
- Authentication workflows
- Business workflows

Do not create API routes unless explicitly instructed by the project owner.

**Explicit exception:** Better Auth's required route handler at `app/api/auth/[...all]/route.ts` is allowed. Treat it as framework integration plumbing, not application business logic. Do not add other API routes unless the project owner explicitly approves them.

### 3.3 Repository Pattern (Mandatory)

All database access must go through repositories. Prisma must **never** be called directly from components, views, hooks, or actions — only repositories may import and use Prisma.

Required data flow:

```txt
View → Action → Repository → Prisma → Database
```

### 3.4 Route Files Stay Thin

The `app/` directory exists only for routing. Route files contain **only** re-exports — no JSX, no business logic, no Prisma calls, no auth logic.

The generated Prisma client currently lives at `app/generated/prisma`. Leave it there unless the project owner explicitly decides to move it. Do not treat generated Prisma client files as route files.

```ts
export { TodosView as default }
  from "@/features/todos/views/todos-view";
```

---

## 4. Project Structure

This project intentionally uses a **root-based structure**, not a `src/` directory. Do not introduce `src/` unless the project owner explicitly asks for a migration. The structure below describes the intended root-level layout even where older notes mention `src/`.

```txt
(project root)/
├── app/
│
├── components/
│   ├── ui/
│   ├── shared/
│   └── data-table/
│
├── hooks/
│
├── lib/
│   ├── prisma.ts
│   ├── auth/
│   └── utils.ts
│
├── types/
│
└── features/
    │
    ├── marketing/
    │   └── views/
    │
    ├── auth/
    │   ├── actions/
    │   ├── components/
    │   ├── schemas/
    │   ├── repositories/
    │   ├── types/
    │   └── views/
    │
    ├── users/
    │   ├── repositories/
    │   ├── components/
    │   ├── types/
    │   └── views/
    │
    └── todos/
        ├── actions/
        ├── components/
        ├── repositories/
        ├── schemas/
        ├── types/
        ├── hooks/
        ├── lib/
        └── views/
```

Only create folders that are actually needed for the current feature work — never create speculative folders "for later."

Use `components/shared/` for truly cross-feature UI such as the app navbar. Feature-specific UI belongs inside the owning feature's `components/` folder.

If a needed script, folder, or dependency is missing, create or install it as part of the task, but keep the scope narrow and explain the reason in the final handoff.

---

## 5. Application Domains

### 5.1 Public Area

**Landing Page** (`/`): product overview, CTAs for sign up / sign in, link to users page.

**Users Directory** (`/users`): public statistics only — user name (or email), total todo count, optional join date. No sensitive data. Built via Prisma aggregations accessed through repositories.

### 5.2 Authentication (Better Auth)

Implemented as its own `auth` feature module. Users can sign up, sign in, and sign out. Unauthenticated users accessing protected pages must be redirected to `/auth/sign-in`.

### 5.3 Todos Feature (Core Domain)

Route: `/todos`

Authenticated users can:

- Create, edit, delete todos
- Favorite / unfavorite todos
- Mark todos complete / incomplete

**Todo fields:**

```txt
id
title
description
completed
favorite
createdAt
updatedAt
userId
```

**Dashboard:** built with shadcn/ui `Tabs`.

- **All Todos** tab — the user's complete todo list
- **Favorites** tab — only todos marked as favorite

Users only ever see their own todos.

---

## 6. Security Requirements (Non-Negotiable)

Every Server Action must, in order:

1. Verify authentication.
2. Validate input with Zod.
3. Verify ownership.
4. Call the repository.
5. Return typed results.

Rules:

- **Never trust `userId` from the client.** Ownership always comes from the authenticated session.
- Users can only create, read, update, and delete **their own** todos.

---

## 7. Validation

All user input is validated with Zod. Schemas live in `features/*/schemas/`, e.g.:

```txt
create-todo.schema.ts
update-todo.schema.ts
```

---

## 8. UX Expectations

The app should be fast, responsive, mobile-friendly, accessible, modern, and easy to understand. Use shadcn/ui components wherever appropriate (Dialog, Field, Input, Textarea, Card, Tabs, Badge, Dropdown Menu, Button, etc.).

Use and ensure adequate loading and transition states across the app. Navigation across screens should feel instant whenever possible:

- Prefer `Link` for internal navigation so Next.js can prefetch routes.
- Add route-level `loading.tsx` files, Suspense boundaries, skeletons, disabled states, and pending states where data fetching or mutations could otherwise feel stalled.
- Forms and Server Action flows must communicate progress clearly with loading labels, disabled submit buttons, and accessible error states.
- Use toast notifications for short-lived global feedback such as successful mutations, failed actions, or important status updates. Toasts should complement inline accessible errors, not replace them.
- Do not leave blank screens during async work.

---

## 9. AI Agent Rules

### Always

- Follow Feature-Based Architecture.
- Use TypeScript.
- Use Zod validation for all user input.
- Use Server Actions for mutations.
- Use repositories for all database access.
- Use shadcn/ui components.
- Keep route files as one-line re-exports.
- Add adequate and extensive teaching-style comments where they help future readers understand the architecture, security model, data flow, or non-obvious implementation details.
- Include useful inline comments for important logic branches, validation/security boundaries, repository interactions, and loading/transition behavior.
- Maintain separation of concerns.

### Never

- Use API routes unless explicitly requested, except for Better Auth's required `app/api/auth/[...all]/route.ts` handler.
- Use Prisma outside repositories.
- Use the `any` type.
- Put business logic in route files.
- Call one feature's actions from another feature.
- Import components, hooks, or views directly from another feature.
- Create speculative/empty folders.

---

## 10. Setup Commands `[CONFIRM]`

Adjust to match the actual package manager (npm/pnpm/yarn) and scripts in `package.json`.

```bash
# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Apply database migrations (dev)
npx prisma migrate dev
```

---

## 11. Development Commands `[CONFIRM]`

```bash
# Start dev server
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

---

## 12. Code Quality Commands `[CONFIRM]`

```bash
# Lint
npm run lint

# Type-check
npm run type-check

# Format (if Prettier is configured)
npm run format
```

Run lint + type-check before considering any task complete.

---

## 13. Database Commands `[CONFIRM]`

```bash
# Open Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset the database (dev only — destroys data)
npx prisma migrate reset
```

---

## 14. Testing Instructions `[CONFIRM]`

No test framework has been finalized yet. Recommended for this stack:

- **Unit / integration:** Vitest or Jest for repositories, schemas, and Server Actions.
- **E2E:** Playwright for auth flows and the todos dashboard.

Once configured, document the run command here, e.g.:

```bash
npm run test
npm run test:e2e
```

Any new Server Action or repository function should include corresponding tests once the test framework is in place.

---

## 15. Environment Variables `[CONFIRM]`

At minimum, expect:

```txt
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

Add any additional provider keys (OAuth, email, etc.) here as they're introduced. Never commit `.env` files.

---

## 16. Commit & PR Conventions `[CONFIRM]`

Suggested defaults — adjust to match actual team workflow:

- Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).
- Keep PRs scoped to a single feature or fix.
- PR description should note: which feature module(s) changed, any new Server Actions/repositories, and any migration changes.
- Run lint + type-check (and tests, once configured) before opening a PR.

---

## 17. Definition of Done

A feature/task is complete when:

1. Users can register and authenticate.
2. Users can create, edit, delete todos.
3. Users can favorite/unfavorite and complete/incomplete todos.
4. Users only ever access their own data.
5. Public visitors can view aggregate user statistics.
6. The implementation follows the Feature-Based Architecture Standard exactly.
7. Server Actions are used instead of API routes (unless explicitly approved otherwise).
8. The codebase remains clean, scalable, and AI-friendly.

---

## 18. Learning Context (for AI agents)

This project doubles as a teaching vehicle for: Next.js App Router fundamentals (layouts, server/client components, server actions, route protection), Better Auth (auth, sessions, authorization), Prisma (data modeling, relationships, CRUD, repository pattern), and shadcn/ui composition patterns (forms, dialogs, tables, dashboards). When generating code, prefer clear, idiomatic patterns over clever shortcuts — explanations and comments matter as much as working code.
<!-- END:nextjs-agent-rules -->
