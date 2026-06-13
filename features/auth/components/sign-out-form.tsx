import { LogOut } from "lucide-react";

import { signOutAction } from "@/features/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignOutForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign out</CardTitle>
        <CardDescription>End your TaskHub session on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signOutAction}>
          <Button type="submit" className="w-full">
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
