"use client";

import { useState } from "react";
import { updateReport } from "@/lib/actions/report-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  reportId: string;
  suggestedLow: number | null;
  suggestedHigh: number | null;
  overrideLow: number | null;
  overrideHigh: number | null;
  disabled?: boolean;
  onOverrideChange?: (low: number | null, high: number | null) => void;
}

export function CsrpOverride({
  reportId,
  suggestedLow,
  suggestedHigh,
  overrideLow,
  overrideHigh,
  disabled,
  onOverrideChange,
}: Props) {
  const [low, setLow] = useState<string>(overrideLow?.toString() ?? "");
  const [high, setHigh] = useState<string>(overrideHigh?.toString() ?? "");

  const handleSave = () => {
    const lowNum = parseFloat(low);
    const highNum = parseFloat(high);

    if (isNaN(lowNum) || isNaN(highNum)) {
      toast.error("Please enter valid numbers");
      return;
    }
    if (lowNum >= highNum) {
      toast.error("Low value must be less than high value");
      return;
    }
    if (lowNum < 0 || highNum > 30) {
      toast.error("Values must be between 0 and 30");
      return;
    }

    updateReport(reportId, { overrideCsrpLow: lowNum, overrideCsrpHigh: highNum });
    onOverrideChange?.(lowNum, highNum);
    toast.success("CSRP range updated");
  };

  const handleClear = () => {
    setLow("");
    setHigh("");
    updateReport(reportId, { overrideCsrpLow: null, overrideCsrpHigh: null });
    onOverrideChange?.(null, null);
    toast.success("Override cleared — using suggested range");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Suggested:</span>
        <span className="font-medium">
          {suggestedLow ?? "–"}% – {suggestedHigh ?? "–"}%
        </span>
        {overrideLow !== null && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Override:</span>
            <span className="font-medium text-blue-600">
              {overrideLow}% – {overrideHigh}%
            </span>
          </>
        )}
      </div>

      {!disabled && (
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Low %</Label>
            <Input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={low}
              onChange={(e) => setLow(e.target.value)}
              className="w-20 h-8 text-sm"
              placeholder={suggestedLow?.toString() ?? "0"}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">High %</Label>
            <Input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              className="w-20 h-8 text-sm"
              placeholder={suggestedHigh?.toString() ?? "0"}
            />
          </div>
          <Button size="sm" onClick={handleSave} disabled={!low || !high}>
            Save Override
          </Button>
          {overrideLow !== null && (
            <Button size="sm" variant="ghost" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
