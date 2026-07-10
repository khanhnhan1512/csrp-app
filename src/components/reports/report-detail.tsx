"use client";

import { useState } from "react";
import Link from "next/link";
import type { Report } from "@/lib/storage/local-storage";
import { finalizeReport, getReport, reopenReport } from "@/lib/actions/report-actions";
import { CATEGORIES } from "@/lib/questionnaire/data";
import { ReportStatusBadge } from "./report-status-badge";
import { DeleteDialog } from "./delete-dialog";
import { GenerateButton } from "./generate-button";
import { ContentEditor } from "./content-editor";
import { CsrpOverride } from "./csrp-override";
import { CopyButton } from "./copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeftIcon,
  Trash2Icon,
  LockIcon,
  UnlockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  report: Report;
  onReportChange: (report: Report) => void;
}

export function ReportDetail({ report, onReportChange }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);

  const isFinalized = report.status === "finalized";
  const effectiveContent = report.editedContent ?? report.generatedContent;
  const displayContent = streamingContent ?? effectiveContent;

  const handleFinalize = () => {
    try {
      const updated = finalizeReport(report.id);
      if (updated) onReportChange(updated);
      toast.success("Report finalized");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to finalize");
    }
  };

  const handleReopen = () => {
    const updated = reopenReport(report.id);
    if (updated) onReportChange(updated);
    toast.success("Report reopened for editing");
  };

  const answers = (report.questionnaireAnswers as Record<string, string>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/reports"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {report.companyName}
                </h1>
                <ReportStatusBadge status={report.status} />
              </div>
              {report.industry && (
                <p className="text-sm text-gray-500 truncate">{report.industry}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500"
                onClick={() => setShowDelete(true)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* CSRP Range & Actions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base">CSRP Range</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {!isFinalized && (
                  <GenerateButton
                    report={report}
                    onStreamStart={() => setStreamingContent("")}
                    onStreamChunk={(text) => setStreamingContent(text)}
                    onStreamEnd={(text, success) => {
                      setStreamingContent(null);
                      if (success) {
                        onReportChange({
                          ...report,
                          generatedContent: text,
                          editedContent: null,
                          status: "generated",
                        });
                      } else {
                        // Generation failed — restore whatever is in storage
                        // (status was reverted there) instead of showing empty content.
                        const stored = getReport(report.id);
                        if (stored) onReportChange(stored);
                      }
                    }}
                  />
                )}
                {["generated", "edited"].includes(report.status) && (
                  <Button onClick={handleFinalize} size="sm">
                    <LockIcon className="w-4 h-4 mr-2" />
                    Finalize
                  </Button>
                )}
                {isFinalized && (
                  <Button
                    variant="outline"
                    onClick={handleReopen}
                    size="sm"
                  >
                    <UnlockIcon className="w-4 h-4 mr-2" />
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CsrpOverride
              reportId={report.id}
              suggestedLow={report.suggestedCsrpLow}
              suggestedHigh={report.suggestedCsrpHigh}
              overrideLow={report.overrideCsrpLow}
              overrideHigh={report.overrideCsrpHigh}
              disabled={isFinalized}
              onOverrideChange={(low, high) =>
                onReportChange({ ...report, overrideCsrpLow: low, overrideCsrpHigh: high })
              }
            />
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {isFinalized ? "Finalized Report" : "Report Content"}
              </CardTitle>
              {displayContent && <CopyButton content={displayContent} />}
            </div>
            {isFinalized && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1 w-fit">
                <LockIcon className="w-3 h-3" />
                This report is finalized and locked for editing
              </div>
            )}
          </CardHeader>
          <CardContent>
            {streamingContent !== null && !displayContent ? (
              <div className="text-center py-8 text-gray-400">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Generating report...</p>
              </div>
            ) : streamingContent !== null && streamingContent.length > 0 ? (
              <div className="font-[Arial,sans-serif] text-sm leading-relaxed whitespace-pre-wrap text-justify text-[#262626] min-h-[200px]">
                {streamingContent}
                <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
              </div>
            ) : displayContent ? (
              isFinalized ? (
                <div className="font-[Arial,sans-serif] text-sm leading-relaxed whitespace-pre-wrap text-justify text-[#262626]">
                  {displayContent}
                </div>
              ) : (
                <ContentEditor
                  key={report.generatedContent ?? "empty"}
                  reportId={report.id}
                  initialContent={effectiveContent ?? ""}
                  disabled={isFinalized}
                  onContentChange={(content) =>
                    onReportChange({ ...report, editedContent: content, status: "edited" })
                  }
                />
              )
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">
                  Click &ldquo;Generate Report&rdquo; to create the CSRP section.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questionnaire Answers */}
        <Card>
          <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowAnswers(!showAnswers)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Questionnaire Responses</CardTitle>
              {showAnswers ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {showAnswers && (
            <CardContent className="pt-0 space-y-5">
              {CATEGORIES.map((category, idx) => {
                const categoryAnswers = category.questions.map((q) => {
                  const val = answers[q.id];
                  const option = q.options.find((o) => o.value === val);
                  return { question: q.label, answer: option?.label ?? "—", score: option?.score };
                });

                return (
                  <div key={category.id}>
                    {idx > 0 && <Separator className="mb-5" />}
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">{category.label}</h4>
                    <div className="space-y-2">
                      {categoryAnswers.map(({ question, answer, score }) => (
                        <div
                          key={question}
                          className="flex items-start justify-between gap-2 text-sm"
                        >
                          <span className="text-gray-600">{question}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-gray-900 text-right">{answer}</span>
                            {score !== null && score !== undefined && (
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  score === 0
                                    ? "bg-green-100 text-green-700"
                                    : score === 1
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {score === 0 ? "L" : score === 1 ? "M" : "H"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          )}
        </Card>

        {/* Analyst notes */}
        {report.analystNotes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Analyst Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.analystNotes}</p>
            </CardContent>
          </Card>
        )}
      </main>

      <DeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        reportId={report.id}
        companyName={report.companyName}
        redirectAfter
      />
    </div>
  );
}
