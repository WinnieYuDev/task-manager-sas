"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "TaskBloom replaced three tools for us. Clean, fast, and the analytics actually help.",
    name: "Jordan Lee",
    role: "Head of Product, Seed Co",
  },
  {
    quote:
      "Finally a task app that doesn't get in the way. We shipped 2x faster after switching.",
    name: "Sam Chen",
    role: "Engineering Lead, Flow",
  },
  {
    quote:
      "The real-time sync is magic. No more 'did you get my update?' in Slack.",
    name: "Alex Rivera",
    role: "Founder, Build Studio",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold"
        >
          Loved by teams
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]"
        >
          See what others are saying about TaskBloom.
        </motion.p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-[var(--border)]">
                <CardContent className="pt-6">
                  <p className="text-[var(--foreground)]">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 font-medium">{t.name}</p>
                  <p className="text-sm text-[var(--muted)]">{t.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
