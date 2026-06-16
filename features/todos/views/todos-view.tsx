import { Inbox, LayoutDashboard, Star } from "lucide-react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentSession } from "@/lib/auth/session";

function EmptyTodosState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed bg-background">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Inbox aria-hidden="true" className="size-5" />
        </div>
        <h2 className="text-lg font-medium tracking-normal">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export async function TodosView() {
  // Protected views perform the auth check before rendering. Later todo reads
  // will use the authenticated user id from this session, never client input.
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="flex flex-1 flex-col bg-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <Badge variant="outline" className="mb-4 bg-background">
            <LayoutDashboard aria-hidden="true" />
            Private dashboard
          </Badge>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                Todos
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Your personal task workspace. Create, organize, and review todos from
                one protected dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Tabs defaultValue="all" className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList aria-label="Todo views">
              <TabsTrigger value="all">All Todos</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star aria-hidden="true" />
                Favorites
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <Card className="mb-4 bg-background">
              <CardHeader>
                <CardTitle>All Todos</CardTitle>
                <CardDescription>
                  Every todo you create will appear here once CRUD is added in the
                  next roadmap steps.
                </CardDescription>
              </CardHeader>
            </Card>
            <EmptyTodosState
              title="No todos yet"
              description="The dashboard shell is ready. The create flow comes next, so this space will soon hold your personal todo list."
            />
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="mb-4 bg-background">
              <CardHeader>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>
                  Favorited todos will be collected here after the favorite action is
                  implemented.
                </CardDescription>
              </CardHeader>
            </Card>
            <EmptyTodosState
              title="No favorite todos yet"
              description="Once todos can be favorited, your highest-priority items will appear in this tab."
            />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
