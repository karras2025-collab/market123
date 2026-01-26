-- =====================================================
-- Digi Deal Marketplace - Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name TEXT DEFAULT 'Digi Deal',
    telegram_username TEXT DEFAULT 'RosaAlba_Prof',
    admin_password TEXT DEFAULT '',
    admin_password_hash TEXT DEFAULT '',
    banner_interval INTEGER DEFAULT 3000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id, store_name, telegram_username, banner_interval)
VALUES (1, 'Digi Deal', 'RosaAlba_Prof', 3000)
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'circle',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id),
    service TEXT,
    tags TEXT[] DEFAULT '{}',
    flow TEXT DEFAULT 'telegram_redirect',
    image_url TEXT,
    variants JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (with payment fields)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    telegram TEXT,
    items JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    total_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'RUB',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    hero_image_url TEXT,
    link_url TEXT,
    button_text TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access for store data
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);

-- Allow inserting orders (customers place orders)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow anonymous updates for admin operations (you may want to restrict this later)
CREATE POLICY "Allow all updates settings" ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow all updates categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all updates products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all updates orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all updates banners" ON banners FOR ALL USING (true);

-- =====================================================
-- STORAGE BUCKET (for product images)
-- =====================================================
-- Run this separately or in Supabase Dashboard → Storage

-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('products', 'products', true)
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- Done! Your database is ready.
-- =====================================================
