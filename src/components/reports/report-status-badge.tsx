import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  draft: { label: "Draft", variant: "secondary" as const },
  generating: { label: "Generating...", variant: "secondary" as const },
  generated: { label: "Generated", variant: "default" as const },
  edited: { label: "Edited", variant: "default" as const },
  finalized: { label: "Finalized", variant: "default" as const },
};

interface Props {
  status: string;
}

export function ReportStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? {
    label: status,
    variant: "secondary" as const,
  };

  return (
    <Badge
      variant={config.variant}
      className={
        status === "finalized"
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : status === "draft"
          ? "bg-gray-100 text-gray-600 hover:bg-gray-100"
          : status === "generating"
          ? "bg-blue-100 text-blue-700 hover:bg-blue-100 animate-pulse"
          : "bg-blue-50 text-blue-700 hover:bg-blue-50"
      }
    >
      {config.label}
    </Badge>
  );
}
