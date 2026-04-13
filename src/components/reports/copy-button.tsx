"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  content: string;
}

export function CopyButton({ content }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
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
