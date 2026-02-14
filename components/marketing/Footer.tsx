import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-medium text-[var(--color-accent)]">
            TaskBloom
          </span>
          <div className="flex gap-6 text-sm text-[var(--muted)]">
            <a href="/#features" className="hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="/#pricing" className="hover:text-[var(--foreground)]">
              Pricing
            </a>
            <Link href="/login" className="hover:text-[var(--foreground)]">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-[var(--foreground)]">
              Sign up
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Where productivity blossoms.
        </p>
      </div>
    </footer>
  );
}
