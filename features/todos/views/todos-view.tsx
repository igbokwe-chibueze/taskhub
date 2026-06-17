import { CheckCircle2, Inbox, LayoutDashboard, Star } from "lucide-react";
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
import { CreateTodoDialog } from "@/features/todos/components/create-todo-dialog";
import { TodosList } from "@/features/todos/components/todos-list";
import { getTodosByUserId } from "@/features/todos/repositories/todos.repository";
import { getUserPreferences } from "@/features/users/repositories/users.repository";
import { defaultUserPreferences } from "@/features/users/types/user-preferences";
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

  // Step 10 adds the authenticated read path. The repository scopes the query
  // to this session user so no other user's todos can be returned.
  const todos = await getTodosByUserId(session.user.id);
  const favoriteTodos = todos.filter((todo) => todo.favorite);
  const completedTodos = todos.filter((todo) => todo.completed);
  const preferences =
    (await getUserPreferences(session.user.id)) ?? defaultUserPreferences;

  return (
    <main
      data-user-theme-scope
      data-color-theme={preferences.themeColor}
      className="flex flex-1 flex-col bg-muted/30"
    >
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
            <CreateTodoDialog />
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
              <TabsTrigger value="completed">
                <CheckCircle2 aria-hidden="true" />
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <Card className="mb-4 bg-background">
              <CardHeader>
                <CardTitle>All Todos</CardTitle>
                <CardDescription>
                  {todos.length === 1
                    ? "1 todo in your private workspace."
                    : `${todos.length} todos in your private workspace.`}
                </CardDescription>
              </CardHeader>
            </Card>
            {todos.length > 0 ? (
              <TodosList todos={todos} />
            ) : (
              <EmptyTodosState
                title="No todos yet"
                description="Create your first todo from the button above. It will appear here immediately after it is saved."
              />
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="mb-4 bg-background">
              <CardHeader>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>
                  {favoriteTodos.length === 1
                    ? "1 favorited todo in your private workspace."
                    : `${favoriteTodos.length} favorited todos in your private workspace.`}
                </CardDescription>
              </CardHeader>
            </Card>
            {favoriteTodos.length > 0 ? (
              <TodosList todos={favoriteTodos} />
            ) : (
              <EmptyTodosState
                title="No favorite todos yet"
                description="Mark important todos as favorites from the All Todos tab, then they will appear here."
              />
            )}
          </TabsContent>

          <TabsContent value="completed">
            <Card className="mb-4 bg-background">
              <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>
                  {completedTodos.length === 1
                    ? "1 completed todo in your private workspace."
                    : `${completedTodos.length} completed todos in your private workspace.`}
                </CardDescription>
              </CardHeader>
            </Card>
            {completedTodos.length > 0 ? (
              <TodosList todos={completedTodos} />
            ) : (
              <EmptyTodosState
                title="No completed todos yet"
                description="Mark todos complete from any tab, then your finished work will appear here."
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
