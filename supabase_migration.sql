-- SQL Migration Script for FinSight Tables (Articles and Stocks)
-- Copy and paste this into the Supabase SQL Editor

-- Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    image_url TEXT NOT NULL,
    author_name TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    ticker_symbol TEXT
);

-- Create Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    change TEXT NOT NULL,
    change_percent TEXT NOT NULL,
    sector TEXT
);

-- Enable Row Level Security (optional but recommended)
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- Create Policies (Example: allow public read-only access)
-- CREATE POLICY "Public Access" ON articles FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON stocks FOR SELECT USING (true);
