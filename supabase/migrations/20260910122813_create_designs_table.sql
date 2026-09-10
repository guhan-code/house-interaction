/*
# Create designs table for VR Building Customizer (single-tenant, no auth)

1. New Tables
- `designs`
- `id` (uuid, primary key)
- `name` (text, not null) — user-given name for the saved design
- `config` (jsonb, not null) — JSON of material/mesh choices per element
- `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `designs`.
- Allow anon + authenticated CRUD because the app is intentionally public/shared (no sign-in).
*/

CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  config jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_designs" ON designs;
CREATE POLICY "anon_select_designs" ON designs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_designs" ON designs;
CREATE POLICY "anon_insert_designs" ON designs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_designs" ON designs;
CREATE POLICY "anon_update_designs" ON designs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_designs" ON designs;
CREATE POLICY "anon_delete_designs" ON designs FOR DELETE
  TO anon, authenticated USING (true);
