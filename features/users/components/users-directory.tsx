import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicUserStat } from "@/features/users/types/public-user-stat";

type UsersDirectoryProps = {
  users: PublicUserStat[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function UsersDirectory({ users }: UsersDirectoryProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No users yet</CardTitle>
          <CardDescription>
            Public user statistics will appear here after people create accounts.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="truncate">{user.displayName}</CardTitle>
                <CardDescription>Joined {dateFormatter.format(user.joinedAt)}</CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {user.todoCount} {user.todoCount === 1 ? "todo" : "todos"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Public stats only. Private todo details stay visible to their owner.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
