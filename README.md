# Admin Dashboard 

A production-ready admin dashboard for managing organizations and members.
Built with React 18, TypeScript, Supabase, and deployed on Vercel.

---

## Live URLs

| Environment | URL |
|-------------|-----|
| **Production (main)** | https://admin-dashboard-beta-blond-61.vercel.app |
| **Development preview** | https://admin-dashboard-git-development-huzaifa-asif-s-projects.vercel.app |

---

## Test Credentials

Use these to log in without signing up:

- **Email:** testadmin@example.com
- **Password:** TestAdmin123!

---

## What It Does

- **Authentication** — Sign up / sign in with email and password. Protected routes redirect unauthenticated users to the sign-in page.
- **Organization Creation** — Create organizations of 3 types: School, Nonprofit, Business. Each type shows a unique conditional field. Validated with Zod.
- **Member Invitations** — Invite members by email via a Supabase Edge Function. Duplicate invitations are prevented. Members appear with `invited` or `active` status.
- **Organization Directory** — Lists all your organizations with type badge and date. Search and filter by type. Click any row to view its members.
- **E2E Test** — Playwright test covering sign-in → create org → invite member.

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| Security | Row Level Security (RLS) on all tables |
| Deployment | Vercel (Production + Preview) |
| Testing | Playwright |

---

## Local Setup
### Prerequisites
- Node.js v18+
- Git
- A Supabase account (free tier)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/MHuzaifaAsif/admin-dashboard.git
cd admin-dashboard
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```
Fill in `.env.local` with your Supabase credentials:
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key

**4. Set up the database**
- Go to Supabase dashboard → SQL Editor
- Run the contents of `supabase/migrations/001_initial_schema.sql`

**5. Deploy the Edge Function**
```bash
supabase login
supabase link
supabase functions deploy invite-member --no-verify-jwt
```

**6. Start the dev server**
```bash
npm run dev
```
Open http://localhost:5173

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — deploys to Production URL on Vercel |
| `development` | Default working branch — deploys to Preview URL on Vercel |
| `feat/*` | Short-lived feature branches, merged into `development` via PR |

---

## Database Schema

**organizations** — id, name, type (School/Nonprofit/Business), conditional fields, created_by, created_at

**organization_members** — id, organization_id, email, status (invited/active), role, invited_at, joined_at

**profiles** — id, full_name, is_admin, created_at

RLS is enabled on all tables. Admins can only read/write their own data.

See full SQL in `supabase/migrations/001_initial_schema.sql`

---

## Edge Function

The `invite-member` Edge Function (Deno):
1. Validates input
2. Verifies the caller owns the organization
3. Prevents duplicate invitations
4. Creates the invitation record with `status: invited`
5. *(TODO: Send email via Resend — plug-in point marked in code)*

---

## Running the E2E Test

Make sure the dev server is running, then:
```bash
npx playwright test --headed
```

---

## Tradeoffs & Shortcuts

- All signed-up users are treated as admins (`is_admin = true`) — in production this would need an approval flow
- No email delivery — invitation records are created in DB only

## What I Would Do With More Time

- Implement email delivery via Resend API
- Add member acceptance flow via magic link
- Add pagination for large lists
- Add unit tests for Edge Functions
- Improve mobile responsiveness