"use client";

import Link from "next/link";
import { useWizardStore } from "@/lib/stores/wizard-store";
import { CATEGORIES } from "@/lib/questionnaire/data";
import { CompanyInfoStep } from "./company-info-step";
import { CategoryStep } from "./category-step";
import { ResultsStep } from "./results-step";
import { Progress } from "@/components/ui/progress";
import { ChevronLeftIcon } from "lucide-react";

// Steps: 0=company info, 1-6=categories, 7=results
const TOTAL_STEPS = CATEGORIES.length + 2; // +2 = company info + results

const STEP_LABELS = [
  "Company Info",
  ...CATEGORIES.map((c) => c.label),
  "Results",
];

export function WizardShell() {
  const { currentStep, prevStep, nextStep, companyName } = useWizardStore();

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/reports"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-semibold">
              {currentStep === 0 ? "New Report" : companyName || "New Report"}
            </h1>
            <p className="text-xs text-gray-500">
              Step {currentStep + 1} of {TOTAL_STEPS}: {STEP_LABELS[currentStep]}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2 hidden md:block">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STEP_LABELS.map((label, idx) => (
            <div key={idx} className="flex items-center gap-1 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground"
                    : idx === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              {idx < STEP_LABELS.length - 1 && (
                <div
                  className={`h-0.5 w-4 ${idx < currentStep ? "bg-primary" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {currentStep === 0 && <CompanyInfoStep onNext={nextStep} />}
        {currentStep >= 1 && currentStep <= CATEGORIES.length && (
          <CategoryStep
            category={CATEGORIES[currentStep - 1]}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === CATEGORIES.length + 1 && (
          <ResultsStep onBack={prevStep} />
        )}
      </main>
    </div>
  );
}
