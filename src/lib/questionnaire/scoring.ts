import { CATEGORIES } from "./data";
import type { Category } from "./types";

export function calculateCategoryScore(
  answers: Record<string, string>,
  category: Category
): number | null {
  const scores: number[] = [];
  for (const question of category.questions) {
    const selectedValue = answers[question.id];
    if (!selectedValue) continue;
    const option = question.options.find((o) => o.value === selectedValue);
    if (option && option.score !== null) {
      scores.push(option.score);
    }
    // score===null means N/A — excluded from average
  }
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function calculateAllCategoryScores(
  answers: Record<string, string>
): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  for (const category of CATEGORIES) {
    result[category.id] = calculateCategoryScore(answers, category);
  }
  return result;
}

export function calculateCompositeScore(
  categoryScores: Record<string, number | null>
): number {
  let totalWeight = 0;
  let weighted = 0;
  for (const category of CATEGORIES) {
    const score = categoryScores[category.id];
    if (score !== null && score !== undefined) {
      weighted += score * category.weight;
      totalWeight += category.weight;
    }
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

export function getCsrpRange(composite: number): [number, number] {
  if (composite < 0.5) return [6, 9];
  if (composite < 1.0) return [9, 12];
  if (composite < 1.5) return [12, 16];
  return [16, 20];
}

export function computeScores(answers: Record<string, string>) {
  const categoryScores = calculateAllCategoryScores(answers);
  const nonNullScores: Record<string, number> = {};
  for (const [k, v] of Object.entries(categoryScores)) {
    if (v !== null) nonNullScores[k] = v;
  }
  const composite = calculateCompositeScore(categoryScores);
  const [low, high] = getCsrpRange(composite);
  return { categoryScores: nonNullScores, compositeScore: composite, csrpLow: low, csrpHigh: high };
}
