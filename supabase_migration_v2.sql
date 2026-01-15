-- SQL Migration Script for FinSight - Finance Blogging & Market News Platform
-- Optimized for SEO, Scalability, and Performance
-- Copy and paste this into the Supabase SQL Editor

-- 1. Create Categories Table for strict typing and better indexing
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 2. Create Subcategories Table
CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    UNIQUE(category_id, name)
);

-- 3. Create Articles Table with SEO and Author fields
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL, -- Supports HTML content
    
    -- Category relationships
    category_id INTEGER REFERENCES categories(id),
    subcategory_id INTEGER REFERENCES subcategories(id),
    
    -- Display/Content Fields
    image_url TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_image_url TEXT,
    
    -- Metadata & Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Editorial Flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    
    -- SEO Metadata
    meta_title TEXT,
    meta_description TEXT,
    
    -- Indexing for performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Stocks Table for Market Analysis
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    change TEXT NOT NULL,
    change_percent TEXT NOT NULL,
    sector TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Seed Initial Categories
INSERT INTO categories (name, slug) VALUES 
('Market News', 'market-news'),
('Cryptocurrency', 'cryptocurrency'),
('Analysis', 'analysis'),
('Personal Finance', 'personal-finance'),
('Market Segments', 'market-segments')
ON CONFLICT (name) DO NOTHING;

-- 6. Seed Market Segments Subcategories
DO $$
DECLARE
    market_segments_id INTEGER;
BEGIN
    SELECT id INTO market_segments_id FROM categories WHERE slug = 'market-segments';
    
    INSERT INTO subcategories (category_id, name, slug) VALUES 
    (market_segments_id, 'Bulk / Block Deals', 'bulk-block-deals'),
    (market_segments_id, 'Large Cap', 'large-cap'),
    (market_segments_id, 'Mid Cap', 'mid-cap'),
    (market_segments_id, 'Micro Cap', 'micro-cap'),
    (market_segments_id, 'Penny Stocks', 'penny-stocks'),
    (market_segments_id, 'Results / Earnings', 'results-earnings'),
    (market_segments_id, 'FPO', 'fpo'),
    (market_segments_id, 'IPO Analysis', 'ipo-analysis'),
    (market_segments_id, 'Technical Analysis', 'technical-analysis'),
    (market_segments_id, 'Corporate Actions', 'corporate-actions'),
    (market_segments_id, 'Stock Ideas', 'stock-ideas'),
    (market_segments_id, 'Recent Orders', 'recent-orders')
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_editor_pick ON articles(is_editor_pick) WHERE is_editor_pick = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_subcategory ON articles(subcategory_id);

-- 8. Enable Search (Basic text search indexing)
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN (to_tsvector('english', title || ' ' || summary || ' ' || content));
