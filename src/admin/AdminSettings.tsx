import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Copy,
  Database,
  DollarSign,
  Globe,
  Share2,
  Check,
  Code2,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types';
import { copyToClipboard } from '../lib/clipboard';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<'general' | 'adsense' | 'social' | 'supabase'>('general');

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedSocialChange = (network: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [network]: val,
      },
    }));
  };

  const handleAdSlotChange = (slot: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ad_slots: {
        ...prev.ad_slots,
        [slot]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copySqlSchema = async () => {
    const sql = `-- PolyStudy Production Supabase PostgreSQL Schema
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 1,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chapter TEXT DEFAULT '',
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_size TEXT DEFAULT '1.0 MB',
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chapter TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.note_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  site_name TEXT DEFAULT 'PolyStudy',
  tagline TEXT DEFAULT 'Study Smarter. Learn Better.',
  description TEXT DEFAULT 'Polytechnic Engineering Notes & PDFs',
  contact_email TEXT DEFAULT 'suraj6yadav7g@gmail.com',
  footer_text TEXT DEFAULT 'Curriculum notes for diploma engineering students.',
  adsense_id TEXT DEFAULT 'ca-pub-0000000000000000',
  ads_enabled BOOLEAN DEFAULT TRUE,
  ad_slots JSONB DEFAULT '{"top_banner": true, "mid_content": true, "sidebar": true, "before_footer": true}'::jsonb,
  social_links JSONB DEFAULT '{"telegram": "https://t.me/polystudy", "youtube": "https://youtube.com/@polystudy"}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

    const success = await copyToClipboard(sql);
    if (success) {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Site Configuration & Monetization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update branding, AdSense ad codes, analytics, and Supabase database settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSettingsSection('general')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
            activeSettingsSection === 'general'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Branding & General</span>
        </button>
        <button
          onClick={() => setActiveSettingsSection('adsense')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
            activeSettingsSection === 'adsense'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Google AdSense Monetization</span>
        </button>
        <button
          onClick={() => setActiveSettingsSection('social')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
            activeSettingsSection === 'social'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Media Links</span>
        </button>
        <button
          onClick={() => setActiveSettingsSection('supabase')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
            activeSettingsSection === 'supabase'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Supabase SQL</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Branding */}
        {activeSettingsSection === 'general' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Website Identity & Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website Brand Name
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website Meta Description (SEO)
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  value={formData.google_analytics_id || ''}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={formData.footer_text}
                onChange={(e) => handleChange('footer_text', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Section 2: AdSense Monetization */}
        {activeSettingsSection === 'adsense' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Google AdSense Monetization Controls
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure publisher credentials and toggle ad slot banners across pages.
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ads_enabled}
                  onChange={(e) => handleChange('ads_enabled', e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Enable Ads Globally</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AdSense Publisher Client ID (ca-pub-...)
              </label>
              <input
                type="text"
                value={formData.adsense_id}
                onChange={(e) => handleChange('adsense_id', e.target.value)}
                placeholder="ca-pub-1234567890123456"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Supplied to the standard &lt;script&gt; and &lt;ins&gt; AdSense tags across the site.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Individual Page Ad Unit Placements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Top Header Banner
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Appears below hero and top nav (728x90 responsive)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ad_slots?.top_banner}
                    onChange={(e) => handleAdSlotChange('top_banner', e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Mid-Content In-Article Unit
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Appears between subjects & featured lists
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ad_slots?.mid_content}
                    onChange={(e) => handleAdSlotChange('mid_content', e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      PDF Viewer Sidebar Ad
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Appears inside the PDF reading sidebar
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ad_slots?.sidebar}
                    onChange={(e) => handleAdSlotChange('sidebar', e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Before Footer Unit
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Anchor unit placed above the website footer
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ad_slots?.before_footer}
                    onChange={(e) => handleAdSlotChange('before_footer', e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Social Links */}
        {activeSettingsSection === 'social' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Social Communities & Support Channels
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telegram Student Group / Channel Link
                </label>
                <input
                  type="url"
                  value={formData.social_links?.telegram || ''}
                  onChange={(e) => handleNestedSocialChange('telegram', e.target.value)}
                  placeholder="https://t.me/polystudy"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube Channel Link (Lecture series & tutorials)
                </label>
                <input
                  type="url"
                  value={formData.social_links?.youtube || ''}
                  onChange={(e) => handleNestedSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@polystudy"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Twitter / X Profile Link
                </label>
                <input
                  type="url"
                  value={formData.social_links?.twitter || ''}
                  onChange={(e) => handleNestedSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/polystudy"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  value={formData.social_links?.github || ''}
                  onChange={(e) => handleNestedSocialChange('github', e.target.value)}
                  placeholder="https://github.com/polystudy"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Supabase SQL & Architecture */}
        {activeSettingsSection === 'supabase' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Supabase PostgreSQL Schema & Live Data Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Production ready tables: subjects, pdfs, notes, note_images, site_settings, and legal_pages.
                </p>
              </div>

              <button
                type="button"
                onClick={copySqlSchema}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl overflow-hidden font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
              <pre>{`-- PolyStudy Production Tables
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 1,
  status TEXT DEFAULT 'published'
);

CREATE TABLE public.pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chapter TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'published'
);`}</pre>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900 leading-relaxed">
              <strong>Database Sync Note:</strong> All changes made right now in this admin panel are persistently saved in your environment via the local storage engine and will auto-synchronize to Supabase when <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are provided in <code>.env</code>.
            </div>
          </div>
        )}

        {/* Save Changes Floating Action Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
