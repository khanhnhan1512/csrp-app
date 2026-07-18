"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/lib/stores/wizard-store";
import { computeScores } from "@/lib/questionnaire/scoring";
import { CATEGORIES } from "@/lib/questionnaire/data";
import { createReport } from "@/lib/actions/report-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

const RISK_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "Low Risk", color: "text-green-600" },
  1: { label: "Moderate Risk", color: "text-yellow-600" },
  2: { label: "High Risk", color: "text-red-600" },
};

function getRiskLabel(score: number) {
  if (score < 0.5) return RISK_LABELS[0];
  if (score < 1.5) return RISK_LABELS[1];
  return RISK_LABELS[2];
}

export function ResultsStep({ onBack }: Props) {
  const { companyName, industry, analystNotes, answers, reset } = useWizardStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { categoryScores, compositeScore, csrpLow, csrpHigh } = computeScores(answers);

  function handleCreate() {
    startTransition(async () => {
      try {
        const report = await createReport({
          companyName,
          industry: industry || undefined,
          questionnaireAnswers: answers,
          categoryScores,
          compositeScore,
          suggestedCsrpLow: csrpLow,
          suggestedCsrpHigh: csrpHigh,
          analystNotes: analystNotes || undefined,
        });
        toast.success("Report created successfully");
        reset();
        router.push(`/reports/${report.id}`);
      } catch {
        toast.error("Failed to create report");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* CSRP Summary Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-900">Risk Assessment Summary</CardTitle>
          <CardDescription className="text-blue-700">
            Based on your questionnaire responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-blue-600 mb-1">Suggested CSRP Range</p>
            <p className="text-4xl font-bold text-blue-900">
              {csrpLow}% – {csrpHigh}%
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Composite score: {compositeScore.toFixed(2)} / 2.00
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {CATEGORIES.map((category, idx) => {
            const score = categoryScores[category.id];
            const riskInfo = score !== undefined ? getRiskLabel(score) : null;

            return (
              <div key={category.id}>
                {idx > 0 && <Separator className="mb-3" />}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                  {riskInfo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{score?.toFixed(2)}</span>
                      <span className={`text-xs font-medium ${riskInfo.color}`}>
                        {riskInfo.label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </div>
                {score !== undefined && (
                  <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        score < 0.5
                          ? "bg-green-500"
                          : score < 1.5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(score / 2) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Company info summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-900">Company:</span> {companyName}
            </p>
            {industry && (
              <p>
                <span className="font-medium text-gray-900">Industry:</span> {industry}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button onClick={handleCreate} disabled={isPending}>
          <SparklesIcon className="w-4 h-4 mr-2" />
          {isPending ? "Creating..." : "Create Report"}
        </Button>
      </div>
    </div>
  );
}
