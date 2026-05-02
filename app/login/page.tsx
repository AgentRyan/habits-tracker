"use client";

export const dynamic = "force-dynamic";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [status, router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/home" });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">
        {/* Logo / branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-3xl">
            ✅
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Habits</h1>
          <p className="text-muted text-center text-sm leading-relaxed">
            Build stronger weeks, one habit at a time
          </p>
        </div>

        {/* Tagline card */}
        <div className="w-full bg-card rounded-2xl p-6 flex flex-col gap-4 border border-border">
          <div className="flex flex-col gap-2">
            <p className="text-white/90 text-sm font-medium">Track daily habits</p>
            <div className="w-full bg-border rounded-full h-1.5">
              <div className="bg-accent h-1.5 rounded-full w-4/5" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white/90 text-sm font-medium">Build streaks</p>
            <div className="w-full bg-border rounded-full h-1.5">
              <div className="bg-accent-cyan h-1.5 rounded-full w-3/5" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white/90 text-sm font-medium">Hit your goals</p>
            <div className="w-full bg-border rounded-full h-1.5">
              <div className="bg-accent-purple h-1.5 rounded-full w-2/3" />
            </div>
          </div>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || status === "loading"}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold rounded-2xl py-4 px-6 transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <p className="text-muted text-xs text-center">
          Your data is private and secure
        </p>
      </div>
    </div>
  );
}
