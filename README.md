# Admin Dashboard — Software Engineer Intern Assessment

A production-minded admin dashboard built with React 18, TypeScript, Supabase, and Vercel.
Allows authenticated admins to create organizations, invite members, and manage their directory.

---

## Live URLs
- **Production (main):** (will be added after Vercel deployment)
- **Development preview:** (will be added after Vercel deployment)

---

## Test Credentials
Use these to log into the deployed app without signing up:
- **Email:** testadmin@example.com
- **Password:** TestAdmin123!

---

## Features
- **Admin Authentication** — Sign-up and sign-in with Supabase Auth. Unauthenticated users are redirected to /signin. Signed-in user email is shown in the header with a sign-out button.
- **Organization Creation** — Create organizations of 3 types: School, Nonprofit, Business. Each type shows a unique conditional field (School District / EIN Number / Registration Number). Validated with Zod on the client side.
- **Member Invitations** — Invite members by email from within an organization. Invitations go through a Supabase Edge Function that validates input, verifies ownership, and prevents duplicates. Members appear with `invited` or `active` status.
- **Organization Directory** — Lists all organizations created by the signed-in admin with type badge and created date. Click any row to view its members.

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework, strict mode enabled |
| Vite (SWC) | Build tool and dev server |
| React Router v6 | Client-side routing + protected routes |
| Tailwind CSS | Utility-first styling |
| shadcn/ui (Radix) | Accessible UI components |
| TanStack React Query | Server state management |
| React Hook Form + Zod | Form handling and validation |
| Lucide React | Icons |

### Backend & Data
| Tool | Purpose |
|------|---------|
| Supabase Auth | Email/password authentication |
| Supabase Postgres | Database with foreign keys and constraints |
| Supabase Edge Functions (Deno) | Server-side invite logic |
| Row Level Security (RLS) | Admins can only access their own data |

---

## Local Setup

Follow these steps to run the project locally in under 15 minutes:

### Prerequisites
- Node.js v18 or higher
- Git
- A Supabase account (free tier)

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/MHuzaifaAsif/admin-dashboard.git
   cd admin-dashboard
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env.local
```
   Fill in your Supabase credentials in `.env.local`:

   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key

4. **Set up the database**
   - Go to your Supabase dashboard > SQL Editor
   - Run the contents of `supabase/migrations/001_initial_schema.sql`
   - This creates all tables, RLS policies, and the auto-profile trigger

5. **Deploy the Edge Function**
```bash
   supabase login
   supabase link
   supabase functions deploy invite-member --no-verify-jwt
```

6. **Start the development server**
```bash
   npm run dev
```
   Open http://localhost:5173 in your browser.

---

## Database Schema

### Tables

**profiles**
- `id` UUID (FK → auth.users)
- `full_name` TEXT
- `is_admin` BOOLEAN
- `created_at` TIMESTAMPTZ

**organizations**
- `id` UUID (primary key)
- `name` TEXT
- `type` TEXT (School | Nonprofit | Business)
- `school_district` TEXT (conditional)
- `nonprofit_ein` TEXT (conditional)
- `business_registration` TEXT (conditional)
- `created_by` UUID (FK → auth.users)
- `created_at` TIMESTAMPTZ

**organization_members**
- `id` UUID (primary key)
- `organization_id` UUID (FK → organizations)
- `email` TEXT
- `status` TEXT (invited | active)
- `role` TEXT
- `invited_at` TIMESTAMPTZ
- `joined_at` TIMESTAMPTZ
- UNIQUE constraint on (organization_id, email)

### Row Level Security
RLS is enabled on all tables. Policies ensure:
- Admins can only read/write their own organizations
- Admins can only manage members of organizations they created
- Users can only read/update their own profile

See full SQL in `supabase/migrations/001_initial_schema.sql`

---

## Branching Strategy
- `main` — production branch. Only receives merges from `development` once a milestone is stable. Deployed to Vercel Production URL.
- `development` — default working branch. All feature work branches off here. Deployed to Vercel Preview URL.
- Feature branches — short-lived branches (e.g. `feat/auth`, `feat/organizations`) merged into `development` via pull request.

---

## Edge Function Architecture

The `invite-member` Edge Function (Deno) handles member invitations:
1. Validates that `organization_id` and `email` are provided
2. Verifies the caller is authenticated via JWT
3. Confirms the caller owns the organization
4. Checks for duplicate invitations
5. Creates the invitation record with `status: invited`
6. **TODO:** Send invitation email via Resend or SendGrid (plug-in point is clearly marked in the code)

---

## What I Would Do With Another Day
- Implement actual email delivery via Resend API
- Build a member acceptance flow using Supabase magic links
- Add pagination for organizations and members lists
- Write unit tests for the Edge Function
- Improve mobile responsiveness
- Add loading skeletons instead of plain text loading states
- Add organization edit and delete functionality

## Shortcuts Taken
- All signed-up users are treated as admins (`is_admin = true` by default) — in production this would require an approval flow
- No email delivery implemented — invitation records are created in the database only

## Tradeoffs
- Chose client-side routing (React Router) over SSR for simplicity and faster development
- Used a single migration file instead of incremental migrations for ease of setup
- Kept the data model minimal but designed it to be easily extensible