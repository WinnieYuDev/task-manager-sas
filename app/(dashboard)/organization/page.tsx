"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { useState } from "react";
import { Copy, UserPlus } from "lucide-react";

export default function OrganizationPage() {
  const currentOrg = useQuery(api.organizations.getCurrent, {});
  const createOrg = useMutation(api.organizations.create);
  const updateOrg = useMutation(api.organizations.update);
  const inviteByEmail = useMutation(api.invitations.inviteByEmail);
  const members = useQuery(
    api.organizations.listMembers,
    currentOrg?._id ? { organizationId: currentOrg._id } : "skip"
  );
  const pendingInvitations = useQuery(
    api.invitations.listPendingInvitations,
    currentOrg?._id ? { organizationId: currentOrg._id } : "skip"
  );

  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setIsCreating(true);
    try {
      await createOrg({ name: trimmed });
      setName("");
      toast.success("Organization created");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentOrg?._id) return;
    const trimmed = editingName.trim();
    if (!trimmed || trimmed === currentOrg.name) return;
    setIsUpdating(true);
    try {
      await updateOrg({ organizationId: currentOrg._id, name: trimmed });
      setEditingName("");
      toast.success("Organization updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!currentOrg?._id || !inviteEmail.trim()) return;
    setInviteSubmitting(true);
    setLastInviteLink(null);
    try {
      const { link } = await inviteByEmail({
        organizationId: currentOrg._id,
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setLastInviteLink(link);
      setInviteEmail("");
      toast.success("Invite created. Share the link below.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to invite");
    } finally {
      setInviteSubmitting(false);
    }
  }

  function copyInviteLink(link: string) {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  }

  if (currentOrg === undefined) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Organization</h1>
          <p className="text-[var(--muted)]">Manage your organization</p>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Organization</h1>
          <p className="text-[var(--muted)]">Create an organization to invite a team</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create organization</CardTitle>
            <CardDescription>Give your organization a name</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="org-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Organization"
                  className="mt-1 max-w-xs"
                />
              </div>
              <Button type="submit" disabled={isCreating || !name.trim()}>
                {isCreating ? "Creating…" : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEditing = editingName !== "" && editingName !== currentOrg.name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization</h1>
        <p className="text-[var(--muted)]">Manage your organization and team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentOrg.name}</CardTitle>
          <CardDescription>Your current organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setEditingName(currentOrg.name)}>
              Edit name
            </Button>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="edit-org-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-org-name"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Organization name"
                  className="mt-1 max-w-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingName("")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Team</CardTitle>
            <CardDescription>Members and pending invitations</CardDescription>
          </div>
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 size-4" />
            Invite member
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {members === undefined ? (
            <Skeleton className="h-20 w-full" />
          ) : members.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m._id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{m.name}</span>
                    {m.email && (
                      <p className="text-xs text-[var(--muted)]">{m.email}</p>
                    )}
                  </div>
                  <span className="rounded bg-[var(--muted)]/20 px-2 py-0.5 text-xs font-medium capitalize">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {pendingInvitations !== undefined && pendingInvitations.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Pending invitations</h4>
              <ul className="space-y-2">
                {pendingInvitations.map((inv) => {
                  const link =
                    typeof window !== "undefined"
                      ? `${window.location.origin}/join?token=${inv.token}`
                      : "";
                  return (
                    <li
                      key={inv._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2"
                    >
                      <div>
                        <span className="font-medium">{inv.email}</span>
                        <span className="ml-2 rounded bg-[var(--muted)]/20 px-2 py-0.5 text-xs capitalize">
                          {inv.role}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(link)}
                      >
                        <Copy className="mr-1 size-3" />
                        Copy link
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) setLastInviteLink(null);
        }}
        title="Invite member"
        description="Send an invite link to add someone to your organization."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
              className="mt-1 flex h-9 w-full max-w-xs rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {lastInviteLink && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/10 p-3">
              <p className="text-xs font-medium text-[var(--muted)]">Invite link (copy and share)</p>
              <div className="mt-1 flex gap-2">
                <Input
                  readOnly
                  value={lastInviteLink}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyInviteLink(lastInviteLink)}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setInviteOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" disabled={inviteSubmitting}>
              {inviteSubmitting ? "Creating…" : "Create invite"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
