"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReport } from "@/lib/actions/report-actions";
import type { Report } from "@/lib/storage/local-storage";
import { ReportDetail } from "@/components/reports/report-detail";

export default function ReportPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [report, setReport] = useState<Report | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    const found = getReport(id);
    setReport(found ?? null);
  }, [id]);

  // undefined = still loading (SSR hydration)
  if (report === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-5 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Report not found</h2>
          <a href="/reports" className="text-primary underline text-sm">Back to reports</a>
        </div>
      </div>
    );
  }

  return <ReportDetail report={report} onReportChange={(r) => setReport(r)} />;
}
