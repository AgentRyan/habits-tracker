"use client";

import { useSession } from "next-auth/react";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const rawUser = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  return {
    user: rawUser ?? null,
    uid: rawUser?.id ?? null,
    loading: status === "loading",
    authenticated: status === "authenticated",
  };
}
