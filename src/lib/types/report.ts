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
