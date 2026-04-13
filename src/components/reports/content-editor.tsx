"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { updateReport } from "@/lib/actions/report-actions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  reportId: string;
  initialContent: string;
  disabled?: boolean;
  onContentChange?: (content: string) => void;
}

export function ContentEditor({ reportId, initialContent, disabled, onContentChange }: Props) {
  const [content, setContent] = useState(initialContent);
  const [debouncedContent] = useDebounce(content, 1000);
  const [lastSaved, setLastSaved] = useState(initialContent);

  useEffect(() => {
    if (debouncedContent !== lastSaved && !disabled) {
      try {
        updateReport(reportId, { editedContent: debouncedContent, status: "edited" });
        setLastSaved(debouncedContent);
      } catch {
        toast.error("Failed to save changes");
      }
    }
  }, [debouncedContent, lastSaved, reportId, disabled]);

  // Warn on navigation with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (content !== lastSaved) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [content, lastSaved]);

  const handleChange = (val: string) => {
    setContent(val);
    onContentChange?.(val);
  };

  return (
    <div className="relative">
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="min-h-[400px] font-serif text-sm leading-relaxed resize-y"
        placeholder="Generated report content will appear here..."
      />
      {!disabled && content !== lastSaved && (
        <p className="text-xs text-gray-400 mt-1">Saving...</p>
      )}
      {!disabled && content === lastSaved && content !== initialContent && (
        <p className="text-xs text-green-500 mt-1">Saved</p>
      )}
    </div>
  );
}
