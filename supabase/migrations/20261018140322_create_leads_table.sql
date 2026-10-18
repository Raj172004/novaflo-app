/*
# Create leads table for Novaflo lead capture

1. New Tables
- `leads`
  - `id` (uuid, primary key, auto-generated)
  - `type` (text, not null) — lead source: "growth_call" or "contact"
  - `name` (text, not null) — visitor's name
  - `email` (text, not null) — visitor's email
  - `phone` (text) — optional
  - `business_name` (text) — optional
  - `business_type` (text) — optional
  - `service_area` (text) — optional
  - `goals` (text) — optional
  - `message` (text) — optional
  - `budget` (text) — optional
  - `timeline` (text) — optional
  - `preferred_contact` (text) — optional
  - `status` (text, not null, default "new") — pipeline: new → contacted → qualified → proposal → won/lost
  - `notes` (text) — internal admin notes
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer` (text) — visit attribution
  - `created_at`, `updated_at` (timestamps)

2. Security
- Enable RLS on `leads`.
- INSERT: anyone (anon or authenticated) can submit a lead — public lead form.
- SELECT / UPDATE / DELETE: only authenticated (signed-in admin) users can view and manage leads.

3. Notes
- Indexes on `status` and `created_at` for the admin dashboard.
- A trigger keeps `updated_at` current on every update.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'contact' CHECK (type IN ('growth_call', 'contact')),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text,
  business_type text,
  service_area text,
  goals text,
  message text,
  budget text,
  timeline text,
  preferred_contact text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  notes text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_can_submit_leads" ON leads;
CREATE POLICY "public_can_submit_leads" ON leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_leads" ON leads;
CREATE POLICY "admin_select_leads" ON leads
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "admin_update_leads" ON leads;
CREATE POLICY "admin_update_leads" ON leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_leads" ON leads;
CREATE POLICY "admin_delete_leads" ON leads
FOR DELETE
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();