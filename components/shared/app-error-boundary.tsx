"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-background p-6 text-center">
        <h1 className="text-xl font-semibold tracking-normal">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page could not finish loading. Try again to reload this screen.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
