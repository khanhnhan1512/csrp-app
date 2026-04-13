"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load report</h2>
        <p className="text-gray-500 mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link
            href="/reports"
            className="inline-flex items-center h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
