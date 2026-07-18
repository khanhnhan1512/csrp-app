"use server";

// Server Actions backed by Supabase (schema "csrp", table "reports").
// All access goes through the server with the secret key — the browser
// never talks to Supabase directly.

import { getSupabase } from "@/lib/db/supabase";
import type { Report } from "@/lib/types/report";

interface ReportRow {
  id: string;
  company_name: string;
  industry: string | null;
  questionnaire_answers: Record<string, string> | null;
  category_scores: Record<string, number> | null;
  composite_score: number | null;
  suggested_csrp_low: number | null;
  suggested_csrp_high: number | null;
  override_csrp_low: number | null;
  override_csrp_high: number | null;
  generated_content: string | null;
  edited_content: string | null;
  analyst_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToReport(row: ReportRow): Report {
  return {
    id: row.id,
    companyName: row.company_name,
    industry: row.industry,
    questionnaireAnswers: row.questionnaire_answers,
    categoryScores: row.category_scores,
    compositeScore: row.composite_score,
    suggestedCsrpLow: row.suggested_csrp_low,
    suggestedCsrpHigh: row.suggested_csrp_high,
    overrideCsrpLow: row.override_csrp_low,
    overrideCsrpHigh: row.override_csrp_high,
    generatedContent: row.generated_content,
    editedContent: row.edited_content,
    analystNotes: row.analyst_notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// camelCase Report field → snake_case column
const FIELD_TO_COLUMN: Record<string, string> = {
  companyName: "company_name",
  industry: "industry",
  questionnaireAnswers: "questionnaire_answers",
  categoryScores: "category_scores",
  compositeScore: "composite_score",
  suggestedCsrpLow: "suggested_csrp_low",
  suggestedCsrpHigh: "suggested_csrp_high",
  overrideCsrpLow: "override_csrp_low",
  overrideCsrpHigh: "override_csrp_high",
  generatedContent: "generated_content",
  editedContent: "edited_content",
  analystNotes: "analyst_notes",
  status: "status",
};

export async function getReports(): Promise<Report[]> {
  const { data, error } = await getSupabase()
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load reports: ${error.message}`);
  return (data as ReportRow[]).map(rowToReport);
}

export async function getReport(id: string): Promise<Report | null> {
  const { data, error } = await getSupabase()
    .from("reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load report: ${error.message}`);
  return data ? rowToReport(data as ReportRow) : null;
}

export async function createReport(input: {
  companyName: string;
  industry?: string;
  questionnaireAnswers: Record<string, string>;
  categoryScores: Record<string, number>;
  compositeScore: number;
  suggestedCsrpLow: number;
  suggestedCsrpHigh: number;
  analystNotes?: string;
}): Promise<Report> {
  const { data, error } = await getSupabase()
    .from("reports")
    .insert({
      company_name: input.companyName,
      industry: input.industry ?? null,
      questionnaire_answers: input.questionnaireAnswers,
      category_scores: input.categoryScores,
      composite_score: input.compositeScore,
      suggested_csrp_low: input.suggestedCsrpLow,
      suggested_csrp_high: input.suggestedCsrpHigh,
      analyst_notes: input.analystNotes ?? null,
      status: "draft",
    })
    .select()
    .single();
  if (error) throw new Error(`Failed to create report: ${error.message}`);
  return rowToReport(data as ReportRow);
}

export async function updateReport(
  id: string,
  data: Partial<Omit<Report, "id" | "createdAt" | "updatedAt">>
): Promise<Report | null> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [field, column] of Object.entries(FIELD_TO_COLUMN)) {
    const value = (data as Record<string, unknown>)[field];
    if (value !== undefined) patch[column] = value;
  }
  const { data: row, error } = await getSupabase()
    .from("reports")
    .update(patch)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(`Failed to update report: ${error.message}`);
  return row ? rowToReport(row as ReportRow) : null;
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await getSupabase().from("reports").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete report: ${error.message}`);
}

export async function finalizeReport(id: string): Promise<Report | null> {
  const report = await getReport(id);
  if (!report || !["generated", "edited"].includes(report.status)) {
    throw new Error("Report cannot be finalized in current state");
  }
  return updateReport(id, { status: "finalized" });
}

export async function reopenReport(id: string): Promise<Report | null> {
  return updateReport(id, { status: "edited" });
}
