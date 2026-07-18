"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReports } from "@/lib/actions/report-actions";
import type { Report } from "@/lib/types/report";
import { ReportCard } from "@/components/reports/report-card";
import { PlusIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const refresh = () => {
    getReports()
      .then(setReports)
      .catch(() => toast.error("Failed to load reports"));
  };

  useEffect(() => {
    refresh();
  }, []);

  // Refresh list when focus returns (user may have deleted/created on another page)
  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">CSRP Report Assistant</h1>
            <p className="text-sm text-gray-500">Aspen Valuations</p>
          </div>
          <Link
            href="/reports/new"
            className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            New Report
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {reports.length === 0 ? (
          <div className="text-center py-20">
            <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">No reports yet</h2>
            <p className="text-gray-500 mb-6">Create your first CSRP report to get started.</p>
            <Link
              href="/reports/new"
              className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Create First Report
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {reports.length} Report{reports.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} onDeleted={refresh} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
