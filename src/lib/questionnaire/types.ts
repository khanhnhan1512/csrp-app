export interface Option {
  label: string;
  value: string;
  score: number | null; // null = N/A
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
