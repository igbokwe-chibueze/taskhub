import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";

// Centralize server-side session reads so layouts and protected views do not
// need to know Better Auth's request-header plumbing.
export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
