import { SignUpForm } from "@/features/auth/components/sign-up-form";

export function SignUpView() {
  return (
    // Subtract the root navbar height so the auth card remains visually centered.
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      <SignUpForm />
    </main>
  );
}
