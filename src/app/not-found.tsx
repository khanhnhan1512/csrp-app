import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link
          href="/reports"
          className="inline-flex items-center h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
        >
          Back to Reports
        </Link>
      </div>
    </div>
  );
}
