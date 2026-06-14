import { Users } from "lucide-react";

import { getPublicUserStats } from "@/features/users/repositories/users.repository";
import { UsersDirectory } from "@/features/users/components/users-directory";
import { Badge } from "@/components/ui/badge";

export async function UsersView() {
  // Keep the data read in the server view and route it through the repository,
  // preserving the required View -> Repository -> Prisma boundary for reads.
  const users = await getPublicUserStats();
  const totalTodos = users.reduce((sum, user) => sum + user.todoCount, 0);

  return (
    <main className="flex flex-1 flex-col bg-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <Badge variant="outline" className="mb-4 bg-background">
            <Users aria-hidden="true" />
            Public directory
          </Badge>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                TaskHub users
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                A public, privacy-conscious snapshot of who is using TaskHub and how many
                todos they have created.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="mt-1 text-2xl font-semibold">{users.length}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Todos</p>
                <p className="mt-1 text-2xl font-semibold">{totalTodos}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <UsersDirectory users={users} />
      </section>
    </main>
  );
}
