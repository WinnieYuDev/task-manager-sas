"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const inviteData = useQuery(
    api.invitations.getByToken,
    token ? { token } : "skip"
  );
  const user = useQuery(api.users.getCurrentUser, {});
  const acceptInvitation = useMutation(api.invitations.acceptInvitation);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token || user === undefined) return;
    if (user === null && token) {
      const redirect = `/join?token=${encodeURIComponent(token)}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [token, user, router]);

  async function handleAccept() {
    if (!token) return;
    setAccepting(true);
    try {
      await acceptInvitation({ token });
      toast.success("You joined the organization");
      router.push("/organization");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to accept invite");
    } finally {
      setAccepting(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
        <CardHeader>
          <CardTitle>Invalid invite link</CardTitle>
          <CardDescription>This invite link is missing a token.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button variant="outline">Go to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (inviteData === undefined) {
    return (
      <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-[var(--muted)]">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  if (inviteData === null) {
    return (
      <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
        <CardHeader>
          <CardTitle>Invalid or expired invite</CardTitle>
          <CardDescription>This invite link may have been used or expired.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button variant="outline">Go to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (user === null) {
    return (
      <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
        <CardHeader>
          <CardTitle>Sign in to join</CardTitle>
          <CardDescription>
            You need to sign in to join {inviteData.organizationName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/login?redirect=${encodeURIComponent(`/join?token=${token}`)}`}>
            <Button className="w-full">Sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-[var(--border)] shadow-glass">
      <CardHeader>
        <CardTitle>Accept invite</CardTitle>
        <CardDescription>
          You’ve been invited to join <strong>{inviteData.organizationName}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={handleAccept}
          disabled={accepting}
        >
          {accepting ? "Joining…" : "Accept invite"}
        </Button>
      </CardContent>
    </Card>
  );
}
