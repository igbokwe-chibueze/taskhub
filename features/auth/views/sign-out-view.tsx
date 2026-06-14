import { SignOutForm } from "@/features/auth/components/sign-out-form";

export function SignOutView() {
  return (
    // Subtract the root navbar height so the auth card remains visually centered.
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      <SignOutForm />
    </main>
  );
}
