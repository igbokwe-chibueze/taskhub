import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const productPillars = [
  {
    title: "Focused daily planning",
    description: "Capture the work that matters and keep the next action visible.",
    icon: CheckCircle2,
  },
  {
    title: "Favorites first",
    description: "Pin important todos so high-priority work does not get buried.",
    icon: Star,
  },
  {
    title: "Private by default",
    description: "Every todo belongs to the signed-in user and stays scoped to that account.",
    icon: ShieldCheck,
  },
];

const previewTodos = [
  { title: "Draft roadmap notes", status: "Today", favorite: true },
  { title: "Review repository boundaries", status: "In progress", favorite: false },
  { title: "Ship auth pages", status: "Complete", favorite: true },
];

export function LandingView() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b bg-background">
        {/* The hero uses a product-preview background instead of a decorative
            image so the first viewport immediately communicates what TaskHub is. */}
        <div aria-hidden="true" className="absolute inset-0 opacity-50">
          <div className="absolute inset-x-0 top-0 h-px bg-border" />
          <div className="absolute left-1/2 top-10 h-80 w-[44rem] -translate-x-1/2 rounded-full border bg-muted/30" />
          <div className="absolute left-1/2 top-28 grid w-[38rem] -translate-x-1/2 gap-3 opacity-70">
            {previewTodos.map((todo) => (
              <div
                key={todo.title}
                className="flex items-center justify-between gap-4 rounded-lg border bg-background/80 px-4 py-3 shadow-sm"
              >
                <span className="h-3 w-36 rounded bg-muted-foreground/20" />
                <span className="h-3 w-20 rounded bg-muted-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:py-20">
          <Badge variant="outline" className="mb-5 bg-background/80">
            <Sparkles aria-hidden="true" />
            Built as a clean architecture learning project
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            TaskHub
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A focused todo workspace for learning production-grade Next.js, Better Auth,
            Prisma, Server Actions, and feature-based architecture.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Use Link-backed buttons for internal navigation so Next.js can
                prefetch these screens and keep the marketing flow quick. */}
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Get started
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/users">
                <Users aria-hidden="true" />
                Users
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3">
          {productPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article key={pillar.title} className="rounded-lg border bg-background p-5">
                <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </div>
                <h2 className="text-base font-medium">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <Badge variant="secondary" className="mb-4">
              <LayoutDashboard aria-hidden="true" />
              Roadmap-aware
            </Badge>
            <h2 className="text-2xl font-semibold tracking-normal">Built one feature at a time</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              TaskHub is intentionally small, but every screen is built to reinforce secure
              data ownership, thin routes, typed validation, and repository-backed database access.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/auth/sign-up">
              Create your workspace
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
