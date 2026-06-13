import { SignUpForm } from "@/features/auth/components/sign-up-form";

export function SignUpView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <SignUpForm />
    </main>
  );
}
