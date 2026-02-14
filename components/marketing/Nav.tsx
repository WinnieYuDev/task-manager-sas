"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function Nav() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-50 glass"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-[var(--color-accent)]">
          TaskBloom
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="/#features"
            className="text-sm text-[var(--foreground)] hover:text-[var(--muted)]"
          >
            Features
          </a>
          <a
            href="/#pricing"
            className="text-sm text-[var(--foreground)] hover:text-[var(--muted)]"
          >
            Pricing
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
