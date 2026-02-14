"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center shadow-glass"
      >
        <h2 className="text-3xl font-bold">Start your free 14-day trial</h2>
        <p className="mt-4 text-[var(--muted)]">
          No credit card required. Get full access to TaskBloom in seconds.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/signup">Start free trial</Link>
        </Button>
      </motion.div>
    </section>
  );
}
