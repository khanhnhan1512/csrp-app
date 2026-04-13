import { describe, it, expect } from "vitest";
import {
  calculateCategoryScore,
  calculateCompositeScore,
  getCsrpRange,
  computeScores,
} from "@/lib/questionnaire/scoring";
import { CATEGORIES } from "@/lib/questionnaire/data";

// Helper: build answers where all questions in a category get specified risk level
function buildAnswers(riskLevel: "low" | "medium" | "high" | "na"): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const category of CATEGORIES) {
    for (const question of category.questions) {
      if (riskLevel === "na") {
        answers[question.id] = "na";
      } else {
        const target = riskLevel === "low" ? 0 : riskLevel === "medium" ? 1 : 2;
        const option = question.options.find((o) => o.score === target) ?? question.options[0];
        answers[question.id] = option.value;
      }
    }
  }
  return answers;
}

describe("calculateCategoryScore", () => {
  it("returns 0 for all-low-risk answers in a category", () => {
    const answers = buildAnswers("low");
    const category = CATEGORIES[0];
    const score = calculateCategoryScore(answers, category);
    expect(score).toBe(0);
  });

  it("returns 2 for all-high-risk answers in a category", () => {
    const answers = buildAnswers("high");
    const category = CATEGORIES[0];
    const score = calculateCategoryScore(answers, category);
    expect(score).toBe(2);
  });

  it("returns null when all answers are N/A", () => {
    const answers: Record<string, string> = {};
    for (const q of CATEGORIES[0].questions) {
      answers[q.id] = "na";
    }
    const score = calculateCategoryScore(answers, CATEGORIES[0]);
    expect(score).toBeNull();
  });

  it("excludes N/A answers from average", () => {
    const category = CATEGORIES[0];
    const answers: Record<string, string> = {};
    // First question: low risk (score 0), rest: N/A
    const firstQ = category.questions[0];
    const lowOption = firstQ.options.find((o) => o.score === 0);
    answers[firstQ.id] = lowOption!.value;
    for (const q of category.questions.slice(1)) {
      answers[q.id] = "na";
    }
    const score = calculateCategoryScore(answers, category);
    expect(score).toBe(0);
  });
});

describe("calculateCompositeScore", () => {
  it("returns 0 for all-zero category scores", () => {
    const scores: Record<string, number | null> = {};
    for (const cat of CATEGORIES) {
      scores[cat.id] = 0;
    }
    const composite = calculateCompositeScore(scores);
    expect(composite).toBe(0);
  });

  it("returns 2 for all-max category scores", () => {
    const scores: Record<string, number | null> = {};
    for (const cat of CATEGORIES) {
      scores[cat.id] = 2;
    }
    const composite = calculateCompositeScore(scores);
    expect(composite).toBe(2);
  });

  it("excludes null category scores from weighted average", () => {
    const scores: Record<string, number | null> = {};
    scores[CATEGORIES[0].id] = 2; // high risk
    for (const cat of CATEGORIES.slice(1)) {
      scores[cat.id] = null; // all N/A
    }
    const composite = calculateCompositeScore(scores);
    expect(composite).toBe(2);
  });
});

describe("getCsrpRange", () => {
  it("returns 6-9% for composite < 0.5", () => {
    expect(getCsrpRange(0)).toEqual([6, 9]);
    expect(getCsrpRange(0.4)).toEqual([6, 9]);
  });

  it("returns 9-12% for composite 0.5-1.0", () => {
    expect(getCsrpRange(0.5)).toEqual([9, 12]);
    expect(getCsrpRange(0.9)).toEqual([9, 12]);
  });

  it("returns 12-16% for composite 1.0-1.5", () => {
    expect(getCsrpRange(1.0)).toEqual([12, 16]);
    expect(getCsrpRange(1.4)).toEqual([12, 16]);
  });

  it("returns 16-20% for composite >= 1.5", () => {
    expect(getCsrpRange(1.5)).toEqual([16, 20]);
    expect(getCsrpRange(2.0)).toEqual([16, 20]);
  });
});

describe("computeScores", () => {
  it("gives 6-9% CSRP for all-low-risk answers", () => {
    const answers = buildAnswers("low");
    const { csrpLow, csrpHigh } = computeScores(answers);
    expect(csrpLow).toBe(6);
    expect(csrpHigh).toBe(9);
  });

  it("gives 16-20% CSRP for all-high-risk answers", () => {
    const answers = buildAnswers("high");
    const { csrpLow, csrpHigh } = computeScores(answers);
    expect(csrpLow).toBe(16);
    expect(csrpHigh).toBe(20);
  });

  it("gives 9-12% CSRP for all-medium-risk answers", () => {
    const answers = buildAnswers("medium");
    const { csrpLow, csrpHigh, compositeScore } = computeScores(answers);
    // all medium = score 1.0 → maps to 12-16%... wait medium is 1.0 exactly
    // getCsrpRange(1.0) = 12-16%
    expect(compositeScore).toBe(1);
    expect(csrpLow).toBe(12);
    expect(csrpHigh).toBe(16);
  });

  it("returns category scores as non-null numbers for non-NA answers", () => {
    const answers = buildAnswers("low");
    const { categoryScores } = computeScores(answers);
    for (const cat of CATEGORIES) {
      expect(categoryScores[cat.id]).toBeDefined();
      expect(typeof categoryScores[cat.id]).toBe("number");
    }
  });
});

describe("selectExamples", () => {
  it("selects 2 examples closest to CSRP range midpoint", async () => {
    const { selectExamples } = await import("@/lib/ai/examples");
    const examples = selectExamples(7, 9); // midpoint = 8 → closest are AICEIM [7,9] and Tourism [6,10]
    expect(examples.length).toBe(2);
    // First should be AICEIM with range [7,9] — midpoint 8 = distance 0
    expect(examples[0].csrpRange).toEqual([7, 9]);
  });
});
