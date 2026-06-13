import { SignOutForm } from "@/features/auth/components/sign-out-form";

export function SignOutView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <SignOutForm />
    </main>
  );
}
