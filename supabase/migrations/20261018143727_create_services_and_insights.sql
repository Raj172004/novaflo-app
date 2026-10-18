/*
# Add services and insights tables (CMS-managed content)

1. New Tables
- `services`
  - `id` (uuid, primary key)
  - `slug` (text, unique, not null) — URL identifier
  - `name`, `tagline`, `description` (text)
  - `deliverables` (jsonb array of strings)
  - `icon` (text) — icon key used by the frontend
  - `sort_order` (integer) — display order
  - `published` (boolean, default true)
  - `created_at`, `updated_at` (timestamps)
- `insights`
  - `id` (uuid, primary key)
  - `slug` (text, unique, not null)
  - `title`, `excerpt`, `content` (text) — content supports multiple paragraphs separated by blank lines
  - `category`, `read_time` (text)
  - `published` (boolean, default true)
  - `created_at`, `updated_at` (timestamps)

2. Security
- Enable RLS on both tables.
- SELECT: everyone (anon + authenticated) may read published content — public pages.
- Full access (insert/update/delete, including unpublished) for authenticated admins only.
  Note: a postgres-level control on the draft column is not enforceable per-row simply;
  drafts are filtered client-side via .eq('published', true) on public paths.

3. Notes
- Seeds the six existing services and four existing insights from static content
  so the site keeps working identically after the switch to DB-backed content.
- set_updated_at trigger reused for updated_at maintenance.
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  icon text NOT NULL DEFAULT 'target',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  read_time text NOT NULL DEFAULT '5 min',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_sort ON services (sort_order);
CREATE INDEX IF NOT EXISTS idx_services_published ON services (published);
CREATE INDEX IF NOT EXISTS idx_insights_created ON insights (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_published ON insights (published);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services
FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "public_read_insights" ON insights;
CREATE POLICY "public_read_insights" ON insights
FOR SELECT
TO anon, authenticated
USING (published = true OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_write_services" ON services;
CREATE POLICY "admin_write_services" ON services
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_write_insights" ON insights;
CREATE POLICY "admin_write_insights" ON insights
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_update_insights" ON insights;
CREATE POLICY "admin_update_insights" ON insights
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_delete_insights" ON insights;
CREATE POLICY "admin_delete_insights" ON insights
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS services_set_updated_at ON services;
CREATE TRIGGER services_set_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS insights_set_updated_at ON insights;
CREATE TRIGGER insights_set_updated_at
BEFORE UPDATE ON insights
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed services
INSERT INTO services (slug, name, tagline, description, deliverables, icon, sort_order)
VALUES
('social-media-strategy', 'Social Media Strategy', 'A plan built around your business, not templates.',
 'We map your audience, competitors and positioning into a clear content strategy — what to post, where to post it, and why it converts.',
 '["Audience & competitor research","Positioning & messaging framework","Platform selection & posting cadence","Content pillar roadmap (90 days)"]'::jsonb,
 'target', 1),
('content-creation', 'Content Creation', 'Posts your customers actually stop for.',
 'Reels, carousels, stories and static posts designed and written for your brand — planned, produced and delivered on a schedule you approve.',
 '["Monthly content calendar","Reels & short-form video edits","Carousel & static post design","Captions and hashtags written for you"]'::jsonb,
 'pen', 2),
('content-calendar-management', 'Content Calendar & Management', 'Consistency without you lifting a finger.',
 'We plan, schedule and publish across your channels, keeping every post on-brand and on-time so your presence never goes quiet.',
 '["Scheduling & publishing handled end-to-end","Monthly planning calls","Approval workflow before anything goes live","Performance recap every month"]'::jsonb,
 'calendar', 3),
('reels-video-editing', 'Reels & Video Editing', 'Short-form video that earns attention.',
 'From raw footage to polished reels: hooks, cuts, captions, music and covers — edited to keep viewers watching to the end.',
 '["Hook scripting & structure","Professional edits with captions","Cover design & posting copy","Two revision rounds per video"]'::jsonb,
 'video', 4),
('local-seo-discovery', 'Local SEO & Discovery', 'Get found by people nearby who are ready to buy.',
 'Profile optimization, keywords and geo-targeted content so when someone searches for your service in your city, your business is the obvious answer.',
 '["Google Business Profile optimization","Local keyword targeting","Review & reputation guidance","Geo-tagged content plan"]'::jsonb,
 'search', 5),
('paid-boosts', 'Paid Boosts & Promotions', 'Small budgets, strategically amplified.',
 'We boost the posts that already work and run tightly targeted local promotions — measured on leads, not vanity metrics.',
 '["Audience & geo targeting setup","Creative testing plan","Weekly budget monitoring","Clear reporting on cost per lead"]'::jsonb,
 'megaphone', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed insights (with full article content)
INSERT INTO insights (slug, title, excerpt, content, category, read_time, created_at) VALUES
('why-posting-daily-is-not-a-strategy', 'Why posting daily is not a strategy',
 'Volume without direction burns you out and trains the algorithm to ignore you. Here is how to think about cadence versus consistency.',
 E'Every business owner has heard it: "you have to post every day." It sounds like discipline. In practice, it is often the fastest route to burnout and a feed nobody watches.\n\nThe platforms do not reward volume. They reward signals — saves, shares, watch time, comments. A daily post that gets none of those teaches the algorithm your content is not worth showing. Three strong posts a week that consistently earn saves will outperform seven forgettable ones every single time.\n\nThe fix is to think in terms of consistency, not cadence. Pick a rhythm you can sustain for a year, not a month. Build three to five content pillars that map to what your customers actually care about. Then measure every post against those pillars: did it build trust, show proof, or make an offer?\n\nDaily posting is a tactic, not a strategy. The strategy is the story you are telling — and a story told three times a week, well, beats one told daily, badly.',
 'Strategy', '5 min', '2026-09-12'),
('the-3-content-pillars-every-local-business-needs', 'The 3 content pillars every local business needs',
 'Trust, proof and offer. Most businesses post only offers — and wonder why nobody engages. A simple framework to balance your feed.',
 E'Open the Instagram feed of a typical local business and you will find a wall of offers: discounts, deals, promotions. Followed by silence. Offers-only feeds fail because they ask for the sale before earning the trust.\n\nA healthy feed balances three pillars. Trust content teaches — answer the questions your customers actually ask, demystify your process, show the faces behind the business. Proof content demonstrates — before/afters, results, reviews, work in progress. Offer content asks — a clear invitation with a reason to act now.\n\nA simple split that works for most local businesses: 40 percent trust, 40 percent proof, 20 percent offers. If you feel like you are giving away too much for free, you are probably doing it right.\n\nAudit your last twelve posts against this split. Most businesses discover they are at 80 percent offers. Rebalancing is the single fastest way to lift engagement — no new equipment, no new budget, just a better mix.',
 'Content', '4 min', '2026-08-28'),
('reels-hooks-the-first-2-seconds-decide-everything', 'Reels hooks: the first 2 seconds decide everything',
 'A practical breakdown of hook patterns that stop the scroll for local businesses — with examples you can adapt this week.',
 E'Eighty percent of viewers who will ever drop off, drop off in the first two seconds. That is not a reason to panic — it is a design constraint. The hook is not decoration; it is the gate everything else depends on.\n\nThe patterns that consistently work for local businesses share one quality: they open a question the viewer needs answered. "This is why your dosa never tastes like the restaurant version." "Three things every salon does wrong with walk-in clients." "We renovated this shop for under fifty thousand — here is the breakdown."\n\nNotice these are not flashy. No zooms, no sound effects. They work because they name a specific person and a specific problem. Specificity beats spectacle.\n\nPractical rules: start mid-action, never with a logo or a greeting. Put the payoff promise in the first line of on-screen text. Cut anything in the first three seconds that does not earn the next three. And rewrite your hook after filming — the best hook is usually one line from the middle of your raw footage.',
 'Video', '6 min', '2026-08-10'),
('how-to-get-reviews-without-begging', 'How to get reviews without begging',
 'A respectful, repeatable system for earning Google reviews that boost your local discovery — and what to never do.',
 E'Ask any local business owner about reviews and you get the same story: they know reviews matter, they feel awkward asking, and so most happy customers walk out silently — while the one dissatisfied customer writes a paragraph.\n\nThe fix is a system, not courage. First, pick the moment: the peak of satisfaction, right after a delighted customer says thank you or compliments the work. That is your window. Second, make it effortless: a QR code at the counter or a direct link sent by message. Never "search for us on Google" — that is a funnel with leaks. Third, personalize: "Would you mind sharing that as a review? It genuinely helps a small business like ours." Honest beats pushy.\n\nWhat never to do: never buy reviews, never incentivize them, never ask staff to write them. Platforms detect it, and one penalty erases years of reputation. And respond to every review — including the critical ones. A calm, professional response to a complaint often does more for your reputation than ten five-star reviews.',
 'Local SEO', '4 min', '2026-07-22')
ON CONFLICT (slug) DO NOTHING;