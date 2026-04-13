import type { Report } from "@/lib/storage/local-storage";
import { CATEGORIES } from "@/lib/questionnaire/data";
import { selectExamples } from "./examples";

export const SYSTEM_PROMPT = `You are a senior business valuator writing the Company-Specific Risk Premium (CSRP) section of a formal valuation report. You write in a professional, objective, third-person tone consistent with business valuation standards.

Your output should follow this structure:
1. An opening sentence establishing the CSRP range assessment
2. A statement about considering principal strengths, weaknesses, opportunities and threats
3. A bulleted list (using roman numerals i, ii, iii...) of the key risk factors — both positive (strengths) and negative (risks)

Guidelines:
- Ground every assertion in the questionnaire responses provided
- Begin with positive factors, then list risk/weakness factors
- Be concise and professional — each bullet point should be one clear sentence
- Do NOT invent facts not provided in the input data
- Do NOT use first-person language
- Reference the analyst-confirmed CSRP range in the opening
- Typical length: 150-300 words
- Output plain text with roman numerals for bullet points (not markdown)`;

export function buildUserPrompt(report: Report): string {
  const answers = (report.questionnaireAnswers as Record<string, string>) || {};
  const csrpLow = report.overrideCsrpLow ?? report.suggestedCsrpLow ?? 9;
  const csrpHigh = report.overrideCsrpHigh ?? report.suggestedCsrpHigh ?? 12;

  const lines: string[] = [
    `Company: ${report.companyName}`,
    report.industry ? `Industry: ${report.industry}` : "",
    `CSRP Range: ${csrpLow}% to ${csrpHigh}%`,
    "",
    "Questionnaire Responses:",
  ].filter(Boolean);

  for (const category of CATEGORIES) {
    const categoryAnswers: string[] = [];
    for (const question of category.questions) {
      const selectedValue = answers[question.id];
      if (!selectedValue) continue;
      const option = question.options.find((o) => o.value === selectedValue);
      if (!option || option.score === null) continue; // skip N/A
      categoryAnswers.push(`  - ${question.label}: ${option.label}`);
    }
    if (categoryAnswers.length > 0) {
      lines.push(`\n${category.label}:`);
      lines.push(...categoryAnswers);
    }
  }

  if (report.analystNotes) {
    lines.push(`\nAdditional Analyst Notes: ${report.analystNotes}`);
  }

  return lines.join("\n");
}

export function buildMessages(report: Report) {
  const csrpLow = report.overrideCsrpLow ?? report.suggestedCsrpLow ?? 9;
  const csrpHigh = report.overrideCsrpHigh ?? report.suggestedCsrpHigh ?? 12;
  const examples = selectExamples(csrpLow, csrpHigh);

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const example of examples) {
    messages.push({
      role: "user",
      content: `Write the CSRP section for a ${example.companyType} with a CSRP range of ${example.csrpRange[0]}% to ${example.csrpRange[1]}%.`,
    });
    messages.push({
      role: "assistant",
      content: example.reportText,
    });
  }

  messages.push({
    role: "user",
    content: buildUserPrompt(report),
  });

  return messages;
}
