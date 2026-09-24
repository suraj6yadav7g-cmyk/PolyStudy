-- ==============================================================================
-- PolyStudy PostgreSQL & Supabase Database Schema
-- Complete Production-Ready Schema with Tables, RLS, Storage & Indexes
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for subjects
CREATE INDEX IF NOT EXISTS idx_subjects_slug ON public.subjects(slug);
CREATE INDEX IF NOT EXISTS idx_subjects_status ON public.subjects(status);
CREATE INDEX IF NOT EXISTS idx_subjects_display_order ON public.subjects(display_order);

-- 2. PDFS TABLE
CREATE TABLE IF NOT EXISTS public.pdfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter VARCHAR(100),
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size VARCHAR(50) DEFAULT '1.5 MB',
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    is_featured BOOLEAN DEFAULT false,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for pdfs
CREATE INDEX IF NOT EXISTS idx_pdfs_slug ON public.pdfs(slug);
CREATE INDEX IF NOT EXISTS idx_pdfs_subject_id ON public.pdfs(subject_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_status ON public.pdfs(status);
CREATE INDEX IF NOT EXISTS idx_pdfs_featured ON public.pdfs(is_featured);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter VARCHAR(100),
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_slug ON public.notes(slug);
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON public.notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_status ON public.notes(status);

-- 4. NOTE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.note_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_note_images_note_id ON public.note_images(note_id);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    site_name VARCHAR(100) NOT NULL DEFAULT 'PolyStudy',
    tagline VARCHAR(200) NOT NULL DEFAULT 'Study Smarter. Learn Better.',
    logo_url TEXT,
    favicon_url TEXT,
    description TEXT DEFAULT 'All Your Polytechnic Study Material in One Place.',
    contact_email VARCHAR(255) DEFAULT 'suraj6yadav7g@gmail.com',
    adsense_id VARCHAR(100),
    analytics_id VARCHAR(100),
    footer_text TEXT DEFAULT 'All rights reserved for diploma engineering students.',
    ads_enabled BOOLEAN DEFAULT true,
    ad_slots JSONB DEFAULT '{"top_banner": true, "mid_content": true, "sidebar": true, "before_footer": true}'::jsonb,
    social_links JSONB DEFAULT '{"telegram": "https://t.me/polystudy", "youtube": "https://youtube.com/@polystudy"}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. LEGAL PAGES TABLE
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type VARCHAR(50) NOT NULL UNIQUE CHECK (page_type IN ('about', 'privacy', 'terms', 'disclaimer')),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Public read policies for published contents
CREATE POLICY "Public read published subjects" ON public.subjects
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read published pdfs" ON public.pdfs
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read published notes" ON public.notes
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read note images" ON public.note_images
    FOR SELECT USING (true);

CREATE POLICY "Public read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Public read legal pages" ON public.legal_pages
    FOR SELECT USING (true);

-- Authenticated Admin full access
CREATE POLICY "Admins full access subjects" ON public.subjects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access pdfs" ON public.pdfs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access notes" ON public.notes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access note_images" ON public.note_images
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access site settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access legal pages" ON public.legal_pages
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
-- Execute in Supabase Storage SQL editor if using storage api:
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('subject-images', 'subject-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('note-images', 'note-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('website-assets', 'website-assets', true) ON CONFLICT DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Access To All Assets" ON storage.objects FOR SELECT USING (bucket_id IN ('pdfs', 'subject-images', 'note-images', 'website-assets'));
CREATE POLICY "Authenticated Users Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
