# CSRP Report Assistant — Setup Guide

## Prerequisites
- Node.js 20+
- npm
- Supabase account (free tier: supabase.com)
- Vercel account (for deployment)

## 1. Supabase Setup

The app stores reports in a Supabase Postgres database, inside a dedicated
`csrp` schema (the Supabase project may be shared with other apps).

1. In the Supabase Dashboard, open **SQL Editor** and run the contents of
   [`supabase-setup.sql`](./supabase-setup.sql) (creates the `csrp` schema,
   the `reports` table, grants, and enables RLS).
2. Go to **Settings → Data API → Exposed schemas** and add `csrp`, then save.
3. Go to **Settings → API Keys** and copy the **secret key** (`sb_secret_...`).

## 2. Local Development

Edit `.env.local`:
```
OPENAI_API_KEY=your-key-here
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

The secret key is server-only — it is never exposed to the browser. All report
CRUD goes through Next.js Server Actions (`src/lib/actions/report-actions.ts`).

```bash
npm install
npm run dev
# → Open http://localhost:3000
```

## 3. Vercel Deployment

Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Deploys happen automatically on push to `master` (GitHub integration), or:

```bash
npx vercel --prod
```

## 4. Running Tests

```bash
npm run test
```

## App Flow

1. **Dashboard** → `/reports` — see all reports (shared across the team)
2. **New Report** → `/reports/new` — 8-step wizard
   - Step 1: Company name, industry
   - Steps 2-7: Risk questionnaire (6 categories, 20 questions; unanswered
     questions default to "Not applicable")
   - Step 8: Review CSRP score, create report
3. **Report Detail** → `/reports/[id]`
   - Override CSRP range if needed
   - Click **Generate Report** → streams AI-generated CSRP section
   - Edit content inline (auto-saves)
   - **Copy** to clipboard for pasting into valuation report (keeps Word formatting)
   - **Finalize** to lock the report
