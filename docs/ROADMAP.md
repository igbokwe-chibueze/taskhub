# TaskHub — Build Roadmap

> Companion document to `AGENTS.md` and `docs/PRODUCT-OVERVIEW.md`. Steps are executed **one at a time, in order**. Each step should stay within its own scope — do not implement functionality belonging to a later step, even if it seems convenient to bundle it in.
>
> Update the checkboxes below as each step is completed.

---

## Completed

- [x] **1. Project setup**
- [x] **2. Prisma setup**
- [x] **3. Better Auth setup**
- [x] **4. Auth pages**
  Sign up, sign in, and sign out pages/forms in `features/auth`, using the Better Auth client, Server Actions, and React Hook Form + Zod validation.

- [x] **5. Layout/navbar**
  Root layout and navbar with auth-aware links (sign in/up vs. dashboard/sign out), built with shadcn/ui.

---

## Remaining

- [ ] **6. Landing page**
  Public marketing page at `/` — product overview and CTAs linking to sign up, sign in, and the users page.

- [ ] **7. Public users page**
  `/users` route showing user name/email, total todo count (via a Prisma aggregation through a repository), and optional join date. No sensitive data.

- [ ] **8. Protected todos page**
  `/todos` route scaffold with route protection (redirect unauthenticated users to `/auth/sign-in`) and the Tabs shell (All / Favorites) with empty states — no CRUD yet.

- [ ] **9. Create todo**
  Create Server Action + form (Dialog) using React Hook Form + Zod, writing through the todos repository, with ownership taken from the session.

- [ ] **10. List todos**
  Read the authenticated user's todos via the repository and render them in the All Todos tab.

- [ ] **11. Favorite tabs**
  Favorite/unfavorite toggle action, and Favorites tab filtering to show only favorited todos.

- [ ] **12. Edit todo**
  Update Server Action + edit form/dialog, with ownership verification.

- [ ] **13. Delete todo**
  Delete Server Action + confirmation dialog, with ownership verification.

- [ ] **14. Security review**
  Audit every Server Action against the 5-step checklist in `AGENTS.md` (auth check, Zod validation, ownership verification, repository-only DB access, typed return). Treat this as an audit pass, not the only enforcement point.

- [ ] **15. UI polish**
  Responsive/mobile pass, accessibility check, loading/empty/error states across all pages.

- [ ] **16. Testing**
  Set up the test framework (e.g. Vitest for repositories/schemas/actions, Playwright for auth + todos E2E flows) and write coverage for core flows.

- [ ] **17. Deployment prep**
  Environment variables, production migrations, build checks, and deployment platform configuration.
