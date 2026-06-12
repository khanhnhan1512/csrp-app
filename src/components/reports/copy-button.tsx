"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reportContentToHtml } from "@/lib/format/report-html";

interface Props {
  content: string;
}

export function CopyButton({ content }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Copy as rich text so pasting into Word keeps the report formatting
      // (Arial 11pt, #262626, justified, indented bullets).
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([reportContentToHtml(content)], {
            type: "text/html",
          }),
          "text/plain": new Blob([content], { type: "text/plain" }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(content);
    }
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
}
