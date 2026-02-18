"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ensureProfile = useMutation(api.users.ensureProfile);
  const seedTasks = useMutation(api.seed.seedTasksForNewUser);
  const user = useQuery(api.users.getCurrentUser);
  const taskList = useQuery(api.tasks.list, {});
  const ensuredRef = useRef(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
      return;
    }
    if (!user || ensuredRef.current) return;
    ensuredRef.current = true;
    ensureProfile({}).catch((e) => {
      console.error("DashboardShell: ensureProfile failed", e);
    });
  }, [user, ensureProfile, router]);

  useEffect(() => {
    if (!taskList?.page?.length && taskList?.isDone && !seededRef.current) {
      seededRef.current = true;
      seedTasks({}).catch((e) => {
        console.error("DashboardShell: seedTasks failed", e);
      });
    }
  }, [taskList, seedTasks]);

  if (user === null) return null;
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="pl-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
