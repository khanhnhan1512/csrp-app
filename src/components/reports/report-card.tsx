"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportStatusBadge } from "./report-status-badge";
import { DeleteDialog } from "./delete-dialog";
import { Trash2Icon, BuildingIcon, CalendarIcon } from "lucide-react";
import type { Report } from "@/lib/storage/local-storage";

interface Props {
  report: Report;
  onDeleted?: () => void;
}

export function ReportCard({ report, onDeleted }: Props) {
  const [showDelete, setShowDelete] = useState(false);

  const csrpLow = report.overrideCsrpLow ?? report.suggestedCsrpLow;
  const csrpHigh = report.overrideCsrpHigh ?? report.suggestedCsrpHigh;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/reports/${report.id}`} className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                {report.companyName}
              </CardTitle>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.preventDefault();
                setShowDelete(true);
              }}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
          <ReportStatusBadge status={report.status} />
        </CardHeader>
        <CardContent className="pt-0">
          <Link href={`/reports/${report.id}`}>
            <div className="space-y-2 text-sm text-gray-500">
              {report.industry && (
                <div className="flex items-center gap-1.5">
                  <BuildingIcon className="w-3.5 h-3.5" />
                  <span className="truncate">{report.industry}</span>
                </div>
              )}
              {csrpLow && csrpHigh && (
                <div className="font-medium text-gray-900">
                  CSRP: {csrpLow}% – {csrpHigh}%
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      <DeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        reportId={report.id}
        companyName={report.companyName}
        onDeleted={onDeleted}
      />
    </>
  );
}
