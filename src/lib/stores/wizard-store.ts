"use client";
import { create } from "zustand";

interface WizardStore {
  currentStep: number;
  companyName: string;
  industry: string;
  analystNotes: string;
  answers: Record<string, string>;
  setCompanyName: (name: string) => void;
  setIndustry: (industry: string) => void;
  setAnalystNotes: (notes: string) => void;
  setAnswer: (questionId: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardStore>((set) => ({
  currentStep: 0,
  companyName: "",
  industry: "",
  analystNotes: "",
  answers: {},
  setCompanyName: (name) => set({ companyName: name }),
  setIndustry: (industry) => set({ industry }),
  setAnalystNotes: (notes) => set({ analystNotes: notes }),
  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  goToStep: (step) => set({ currentStep: step }),
  reset: () =>
    set({ currentStep: 0, companyName: "", industry: "", analystNotes: "", answers: {} }),
}));
