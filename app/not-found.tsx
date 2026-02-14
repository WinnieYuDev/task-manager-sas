import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ListTodo } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--background)] px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-[var(--color-accent)]">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-[var(--muted)]">
          The page you’re looking for doesn’t exist or was moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-4" />
            Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ListTodo className="mr-2 size-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
