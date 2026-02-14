"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with core features",
    features: ["Up to 50 tasks", "Basic analytics", "Email support"],
    cta: "Current plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    description: "For power users and small teams",
    features: [
      "Unlimited tasks",
      "Advanced analytics",
      "Priority support",
      "Export data",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$24",
    description: "Collaboration and admin tools",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Admin dashboard",
      "SSO (coming soon)",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function UpgradePage() {
  const user = useQuery(api.users.getCurrentUser);
  const isPro = user?.subscriptionStatus === "pro" || user?.subscriptionStatus === "team";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upgrade</h1>
        <p className="text-[var(--muted)]">Choose the plan that fits you</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? "border-2 border-[var(--color-primary)] shadow-lg"
                : ""
            }
          >
            <CardHeader className="pb-2">
              {plan.highlighted && (
                <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--color-primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                  <Sparkles className="size-3" />
                  Popular
                </span>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-2xl font-bold">{plan.price}</p>
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
                disabled={
                  plan.name === "Free" &&
                  (user?.subscriptionStatus === "free" || !user)
                }
              >
                {plan.name === "Free" && user?.subscriptionStatus === "free"
                  ? "Current plan"
                  : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {isPro && (
        <Card className="border-avocado/30 bg-avocado/5">
          <CardHeader>
            <CardTitle className="text-avocado">Pro feature</CardTitle>
            <p className="text-sm text-[var(--muted)]">
              You have access to advanced analytics and exports. Thank you for
              being a Pro subscriber.
            </p>
          </CardHeader>
        </Card>
      )}

      {!isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Pro feature</CardTitle>
            <CardDescription>
              Upgrade to Pro to unlock advanced analytics, unlimited tasks,
              and priority support.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
