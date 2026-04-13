"use client";

import { useRouter } from "next/navigation";
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
import { deleteReport } from "@/lib/actions/report-actions";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  reportId: string;
  companyName: string;
  redirectAfter?: boolean;
  onDeleted?: () => void;
}

export function DeleteDialog({ open, onClose, reportId, companyName, redirectAfter, onDeleted }: Props) {
  const router = useRouter();

  const handleDelete = () => {
    deleteReport(reportId);
    toast.success("Report deleted");
    onClose();
    if (redirectAfter) {
      router.push("/reports");
    } else {
      onDeleted?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Report</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the report for <strong>{companyName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
