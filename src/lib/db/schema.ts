import { pgTable, uuid, text, jsonb, real, timestamp } from "drizzle-orm/pg-core";

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  questionnaireAnswers: jsonb("questionnaire_answers").$type<Record<string, string>>(),
  categoryScores: jsonb("category_scores").$type<Record<string, number>>(),
  compositeScore: real("composite_score"),
  suggestedCsrpLow: real("suggested_csrp_low"),
  suggestedCsrpHigh: real("suggested_csrp_high"),
  overrideCsrpLow: real("override_csrp_low"),
  overrideCsrpHigh: real("override_csrp_high"),
  generatedContent: text("generated_content"),
  editedContent: text("edited_content"),
  analystNotes: text("analyst_notes"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
