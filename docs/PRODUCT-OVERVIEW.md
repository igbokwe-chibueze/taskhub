# TaskHub — Product Overview

> Companion document to `AGENTS.md`. This file covers the product vision, full application description, UX goals, and learning objectives. `AGENTS.md` covers the architecture rules and constraints AI agents must follow on every task — consult this file when you need broader context on *why* the project is structured the way it is.

---

## 1. Vision & Purpose

TaskHub (referred to as "TodoMaster" in earlier planning notes) is a simple but production-quality todo management application. It is built primarily as a **learning project for mastering AI-assisted software development**.

The goal is not simply to build a todo app — it's to learn how to collaborate effectively with AI to design, architect, build, test, secure, and deploy a modern web application using industry-standard practices. The codebase is intended to serve as a **reference implementation** for future projects, demonstrating clean architecture, separation of concerns, security, maintainability, and scalability.

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

The project is built with Feature-Based Architecture as its core organizing principle (see `AGENTS.md` for the detailed standard).

---

## 3. Application Overview

TaskHub allows registered users to create and manage personal todo items. Each user owns their own data — users must never be able to view, modify, or delete another user's todos. The application has both a public area and an authenticated area.

### 3.1 Public Area

**Landing Page** (`/`)

Introduces the application. Includes:

- Product overview
- Call-to-action buttons (sign up / sign in)
- Link to the users page

**Users Directory** (`/users`)

Displays public application statistics, without exposing sensitive information:

- User name (or email)
- Total number of todos
- Join date (optional)

### 3.2 Authentication

Handled by Better Auth, implemented as its own feature module. Users can sign up, sign in, and sign out. Protected pages redirect unauthenticated users to `/auth/sign-in`.

### 3.3 Todos Feature (Core Domain)

Route: `/todos`

Authenticated users can:

- Create todos
- Edit todos
- Delete todos
- Favorite / unfavorite todos
- Mark todos complete / incomplete

**Todo fields:** `id`, `title`, `description`, `completed`, `favorite`, `createdAt`, `updatedAt`, `userId`

**Dashboard:** Users see only their own todos, organized via shadcn/ui Tabs:

- **All Todos** — the user's complete list
- **Favorites** — only todos marked as favorite

---

## 4. User Experience Goals

The application should be:

- Fast
- Responsive
- Mobile-friendly
- Accessible
- Modern and clean
- Easy to understand

Use shadcn/ui components wherever appropriate (Dialog, Field, Input, Textarea, Card, Tabs, Badge, Dropdown Menu, Button, etc.).

---

## 5. Architecture at a Glance

TaskHub strictly follows a **Feature-Based Architecture**: code organized by business domain (auth, users, todos, marketing), with Server Actions as the default mutation pattern, a mandatory repository layer between Server Actions and Prisma, and route files that contain only re-exports.

This is enforced in detail in `AGENTS.md` — including the required View → Action → Repository → Prisma → Database data flow, security checklist for every Server Action, and the always/never rules for AI-generated code. Treat `AGENTS.md` as the authoritative source for *how* to implement; this document covers *what* is being built and *why*.

---

## 6. Learning Objectives

This project exists to teach:

### Next.js
- App Router
- Layouts
- Server Components
- Client Components
- Server Actions
- Route Protection

### Better Auth
- Authentication
- Sessions
- Authorization

### Prisma
- Data modeling
- Relationships
- CRUD operations
- Repository pattern

### shadcn/ui
- Modern UI composition
- Form patterns
- Dialog patterns
- Table patterns
- Dashboard layouts

### AI-Assisted Development
- Breaking features into implementation tasks
- Generating production-quality code
- Reviewing AI output
- Maintaining architectural consistency
- Using AI as a software engineering partner

---

## 7. Success Criteria

The application is considered complete when:

1. Users can register and authenticate.
2. Users can create todos.
3. Users can edit todos.
4. Users can delete todos.
5. Users can favorite todos.
6. Users can complete todos.
7. Users only access their own data.
8. Public visitors can view user statistics.
9. The application follows the Feature-Based Architecture Standard.
10. The application uses Server Actions instead of API routes.
11. The application can be deployed successfully to production.
12. The codebase is clean, scalable, and AI-friendly.
