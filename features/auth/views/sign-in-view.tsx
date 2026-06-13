import { SignInForm } from "@/features/auth/components/sign-in-form";

export function SignInView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <SignInForm />
    </main>
  );
}
