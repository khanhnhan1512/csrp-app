# CSRP Report Assistant — Setup Guide

## Prerequisites
- Node.js 20+
- npm
- Supabase account (free tier: supabase.com)
- Vercel account (for deployment)

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection pooling**
3. Copy the **Connection string (Transaction mode)** — it looks like:
   ```
   postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
4. Go to **SQL Editor** and run the migration:
   ```sql
   -- Paste contents of: drizzle/0000_jazzy_anita_blake.sql
   ```

## 2. Local Development

```bash
# Copy and edit .env.local
cp .env.local.example .env.local
# Add your DATABASE_URL from Supabase
```

Edit `.env.local`:
```
OPENAI_API_KEY=your-key-here
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

```bash
npm install
npm run dev
# → Open http://localhost:3000
```

## 3. Vercel Deployment

```bash
npx vercel link
```

Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables:
- `OPENAI_API_KEY`
- `DATABASE_URL` (use the Supabase Transaction pooler URL)

```bash
npx vercel --prod
```

## 4. Database Migration (if not using SQL Editor)

```bash
npm run db:migrate
```

## 5. Running Tests

```bash
npm run test
```

## App Flow

1. **Dashboard** → `/reports` — see all reports
2. **New Report** → `/reports/new` — 8-step wizard
   - Step 1: Company name, industry
   - Steps 2-7: Risk questionnaire (6 categories, 20 questions)
   - Step 8: Review CSRP score, create report
3. **Report Detail** → `/reports/[id]`
   - Override CSRP range if needed
   - Click **Generate Report** → streams AI-generated CSRP section
   - Edit content inline (auto-saves)
   - **Copy** to clipboard for pasting into valuation report
   - **Finalize** to lock the report
