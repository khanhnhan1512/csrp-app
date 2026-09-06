"use client";

import { useState } from "react";
import { updateReport } from "@/lib/actions/report-actions";
import type { Report } from "@/lib/types/report";
import { enforceFixedPhrases } from "@/lib/ai/fixed-phrases";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SparklesIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  report: Report;
  onStreamStart?: () => void;
  onStreamChunk?: (text: string) => void;
  onStreamEnd?: (text: string, success: boolean) => void;
}

export function GenerateButton({ report, onStreamStart, onStreamChunk, onStreamEnd }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isRegenerate = ["generated", "edited"].includes(report.status);
  const canGenerate = ["draft", "generated", "edited"].includes(report.status);

  if (!canGenerate) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    onStreamStart?.();

    try {
      await updateReport(report.id, { status: "generating" });

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
      let streamedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedText += chunk;
        onStreamChunk?.(streamedText);
      }

      // Answers with mandated wording must read identically in every report,
      // so correct the model's phrasing before it is shown or stored.
      const fullText = enforceFixedPhrases(streamedText, report);
      if (fullText !== streamedText) onStreamChunk?.(fullText);

      // Save generated content; clear manual edits so the new content is
      // what the report displays (editedContent takes display precedence).
      try {
        await updateReport(report.id, {
          generatedContent: fullText,
          editedContent: null,
          status: "generated",
        });
      } catch {
        // Streamed text is already on screen — keep it visible instead of discarding.
        toast.error("Report generated but saving failed. Copy the text before leaving this page.");
        onStreamEnd?.(fullText, true);
        return;
      }
      toast.success("Report generated successfully");
      onStreamEnd?.(fullText, true);
    } catch (error) {
      // Revert to the pre-generation status
      await updateReport(report.id, { status: report.status }).catch(() => {});
      toast.error(error instanceof Error ? error.message : "Generation failed. Please try again.");
      onStreamEnd?.("", false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClick = () => {
    // Regenerating discards manual edits — confirm before overwriting them.
    if (isRegenerate && report.editedContent) {
      setShowConfirm(true);
    } else {
      handleGenerate();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
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

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Report</AlertDialogTitle>
            <AlertDialogDescription>
              Regenerating will replace the current content, including your manual edits. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false);
                handleGenerate();
              }}
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
