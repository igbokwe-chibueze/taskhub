import { Skeleton } from "@/components/ui/skeleton";

export function TodosLoadingView() {
  return (
    <main className="flex flex-1 flex-col bg-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <Skeleton className="mb-4 h-5 w-36" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-8 w-56 rounded-lg" />
        <Skeleton className="mb-4 h-28 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </section>
    </main>
  );
}
