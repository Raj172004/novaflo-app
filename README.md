# NovaFlo — Digital Agency Platform

> Make your business the trusted name customers remember.

A complete, production-ready, full-stack website for **NovaFlo**, a social media
growth agency for local and growing businesses (started in Anantapur, Andhra
Pradesh, serving nearby service areas). The platform is a conversion-focused
growth system: credibility, lead generation, a real-time leads CRM, a
content-management system, and an optional zero-cost notification pipeline.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Pages & Routing](#pages--routing)
5. [Database Schema](#database-schema)
6. [Lead Capture & Dual Notification Pipeline](#lead-capture--dual-notification-pipeline)
7. [Admin Dashboard & CMS](#admin-dashboard--cms)
8. [Security Model](#security-model)
9. [Environment Variables](#environment-variables)
10. [Setting Up Notifications (Google Sheets + Gmail)](#setting-up-notifications-google-sheets--gmail)
11. [Creating an Admin Account](#creating-an-admin-account)
12. [Running the Project](#running-the-project)
13. [Design System](#design-system)
14. [Content Rules](#content-rules)
15. [Deployment Notes](#deployment-notes)

---

## Overview

NovaFlo is built as a **dynamic, database-driven platform** rather than a
static brochure site:

- All **services** and **insights/blog articles** are stored in the database
  and rendered dynamically with slug-based routing
  (`/services/[slug]`, `/insights/[slug]`).
- All **leads** (growth-call bookings and contact messages) are persisted to
  the database and managed in a private admin CRM with a pipeline of statuses.
- Every public page **degrades gracefully**: if the database is unreachable or
  empty, the site falls back to built-in static content so pages never break.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + TypeScript (strict) |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (custom dark design system) |
| Icons | lucide-react |
| Routing | react-router-dom v7 |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | Supabase email/password (admin only) |
| Notifications | Google Apps Script webhook → Google Sheets + Gmail |

> **Note on the original spec:** the source repository was written for
> Next.js 15 + Firebase/Firestore. This build targets the same feature set on
> the project's provisioned stack (Vite + React + Supabase). The concepts map
> 1:1: Firestore `services`/`content`/`leads` collections correspond to the
> Supabase `services`/`insights`/`leads` tables, and tag-based revalidation is
> replaced by the static fallback adapter in `src/lib/cms.ts`.

---

## Architecture

```
src/
├── main.tsx                      # App entry
├── App.tsx                       # Router + layout shell (public vs admin)
├── index.css                     # Tailwind layers + design-system classes
├── lib/
│   ├── supabase.ts               # DB client, Lead types, status constants
│   ├── cms.ts                    # Services/insights data layer with static fallback
│   ├── attribution.ts            # UTM/referrer capture for lead attribution
│   ├── rateLimit.ts              # Client-side flood protection (3/min/form)
│   └── notifications.ts          # Google Sheets + email notification pipeline
├── data/
│   └── content.ts                # Process, FAQs, industries, form options
├── components/
│   ├── Reveal.tsx                # IntersectionObserver scroll-reveal
│   ├── Accordion.tsx             # FAQ accordion
│   ├── PageHero.tsx              # Shared inner-page hero
│   ├── forms/GrowthCallForm.tsx  # Growth-call lead form
│   └── layout/                   # Navbar, Footer, StickyCta
└── pages/
    ├── HomePage.tsx              # Hero, dynamic services, process, CTA
    ├── ServicesPage.tsx          # /services + /services/:slug (DB-driven)
    ├── InsightsPages.tsx         # /insights + /insights/:slug (DB-driven)
    ├── AboutPage.tsx             # Mission, story, values
    ├── HowItWorksPage.tsx        # 4-step process timeline
    ├── IndustriesPage.tsx        # Target sectors
    ├── BusinessOwnersPage.tsx    # Owner-focused conversion page
    ├── FaqsPage.tsx              # FAQ accordion page
    ├── ContactPage.tsx           # Contact form (DB + notifications)
    ├── GrowthCallPage.tsx        # Growth-call form page
    ├── LegalPages.tsx            # Privacy, Terms, Disclaimer
    ├── NotFoundPage.tsx          # 404
    └── admin/
        ├── AdminLoginPage.tsx    # Email/password sign-in
        ├── AdminDashboardPage.tsx# Leads CRM with drawer + pipeline
        └── AdminContentPage.tsx  # CMS for services & insights

supabase/migrations/              # SQL migrations (schema + RLS + seeds)
```

---

## Pages & Routing

### Marketing pages

| Route | Description |
| --- | --- |
| `/` | Hero, value proposition, dynamic service highlights, process, differentiators, CTA |
| `/about` | Agency mission, story, values, promise |
| `/services` | All service offerings (from the database) |
| `/services/:slug` | Service detail: description + deliverables + CTA |
| `/how-it-works` | 4-step process + first-month timeline |
| `/industries` | Tailored sector solutions |
| `/business-owners` | Owner-focused landing page (pain points, outcomes, fit check) |
| `/insights` | Blog index (from the database) |
| `/insights/:slug` | Full article rendering + CTA |
| `/faqs` | Accordion FAQ |
| `/contact` | Contact form with validation + rate limiting |
| `/growth-call` | Free growth-call booking form |
| `/privacy-policy`, `/terms-and-conditions`, `/disclaimer` | Legal pages |

### System pages

| Route | Description |
| --- | --- |
| `/admin/login` | Admin sign-in (Supabase email/password) |
| `/admin` | Leads CRM: searchable, filterable, status pipeline, detail drawer |
| `/admin/content` | CMS: create/edit/publish/unpublish/delete services & insights |
| `*` | Styled 404 |

---

## Database Schema

Three core tables (equivalent to the Firestore `services`, `content`, `leads`
collections in the original spec).

### `services`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `slug` | text UNIQUE | URL identifier |
| `name` | text | Display name |
| `tagline` | text | Short one-liner |
| `description` | text | Full description |
| `deliverables` | jsonb | Array of strings |
| `icon` | text | Icon key: target, pen, calendar, video, search, megaphone |
| `sort_order` | integer | Display order |
| `published` | boolean | Live/hidden toggle |
| `created_at` / `updated_at` | timestamptz | Auto-maintained by trigger |

### `insights` (the `content` collection)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `slug` | text UNIQUE | URL identifier |
| `title` | text | |
| `excerpt` | text | Card + meta description |
| `content` | text | Full body; paragraphs separated by blank lines |
| `category` | text | e.g. Strategy, Content, Video, Local SEO |
| `read_time` | text | e.g. "5 min" |
| `published` | boolean | Drafts are hidden from the public |
| `created_at` / `updated_at` | timestamptz | |

### `leads`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `type` | text | `growth_call` or `contact` |
| `name`, `email` | text | Required |
| `phone` | text | Optional |
| `business_name`, `business_type`, `service_area` | text | Optional |
| `service_interest` | text | Which service the lead wants |
| `goals`, `message` | text | Free-form context |
| `budget`, `timeline` | text | Selected options |
| `status` | text | `new` → `contacted` → `qualified` → `proposal` → `won` / `lost` |
| `notes` | text | Internal admin notes |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer` | text | Attribution |
| `created_at` / `updated_at` | timestamptz | |

Indexes exist on `leads.status`, `leads.created_at`, `services.sort_order`,
`insights.created_at` for fast admin queries.

---

## Lead Capture & Dual Notification Pipeline

Flow when a visitor submits either form:

```
Visitor → Form (client validation, honeypot, rate limit 3/min)
        → Lead saved to database (with UTM attribution)
        → Background notification (fire-and-forget, never blocks the user):
             1. HTTP POST → Google Apps Script webhook
                  → appends a row to a Google Sheet (CRM backup)
                  → relays an email alert through Gmail SMTP
```

Details:

- **Client validation** — required fields, email format, phone sanity.
- **Honeypot** — a hidden field real users never fill; bots that do are rejected.
- **Rate limiting** — max 3 submissions per minute per form
  (`src/lib/rateLimit.ts`). This mirrors the server-side express-rate-limit
  from the spec; the server-side equivalents are the database RLS rules plus
  Supabase's built-in abuse protection.
- **Server persistence** — the lead row is written through Supabase with RLS
  enforcing that the public can only insert (never read) leads.
- **Notifications** — `src/lib/notifications.ts` POSTs a JSON payload to
  `VITE_GOOGLE_SHEETS_WEBHOOK_URL` (a Google Apps Script). The script appends
  the lead to a Google Sheet **and** emails a formatted alert to the agency
  inbox (`VITE_NOTIFICATION_EMAIL`) via Gmail SMTP (`smtp.gmail.com:465`).
  Both steps are optional — with no webhook configured, leads still save and
  the site works normally.

---

## Admin Dashboard & CMS

- **Sign-in** — `/admin/login` uses Supabase email/password. Sessions are
  managed by Supabase (HTTP-only, signed tokens handled by the SDK).
- **Leads CRM (`/admin`)** — live table of all leads with:
  - Search by name, email, or business.
  - Filter chips per pipeline status with live counts.
  - Detail drawer with every field, attribution data, and message.
  - One-click status transitions (new → contacted → qualified → proposal → won/lost).
  - Delete with confirmation.
- **Content manager (`/admin/content`)** — full CMS lifecycle for services and
  insights:
  - Create, edit, publish/unpublish, and delete items.
  - Slug generation + uniqueness handling.
  - Sort ordering and icon selection for services.
  - Category/read-time editing for articles; drafts stay hidden from the site.

---

## Security Model

1. **Row Level Security (RLS)** on every table:
   - `leads`: public (anon) may **INSERT only**. Reading, updating, and
     deleting requires an authenticated session. Visitors can submit leads
     but can never read anyone else's (or their own) submissions back.
   - `services` / `insights`: everyone may read **published** rows;
     all writes require authentication.
2. **No secrets in the client.** Supabase anon key is public by design; all
   privileged access requires a signed-in session. The notification webhook is
   the only public endpoint and carries no credentials.
3. **Spam defences** — honeypot field, per-form rate limiting, and input
   validation on both client and server (the database rejects malformed rows).
4. **XSS safety** — React escapes all rendered content by default; no
   `dangerouslySetInnerHTML` anywhere in the codebase.

---

## Environment Variables

Already provisioned by the platform (do not add manually):

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Database URL |
| `VITE_SUPABASE_ANON_KEY` | Public client key |

Optional (for the notification pipeline):

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script webhook URL (Sheets + email relay) |
| `VITE_NOTIFICATION_EMAIL` | Inbox that receives lead alerts (e.g. rajesh.c.fullstack@gmail.com) |

If the optional variables are absent, the pipeline is skipped silently and
lead capture still works end-to-end.

---

## Setting Up Notifications (Google Sheets + Gmail)

The zero-cost notification relay is a single Google Apps Script bound to a
Google Sheet.

1. **Create the Sheet** — add a new Google Sheet named e.g. "NovaFlo Leads".
2. **Open Apps Script** — Extensions → Apps Script, and paste:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // 1. Append to the Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Time', 'Type', 'Name', 'Email', 'Phone', 'Company',
                     'Service Interest', 'Message', 'Budget', 'Timeline',
                     'Area', 'Page URL']);
  }
  sheet.appendRow([data.submittedAt, data.type, data.name, data.email,
                   data.phone, data.company, data.serviceInterest,
                   data.message, data.budget, data.timeline,
                   data.serviceArea, data.pageUrl]);

  // 2. Email alert via Gmail
  var recipient = data.notificationEmail || 'rajesh.c.fullstack@gmail.com';
  var subject = 'New NovaFlo lead: ' + data.name + ' (' + data.type + ')';
  var body =
    'Name: ' + data.name + '\n' +
    'Email: ' + data.email + '\n' +
    'Phone: ' + data.phone + '\n' +
    'Company: ' + data.company + '\n' +
    'Interested in: ' + data.serviceInterest + '\n' +
    'Message: ' + data.message + '\n' +
    'Budget: ' + data.budget + '\n' +
    'Timeline: ' + data.timeline + '\n' +
    'Area: ' + data.serviceArea + '\n' +
    'Page: ' + data.pageUrl;
  MailApp.sendEmail(recipient, subject, body);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy** — Deploy → New deployment → type "Web app" → Execute as "Me" →
   Who has access: "Anyone" → Deploy. Copy the webhook URL.
4. **Configure** — set `VITE_GOOGLE_SHEETS_WEBHOOK_URL` (and optionally
   `VITE_NOTIFICATION_EMAIL`) in the project environment.

Gmail's daily email quota on a free account (~100/day) far exceeds typical
lead volume, keeping the whole pipeline inside free tiers.

---

## Creating an Admin Account

The admin panel has **no public sign-up** by design.

1. Open the Supabase dashboard for this project.
2. Go to **Authentication → Users → Add user**.
3. Create the user with your email and a strong password (email confirmation off).
4. Sign in at `/admin/login` on the website with those credentials.

---

## Running the Project

```bash
npm install
npm run dev        # local development
npm run build      # production build
npm run preview    # preview the production build
npm run typecheck  # strict TypeScript check
npm run lint       # ESLint
```

The production build compiles with zero TypeScript errors under `strict` mode.

---

## Design System

- **Palette** — deep-navy ink scale (`#050A14` → `#1C3355`), electric-cyan
  accent ramp, plus success/warning/danger tokens. No purple gradients.
- **Type** — Sora for display/headings, Inter for body; max 3 weights.
- **Spacing** — consistent 8px rhythm; container max-width 1152px.
- **Components** — shared classes in `index.css`: `.btn-primary`,
  `.btn-secondary`, `.card-surface`, `.input-field`, `.eyebrow`,
  `.container-page`, `.glow-orb`.
- **Motion** — IntersectionObserver scroll reveals, hover lifts, focus rings,
  an animated sticky CTA, and smooth accordions. All CSS-transition based
  (no animation library).

---

## Content Rules

Enforced by design, carried over from the original NovaFlo doctrine:

- No fake testimonials, client logos, metrics, or case studies.
- Insights show an elegant empty state when nothing is published.
- Demo visuals (hero phone, dashboard) are explicitly labelled "Demo".
- No guarantees of followers, virality, sales, or ROI anywhere on the site.

---

## Deployment Notes

- The site is a static SPA: any static host works (`dist/` after build).
- Client-side routing requires a SPA fallback (rewrite all paths to
  `index.html`) so URLs like `/services/:slug` resolve on refresh.
- Database migrations live in `supabase/migrations/` and are applied through
  the Supabase tooling; the schema (tables, RLS, seeds) is already live.
- To reset content: services and insights are fully editable (or deletable)
  from `/admin/content` — no redeploy needed.
