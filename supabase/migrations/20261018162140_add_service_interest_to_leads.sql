/*
# Add service interest to leads

1. Modified Tables
- `leads`
  - Added `service_interest` (text, nullable) — which Novaflo service the visitor
    is interested in, captured from the lead forms' new dropdown.

2. Security
- No policy changes; the column follows the existing table policies.

3. Notes
- Non-destructive: only adds a nullable column. Existing rows keep null.
*/

ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_interest text;