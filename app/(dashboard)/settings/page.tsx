"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name != null) setName(user.name);
  }, [user?.name]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() || undefined });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted)]">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your display name and email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user === undefined ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1 max-w-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {user?.email ?? "—"}
                </p>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Light or dark mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Current plan: {user?.subscriptionStatus ?? "free"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/upgrade">Upgrade plan</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-strawberry/30">
        <CardHeader>
          <CardTitle className="text-strawberry">Danger zone</CardTitle>
          <CardDescription>
            Permanently delete your account and data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-strawberry text-strawberry hover:bg-strawberry/10">
            Delete account (placeholder)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
