"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Get started",
    features: ["Up to 50 tasks", "Basic analytics", "Email support"],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 12,
    yearly: 10,
    description: "For power users",
    features: [
      "Unlimited tasks",
      "Advanced analytics",
      "Priority support",
      "Export data",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    monthly: 24,
    yearly: 20,
    description: "For teams",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Admin dashboard",
      "SSO (coming soon)",
    ],
    cta: "Contact sales",
    href: "/signup",
    highlighted: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-20 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold"
        >
          Simple pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]"
        >
          Start free. Upgrade when you need more.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center gap-2"
        >
          <span className={!yearly ? "font-medium" : "text-[var(--muted)]"}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly(!yearly)}
            className="relative h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700"
          >
            <span
              className={`absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform ${
                yearly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={yearly ? "font-medium" : "text-[var(--muted)]"}>
            Yearly
          </span>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`h-full ${
                  plan.highlighted
                    ? "border-2 border-[var(--color-primary)] shadow-lg"
                    : "border-[var(--border)]"
                }`}
              >
                <CardHeader className="pb-2">
                  {plan.highlighted && (
                    <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--color-primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                      <Sparkles className="size-3" />
                      Popular
                    </span>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-2xl font-bold">
                    ${yearly ? plan.yearly : plan.monthly}
                    <span className="text-sm font-normal text-[var(--muted)]">
                      /mo
                    </span>
                  </p>
                  <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-avocado" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
