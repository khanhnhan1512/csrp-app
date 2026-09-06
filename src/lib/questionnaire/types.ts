export interface Option {
  label: string;
  value: string;
  score: number | null; // null = N/A
  /**
   * Mandated wording. When this option is selected the generated report must
   * contain this sentence verbatim as the bullet for the question — the model
   * is instructed to reproduce it and the output is corrected if it does not.
   */
  fixedText?: string;
}

export interface Question {
  id: string;
  label: string;
  options: Option[];
}

export interface Category {
  id: string;
  label: string;
  weight: number;
  questions: Question[];
}
