-- SQL to enable RLS and allow anonymous access for FinSight tables
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- 2. Create Public Read Access Policies (Allow anonymous fetching)
CREATE POLICY "Allow public read access for articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access for subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Allow public read access for stocks" ON stocks FOR SELECT USING (true);

-- 3. Note on Write Access
-- By default, no one can write (Insert/Update/Delete) without a policy.
-- Authenticated admins will need separate policies for writing content.
