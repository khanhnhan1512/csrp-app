-- CSRP Report Assistant — Supabase setup
-- Run this once in the Supabase Dashboard SQL Editor.
-- The app lives in its own "csrp" schema because the Supabase project is
-- shared with another application.
--
-- After running, also add "csrp" to Settings → Data API → Exposed schemas.

create schema if not exists csrp;

-- PostgREST needs schema usage to introspect; table privileges are granted
-- only to the server-side roles. RLS below is a second layer of protection.
grant usage on schema csrp to postgres, anon, authenticated, service_role;

create table if not exists csrp.reports (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  industry text,
  questionnaire_answers jsonb,
  category_scores jsonb,
  composite_score real,
  suggested_csrp_low real,
  suggested_csrp_high real,
  override_csrp_low real,
  override_csrp_high real,
  generated_content text,
  edited_content text,
  analyst_notes text,
  status text default 'draft' not null,
  created_at timestamp default now() not null,
  updated_at timestamp default now() not null
);

grant all on all tables in schema csrp to postgres, service_role;
alter default privileges in schema csrp grant all on tables to postgres, service_role;

-- No policies defined: publishable/anon keys are fully blocked;
-- the secret key (service_role) bypasses RLS.
alter table csrp.reports enable row level security;
