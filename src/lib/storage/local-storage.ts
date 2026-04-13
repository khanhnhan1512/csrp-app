// localStorage-based storage for reports
// All data lives in the browser — no database required.

const STORAGE_KEY = "csrp_reports";

export interface Report {
  id: string;
  companyName: string;
  industry: string | null;
  questionnaireAnswers: Record<string, string> | null;
  categoryScores: Record<string, number> | null;
  compositeScore: number | null;
  suggestedCsrpLow: number | null;
  suggestedCsrpHigh: number | null;
  overrideCsrpLow: number | null;
  overrideCsrpHigh: number | null;
  generatedContent: string | null;
  editedContent: string | null;
  analystNotes: string | null;
  status: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function load(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Report[]) : [];
  } catch {
    return [];
  }
}

function save(reports: Report[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getReports(): Report[] {
  return load().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReport(id: string): Report | null {
  return load().find((r) => r.id === id) ?? null;
}

export function createReport(data: {
  companyName: string;
  industry?: string;
  questionnaireAnswers: Record<string, string>;
  categoryScores: Record<string, number>;
  compositeScore: number;
  suggestedCsrpLow: number;
  suggestedCsrpHigh: number;
  analystNotes?: string;
}): Report {
  const reports = load();
  const report: Report = {
    id: generateId(),
    companyName: data.companyName,
    industry: data.industry ?? null,
    questionnaireAnswers: data.questionnaireAnswers,
    categoryScores: data.categoryScores,
    compositeScore: data.compositeScore,
    suggestedCsrpLow: data.suggestedCsrpLow,
    suggestedCsrpHigh: data.suggestedCsrpHigh,
    overrideCsrpLow: null,
    overrideCsrpHigh: null,
    generatedContent: null,
    editedContent: null,
    analystNotes: data.analystNotes ?? null,
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  };
  save([...reports, report]);
  return report;
}

export function updateReport(
  id: string,
  data: Partial<Omit<Report, "id" | "createdAt">>
): Report | null {
  const reports = load();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated: Report = { ...reports[idx], ...data, updatedAt: now() };
  reports[idx] = updated;
  save(reports);
  return updated;
}

export function deleteReport(id: string): void {
  save(load().filter((r) => r.id !== id));
}

export function finalizeReport(id: string): Report | null {
  const report = getReport(id);
  if (!report || !["generated", "edited"].includes(report.status)) {
    throw new Error("Report cannot be finalized in current state");
  }
  return updateReport(id, { status: "finalized" });
}

export function reopenReport(id: string): Report | null {
  return updateReport(id, { status: "edited" });
}
