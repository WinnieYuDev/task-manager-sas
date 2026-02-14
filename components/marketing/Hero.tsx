"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, var(--grape) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, var(--dragonfruit) 0%, transparent 40%)",
        }}
      />
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          Where productivity{" "}
          <span className="text-[var(--color-accent)]">blossoms</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-[var(--muted)] sm:text-xl"
        >
          The task management platform that grows with you. Real-time sync,
          analytics, and a calm, powerful workflow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/signup">Start free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">View demo</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-glass"
        >
          <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-[var(--muted)]">
            Dashboard preview
          </div>
        </motion.div>
      </div>
    </section>
  );
}
