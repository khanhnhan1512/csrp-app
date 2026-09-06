import { describe, it, expect } from "vitest";
import { enforceFixedPhrases, getFixedPhrases } from "@/lib/ai/fixed-phrases";
import { buildUserPrompt } from "@/lib/ai/prompt";
import type { Report } from "@/lib/types/report";

const DIVERSIFIED = "Diversified customer base with no single customer contributing more than 20% of revenue.";
const LOW_SENSITIVITY = "The Company's economic sensitivity is low, providing stability in downturns.";

function makeReport(answers: Record<string, string>): Report {
  return {
    id: "r1",
    companyName: "Test Co",
    industry: "Manufacturing",
    questionnaireAnswers: answers,
    categoryScores: null,
    compositeScore: null,
    suggestedCsrpLow: 10,
    suggestedCsrpHigh: 12,
    overrideCsrpLow: null,
    overrideCsrpHigh: null,
    generatedContent: null,
    editedContent: null,
    analystNotes: null,
    status: "draft",
    createdAt: "2026-09-06T00:00:00.000Z",
    updatedAt: "2026-09-06T00:00:00.000Z",
  };
}

const INTRO =
  "A company-specific risk premium in the range of 10.00% to 12.00% is appropriate based on our consideration of the Company's risk profile.";

describe("getFixedPhrases", () => {
  it("returns the mandated sentence for the diversified customer concentration option", () => {
    const phrases = getFixedPhrases(makeReport({ customer_concentration: "diversified" }));
    expect(phrases.map((p) => p.text)).toEqual([DIVERSIFIED]);
  });

  it("returns the mandated sentence for the low economic sensitivity option", () => {
    const phrases = getFixedPhrases(makeReport({ economic_sensitivity: "low" }));
    expect(phrases.map((p) => p.text)).toEqual([LOW_SENSITIVITY]);
  });

  it("returns nothing for other options of the same questions", () => {
    const phrases = getFixedPhrases(
      makeReport({ customer_concentration: "high", economic_sensitivity: "high" })
    );
    expect(phrases).toEqual([]);
  });

  it("returns nothing when the questions are answered N/A", () => {
    const phrases = getFixedPhrases(
      makeReport({ customer_concentration: "na", economic_sensitivity: "na" })
    );
    expect(phrases).toEqual([]);
  });
});

describe("enforceFixedPhrases", () => {
  it("rewrites a reworded customer concentration bullet", () => {
    const report = makeReport({ customer_concentration: "diversified" });
    const generated = `${INTRO}

a) The Company enjoys a broad customer base with no meaningful concentration.

b) The Company is impacted by seasonality.`;

    expect(enforceFixedPhrases(generated, report)).toBe(`${INTRO}

a) ${DIVERSIFIED}

b) The Company is impacted by seasonality.`);
  });

  it("rewrites a reworded economic sensitivity bullet", () => {
    const report = makeReport({ economic_sensitivity: "low" });
    const generated = `${INTRO}

a) The Company has a long history of operations.

b) The Company is relatively insulated from economic downturns given its essential offering.`;

    expect(enforceFixedPhrases(generated, report)).toBe(`${INTRO}

a) The Company has a long history of operations.

b) ${LOW_SENSITIVITY}`);
  });

  it("enforces both mandated sentences at once without cross-matching", () => {
    const report = makeReport({
      customer_concentration: "diversified",
      economic_sensitivity: "low",
    });
    const generated = `${INTRO}

a) No customer accounts for a large share of revenue.

b) Demand is defensive and holds up in a recession.`;

    const result = enforceFixedPhrases(generated, report);
    expect(result).toContain(`a) ${DIVERSIFIED}`);
    expect(result).toContain(`b) ${LOW_SENSITIVITY}`);
  });

  it("leaves an already-correct bullet untouched", () => {
    const report = makeReport({ customer_concentration: "diversified" });
    const generated = `${INTRO}

a) ${DIVERSIFIED}

b) The Company is impacted by seasonality.`;

    expect(enforceFixedPhrases(generated, report)).toBe(generated);
  });

  it("matches an already-correct bullet written with a curly apostrophe", () => {
    const report = makeReport({ economic_sensitivity: "low" });
    const curly = LOW_SENSITIVITY.replace("Company's", "Company’s");
    const generated = `${INTRO}\n\na) ${curly}`;

    expect(enforceFixedPhrases(generated, report)).toBe(`${INTRO}\n\na) ${curly}`);
  });

  it("appends the sentence when the model skipped the bullet entirely", () => {
    const report = makeReport({ customer_concentration: "diversified" });
    const generated = `${INTRO}

a) The Company has a long history of operations.`;

    expect(enforceFixedPhrases(generated, report)).toBe(`${INTRO}

a) The Company has a long history of operations.

b) ${DIVERSIFIED}`);
  });

  it("does not touch bullets when no mandated option was selected", () => {
    const report = makeReport({ customer_concentration: "high" });
    const generated = `${INTRO}\n\na) The Company has a concentrated customer base.`;
    expect(enforceFixedPhrases(generated, report)).toBe(generated);
  });

  it("relabels bullets sequentially when the model mislabels them", () => {
    const report = makeReport({ customer_concentration: "diversified" });
    const generated = `${INTRO}

a) The Company has a long history of operations.

c) Its customer base is broad.`;

    expect(enforceFixedPhrases(generated, report)).toBe(`${INTRO}

a) The Company has a long history of operations.

b) ${DIVERSIFIED}`);
  });

  it("returns empty output unchanged", () => {
    expect(enforceFixedPhrases("", makeReport({ customer_concentration: "diversified" }))).toBe("");
  });
});

describe("buildUserPrompt", () => {
  it("states the mandated wording inline and in a trailing verbatim block", () => {
    const prompt = buildUserPrompt(
      makeReport({ customer_concentration: "diversified", economic_sensitivity: "low" })
    );

    expect(prompt).toContain(`MANDATORY WORDING — use this sentence verbatim: "${DIVERSIFIED}"`);
    expect(prompt).toContain(`MANDATORY WORDING — use this sentence verbatim: "${LOW_SENSITIVITY}"`);
    expect(prompt).toContain("must appear verbatim, exactly as written");
    expect(prompt).toContain(`  - ${DIVERSIFIED}`);
    expect(prompt).toContain(`  - ${LOW_SENSITIVITY}`);
  });

  it("omits the verbatim block when no mandated option was selected", () => {
    const prompt = buildUserPrompt(makeReport({ customer_concentration: "high" }));
    expect(prompt).not.toContain("MANDATORY WORDING");
    expect(prompt).not.toContain("must appear verbatim");
  });
});
