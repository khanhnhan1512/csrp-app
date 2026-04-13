CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"industry" text,
	"questionnaire_answers" jsonb,
	"category_scores" jsonb,
	"composite_score" real,
	"suggested_csrp_low" real,
	"suggested_csrp_high" real,
	"override_csrp_low" real,
	"override_csrp_high" real,
	"generated_content" text,
	"edited_content" text,
	"analyst_notes" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
