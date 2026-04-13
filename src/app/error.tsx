"use client";

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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error.message || "An unexpected error occurred"}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
