// Re-exports from localStorage service
// No database, no server actions — all data lives in the browser.
export {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  finalizeReport,
  reopenReport,
} from "@/lib/storage/local-storage";
