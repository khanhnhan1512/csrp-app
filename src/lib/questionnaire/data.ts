import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "company_profile",
    label: "Company Profile & History",
    weight: 0.20,
    questions: [
      {
        id: "operating_history",
        label: "Operating history",
        options: [
          { label: "Long (>10 years)", value: "long", score: 0 },
          { label: "Moderate (5–10 years)", value: "moderate", score: 1 },
          { label: "Short (<5 years)", value: "short", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "profitability_track",
        label: "Profitability track record",
        options: [
          { label: "Consistently profitable", value: "consistent", score: 0 },
          { label: "Mixed (profitable some years, losses in others)", value: "mixed", score: 1 },
          { label: "Recently profitable after losses", value: "recent", score: 1 },
          { label: "Not yet profitable", value: "none", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "revenue_trend",
        label: "Revenue trend",
        options: [
          { label: "Growing", value: "growing", score: 0 },
          { label: "Stable", value: "stable", score: 0 },
          { label: "Volatile", value: "volatile", score: 1 },
          { label: "Declining", value: "declining", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
  {
    id: "management_workforce",
    label: "Management & Workforce",
    weight: 0.15,
    questions: [
      {
        id: "management_team",
        label: "Management team",
        options: [
          { label: "Highly experienced and stable", value: "high", score: 0 },
          { label: "Moderately experienced", value: "moderate", score: 1 },
          { label: "Limited experience / frequent turnover", value: "limited", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "key_person_dependency",
        label: "Key-person dependency",
        options: [
          { label: "No significant dependency", value: "none", score: 0 },
          { label: "Moderate dependency on a few individuals", value: "moderate", score: 1 },
          { label: "High dependency on owners/key staff", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "staff_base",
        label: "Staff/employee base",
        options: [
          { label: "Stable, low turnover", value: "stable", score: 0 },
          { label: "Moderate turnover", value: "moderate", score: 1 },
          { label: "High turnover / hiring challenges", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
  {
    id: "customers_revenue",
    label: "Customers & Revenue",
    weight: 0.20,
    questions: [
      {
        id: "customer_concentration",
        label: "Customer concentration",
        options: [
          { label: "Diversified (no customer >20% revenue)", value: "diversified", score: 0 },
          { label: "Moderate (1–2 customers = 20–40% revenue)", value: "moderate", score: 1 },
          { label: "High (1–2 customers >40% revenue)", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "revenue_nature",
        label: "Nature of revenue",
        options: [
          { label: "Mostly recurring (contracts/subscriptions/maintenance)", value: "recurring", score: 0 },
          { label: "Mixed recurring and one-time", value: "mixed", score: 1 },
          { label: "Mostly one-time", value: "one_time", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "contractual_arrangements",
        label: "Contractual arrangements",
        options: [
          { label: "Many long-term contracts/backlog in place", value: "many", score: 0 },
          { label: "Some contracts but limited coverage", value: "some", score: 1 },
          { label: "No contracts in place", value: "none", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
  {
    id: "industry_market",
    label: "Industry & Market",
    weight: 0.15,
    questions: [
      {
        id: "market_outlook",
        label: "Market outlook",
        options: [
          { label: "Strong growth expected", value: "strong", score: 0 },
          { label: "Stable/neutral", value: "stable", score: 1 },
          { label: "Weak or declining", value: "weak", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "competition_intensity",
        label: "Competition intensity",
        options: [
          { label: "Limited competition / niche player", value: "low", score: 0 },
          { label: "Moderate competition", value: "moderate", score: 1 },
          { label: "Highly competitive", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "regulatory_environment",
        label: "Regulatory environment",
        options: [
          { label: "Low regulatory risk", value: "low", score: 0 },
          { label: "Moderately regulated", value: "moderate", score: 1 },
          { label: "Highly regulated / compliance risk", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
  {
    id: "financial_risks",
    label: "Financial Risks",
    weight: 0.15,
    questions: [
      {
        id: "projection_reliability",
        label: "Financial projections reliability",
        options: [
          { label: "Reliable (supported by contracts/backlog)", value: "reliable", score: 0 },
          { label: "Reasonably reliable", value: "reasonable", score: 1 },
          { label: "High uncertainty/speculative", value: "speculative", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "capital_structure",
        label: "Capital structure (debt)",
        options: [
          { label: "No/low debt", value: "low", score: 0 },
          { label: "Moderate manageable debt", value: "moderate", score: 1 },
          { label: "High debt burden", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "working_capital",
        label: "Working capital/capital intensity",
        options: [
          { label: "Low", value: "low", score: 0 },
          { label: "Moderate", value: "moderate", score: 1 },
          { label: "High / capital intensive", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
  {
    id: "external_operational",
    label: "External/Operational Risks",
    weight: 0.15,
    questions: [
      {
        id: "economic_sensitivity",
        label: "Economic sensitivity",
        options: [
          { label: "Low (defensive/essential goods or services)", value: "low", score: 0 },
          { label: "Moderate", value: "moderate", score: 1 },
          { label: "High (cyclical/discretionary spending)", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "seasonality",
        label: "Seasonality",
        options: [
          { label: "Not impacted", value: "none", score: 0 },
          { label: "Moderate seasonality", value: "moderate", score: 1 },
          { label: "Significant seasonality", value: "significant", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "supply_chain",
        label: "Supply chain/vendor concentration",
        options: [
          { label: "Diversified suppliers", value: "diversified", score: 0 },
          { label: "Moderate reliance on a few suppliers", value: "moderate", score: 1 },
          { label: "High dependence on one/few suppliers", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "fx_geopolitical",
        label: "Foreign exchange / geopolitical exposure",
        options: [
          { label: "None", value: "none", score: 0 },
          { label: "Moderate (some imports/exports)", value: "moderate", score: 1 },
          { label: "High (significant FX/geopolitical risk)", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
      {
        id: "catastrophic_risk",
        label: "Catastrophic/operational risk exposure",
        options: [
          { label: "Low exposure", value: "low", score: 0 },
          { label: "Moderate exposure", value: "moderate", score: 1 },
          { label: "High exposure", value: "high", score: 2 },
          { label: "Not applicable", value: "na", score: null },
        ],
      },
    ],
  },
];

export const ALL_QUESTION_IDS = CATEGORIES.flatMap((c) => c.questions.map((q) => q.id));
