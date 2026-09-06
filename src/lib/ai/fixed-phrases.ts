import type { Report } from "@/lib/types/report";
import { CATEGORIES } from "@/lib/questionnaire/data";

export interface FixedPhrase {
  questionId: string;
  questionLabel: string;
  optionLabel: string;
  text: string;
}

/**
 * Identifies which generated bullet belongs to a question with mandated
 * wording, so a bullet that drifted can be corrected in place instead of
 * duplicated. Keep these broad — they only run against the bullets of a
 * report where the mandated option was actually selected.
 */
const BULLET_MATCHERS: Record<string, RegExp> = {
  customer_concentration: /customer|client|concentrat|diversif/i,
  economic_sensitivity:
    /economic|recession|downturn|cyclical|discretionary|consumer spending|sensitiv/i,
};

/** Sentences the report must contain verbatim, given the selected answers. */
export function getFixedPhrases(report: Report): FixedPhrase[] {
  const answers = (report.questionnaireAnswers as Record<string, string>) || {};
  const phrases: FixedPhrase[] = [];

  for (const category of CATEGORIES) {
    for (const question of category.questions) {
      const selectedValue = answers[question.id];
      if (!selectedValue) continue;
      const option = question.options.find((o) => o.value === selectedValue);
      if (!option || option.score === null || !option.fixedText) continue;
      phrases.push({
        questionId: question.id,
        questionLabel: question.label,
        optionLabel: option.label,
        text: option.fixedText,
      });
    }
  }

  return phrases;
}

/** Curly quotes/dashes and whitespace vary between runs; compare on a flat form. */
function normalize(value: string): string {
  return value
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

interface ParsedReport {
  intro: string;
  bullets: string[];
}

const BULLET_START = /^\s*(?:[a-z]|[ivxl]+|\d+)[).]\s+/i;

function parseReport(text: string): ParsedReport {
  // Blocks are separated by blank lines; everything before the first labelled
  // bullet is the opening paragraph.
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const firstBulletIndex = blocks.findIndex((b) => BULLET_START.test(b));
  if (firstBulletIndex === -1) return { intro: text.trim(), bullets: [] };

  return {
    intro: blocks.slice(0, firstBulletIndex).join("\n\n"),
    bullets: blocks.slice(firstBulletIndex).map((b) => b.replace(BULLET_START, "").trim()),
  };
}

/** a) … z) then aa), ab) … — matches the labelling the prompt asks for. */
function label(index: number): string {
  let n = index;
  let out = "";
  do {
    out = String.fromCharCode(97 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

function render({ intro, bullets }: ParsedReport): string {
  const body = bullets.map((b, i) => `${label(i)}) ${b}`).join("\n\n");
  return intro ? `${intro}\n\n${body}` : body;
}

/**
 * Rewrites the generated report so every mandated sentence appears verbatim.
 * The prompt already asks for these sentences; this guarantees it, since the
 * analyst-facing requirement is that the wording never varies.
 */
export function enforceFixedPhrases(text: string, report: Report): string {
  const phrases = getFixedPhrases(report);
  if (phrases.length === 0 || !text.trim()) return text;

  const parsed = parseReport(text);
  if (parsed.bullets.length === 0) return text;

  const bullets = [...parsed.bullets];
  const claimed = new Set<number>();

  for (const phrase of phrases) {
    const target = normalize(phrase.text);

    const exactIndex = bullets.findIndex((b, i) => !claimed.has(i) && normalize(b) === target);
    if (exactIndex !== -1) {
      claimed.add(exactIndex);
      continue;
    }

    const matcher = BULLET_MATCHERS[phrase.questionId];
    const matchIndex = matcher
      ? bullets.findIndex((b, i) => !claimed.has(i) && matcher.test(b))
      : -1;

    if (matchIndex !== -1) {
      bullets[matchIndex] = phrase.text;
      claimed.add(matchIndex);
    } else {
      // The model dropped the bullet entirely — add it so the response still
      // covers every answered question.
      bullets.push(phrase.text);
      claimed.add(bullets.length - 1);
    }
  }

  return render({ intro: parsed.intro, bullets });
}
