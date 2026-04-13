"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getReport } from "@/lib/actions/report-actions";
import type { Report } from "@/lib/storage/local-storage";
import { ReportDetail } from "@/components/reports/report-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: Props) {
  const { id } = use(params);
  const [report, setReport] = useState<Report | null | undefined>(undefined);

  useEffect(() => {
    setReport(getReport(id));
  }, [id]);

  // undefined = loading, null = not found
  if (report === undefined) return null;
  if (report === null) return notFound();

  return <ReportDetail report={report} onReportChange={(r) => setReport(r)} />;
}
