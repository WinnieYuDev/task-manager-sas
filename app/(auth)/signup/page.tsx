"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const { signIn } = useAuthActions();
  const checkAuthEnv = useAction(api.debugAuthEnv.check);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("flow", "signUp");
    // #region agent log
    try {
      const envState = await checkAuthEnv();
      fetch("http://127.0.0.1:7243/ingest/2ddb888b-b0fb-4347-90f7-e4388c6ac6bf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hypothesisId: "H1",
          location: "signup/page.tsx:handleSubmit",
          message: "Convex auth env state before signIn",
          data: envState,
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    } catch (_) {}
    // #endregion
    try {
      await signIn("password", formData);
      // #region agent log
      fetch("http://127.0.0.1:7243/ingest/2ddb888b-b0fb-4347-90f7-e4388c6ac6bf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hypothesisId: "H1",
          runId: "post-fix",
          location: "signup/page.tsx:handleSubmit:after signIn",
          message: "signIn succeeded",
          data: { success: true },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      toast.success("Account created. Welcome to TaskBloom!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      // #region agent log
      let envState = { jwtPrivateKeySet: false, jwksSet: false };
      try {
        envState = await checkAuthEnv();
      } catch (_) {}
      fetch("http://127.0.0.1:7243/ingest/2ddb888b-b0fb-4347-90f7-e4388c6ac6bf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hypothesisId: "H1",
          location: "signup/page.tsx:handleSubmit:catch",
          message: "signIn failed; Convex auth env state",
          data: {
            errorMessage: err instanceof Error ? err.message : String(err),
            ...envState,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const msg = err instanceof Error ? err.message : "Sign up failed";
      if (typeof msg === "string" && msg.includes("JWT_PRIVATE_KEY")) {
        toast.error(
          "Auth not configured. Set JWT_PRIVATE_KEY and JWKS in the Convex dashboard (see README)."
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Get started with TaskBloom</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
