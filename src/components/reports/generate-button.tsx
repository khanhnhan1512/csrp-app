"use client";

import { useState } from "react";
import { updateReport } from "@/lib/actions/report-actions";
import type { Report } from "@/lib/storage/local-storage";
import { Button } from "@/components/ui/button";
import { SparklesIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  report: Report;
  onStreamStart?: () => void;
  onStreamChunk?: (text: string) => void;
  onStreamEnd?: (text: string) => void;
}

export function GenerateButton({ report, onStreamStart, onStreamChunk, onStreamEnd }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const isRegenerate = ["generated", "edited"].includes(report.status);
  const canGenerate = ["draft", "generated", "edited"].includes(report.status);

  if (!canGenerate) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    onStreamStart?.();

    // Mark as generating in localStorage
    updateReport(report.id, { status: "generating" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Generation failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onStreamChunk?.(fullText);
      }

      // Save generated content to localStorage
      updateReport(report.id, { generatedContent: fullText, status: "generated" });
      toast.success("Report generated successfully");
      onStreamEnd?.(fullText);
    } catch (error) {
      // Revert status
      updateReport(report.id, { status: report.status === "generating" ? "draft" : report.status });
      toast.error(error instanceof Error ? error.message : "Generation failed. Please try again.");
      onStreamEnd?.("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isGenerating}
      variant={isRegenerate ? "outline" : "default"}
    >
      {isRegenerate ? (
        <>
          <RefreshCwIcon className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Regenerating..." : "Regenerate"}
        </>
      ) : (
        <>
          <SparklesIcon className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </>
      )}
    </Button>
  );
}
