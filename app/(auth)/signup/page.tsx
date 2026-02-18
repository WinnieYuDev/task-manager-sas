"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("flow", "signUp");
    try {
      await signIn("password", formData);
      toast.success("Account created. Welcome to TaskBloom!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
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
