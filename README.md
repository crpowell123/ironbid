# IronBid — Setup Guide

Complete step-by-step instructions to go from zero to a live demo.

---

## Step 1 — Create GitHub repo

1. Go to github.com → New repository
2. Name it `ironbid`
3. Set to **Private**
4. Do NOT initialize with README (we have one)
5. Copy the repo URL (e.g. `https://github.com/yourusername/ironbid.git`)

---

## Step 2 — Set up Supabase

1. Go to supabase.com → your existing org → New project
2. Name: `ironbid-demo`
3. Set a strong database password (save it somewhere)
4. Region: **US East (N. Virginia)** — closest to NC
5. Wait ~2 minutes for it to spin up

### Run the schema

6. Go to **SQL Editor** → **New query**
7. Paste the entire contents of `supabase/schema.sql`
8. Click **Run**
9. You should see "Success. No rows returned"

### Seed the data

10. New query → paste `supabase/seed.sql` → Run
11. Go to **Table Editor** → check that `listings`, `comparables`, `bids` have rows

### Get your API keys

12. Go to **Project Settings** → **API**
13. Copy:
    - **Project URL** (looks like `https://abcdefgh.supabase.co`)
    - **anon public** key
    - **service_role secret** key (click the eye icon)

---

## Step 3 — Get your Anthropic API key

1. Go to console.anthropic.com
2. API Keys → Create key
3. Copy it — you won't see it again

---

## Step 4 — Set up the project locally

Open Terminal (Mac) or Command Prompt (Windows):

```bash
# Clone from GitHub (or just download the zip)
git clone https://github.com/yourusername/ironbid.git
cd ironbid

# Install dependencies
npm install

# Copy the environment file
cp .env.example .env.local
```

Now open `.env.local` in any text editor and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## Step 5 — Run locally

```bash
npm run dev
```

Open http://localhost:3000

You should see:
- Homepage with the 5 seeded listings
- Click any listing to see the detail page
- Go to /listings/new to create a listing with live AI valuation
- Go to /dealer to see the dashboard

---

## Step 6 — Deploy to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial IronBid demo"
git push
```

2. Go to vercel.com → Add New Project
3. Import your `ironbid` GitHub repo
4. Framework: **Next.js** (auto-detected)
5. Under **Environment Variables**, add all four variables from your `.env.local`
6. Click **Deploy**

In ~2 minutes you'll have a live URL like `ironbid.vercel.app`

---

## Demo accounts (pre-seeded)

| Role   | Email                  | What they see |
|--------|------------------------|---------------|
| Dealer | dealer@ironbid.demo    | Dealer dashboard, can create listings |
| Buyer  | buyer@ironbid.demo     | Browse and bid on listings |

Note: Auth is simplified for the demo. In production, connect Supabase Auth properly so users log in with real credentials.

---

## Demo flow for investors

1. **Start at homepage** — show 5 live listings, AI valuation badges, inspection badges
2. **Click 2019 Kenworth T680** — show the auction listing with live bid history, AI valuation card with comparables, verified inspection report, financing widget
3. **Go to /listings/new** — fill out a new listing, submit, watch the AI valuation animate and return a result
4. **Go to /dealer** — show the dashboard with pipeline value, active listings table, bid activity
5. **Wrap**: "This is the MVP. Every component — valuation, inspection, financing, bidding — is live and real."

---

## Project structure

```
ironbid/
├── supabase/
│   ├── schema.sql          # Run first in Supabase SQL editor
│   └── seed.sql            # Run second — 5 listings + 80 comparables
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout + nav
│   │   ├── globals.css                 # Design tokens + global styles
│   │   ├── listings/
│   │   │   ├── page.tsx                # Browse listings
│   │   │   ├── [id]/page.tsx           # Listing detail
│   │   │   └── new/page.tsx            # Create listing form
│   │   ├── dealer/
│   │   │   └── page.tsx                # Dealer dashboard
│   │   └── api/
│   │       └── valuate/route.ts        # AI valuation endpoint
│   ├── components/
│   │   ├── ui/Nav.tsx                  # Navigation
│   │   ├── listing/
│   │   │   ├── ListingCard.tsx         # Card for browse grid
│   │   │   ├── BidPanel.tsx            # Auction bid + buy now panel
│   │   │   └── InspectionPanel.tsx     # Verified inspection display
│   │   └── valuation/
│   │       └── ValuationCard.tsx       # AI FMV display with comps
│   ├── lib/
│   │   ├── supabase.ts                 # DB client
│   │   └── utils.ts                    # formatPrice, helpers
│   └── types/
│       └── index.ts                    # TypeScript types
├── .env.example                        # Copy to .env.local and fill in
└── README.md                           # This file
```

---

## What's NOT built yet (post-demo)

- Real user authentication (Supabase Auth or Clerk)
- Photo upload to Cloudflare R2 (currently uses placeholder URLs)
- Stripe checkout integration
- Transport quote integration
- Inspector portal for submitting reports
- Email notifications for bids
- Mobile app

These are Phase 2 when the contractor starts.
