"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Layers, Zap, BarChart3, Users } from "lucide-react";

const FEATURES = [
  {
    title: "Smart Task Organization",
    description: "Priorities, due dates, and filters so you stay in control.",
    icon: Layers,
  },
  {
    title: "Real-Time Sync",
    description: "Convex-powered reactivity. Change something once, see it everywhere.",
    icon: Zap,
  },
  {
    title: "Analytics Dashboard",
    description: "Completion trends, priority breakdown, and productivity streaks.",
    icon: BarChart3,
  },
  {
    title: "Team Ready",
    description: "Architecture built for collaboration and future team workspaces.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold"
        >
          Built for focus
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]"
        >
          Everything you need to ship without the clutter.
        </motion.p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-[var(--border)] transition-shadow hover:shadow-glass">
                <CardContent className="pt-6">
                  <feature.icon className="size-10 text-[var(--color-primary)]" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
