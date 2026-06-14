import { Skeleton } from "@/components/ui/skeleton";

export function UsersLoadingView() {
  return (
    <main className="flex flex-1 flex-col bg-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <Skeleton className="mb-4 h-5 w-36" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-lg" />
        ))}
      </section>
    </main>
  );
}
