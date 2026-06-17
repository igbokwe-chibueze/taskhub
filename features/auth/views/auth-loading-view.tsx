import { Skeleton } from "@/components/ui/skeleton";

export function AuthLoadingView() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
        <div className="mt-6 grid gap-5">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-8 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
