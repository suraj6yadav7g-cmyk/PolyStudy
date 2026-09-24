export type PublishStatus = 'published' | 'draft';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface PDFMaterial {
  id: string;
  title: string;
  slug: string;
  subject_id: string;
  chapter: string;
  description: string;
  file_url: string;
  thumbnail_url?: string;
  file_size: string; // e.g. "2.4 MB"
  tags: string[];
  status: PublishStatus;
  is_featured?: boolean;
  download_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NoteImage {
  id: string;
  note_id: string;
  image_url: string;
  display_order: number;
  caption?: string;
}

export interface NoteMaterial {
  id: string;
  title: string;
  slug: string;
  subject_id: string;
  chapter: string;
  description: string;
  images: NoteImage[];
  tags: string[];
  status: PublishStatus;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url?: string;
  favicon_url?: string;
  description: string;
  contact_email: string;
  adsense_id?: string;
  analytics_id?: string;
  google_analytics_id?: string;
  footer_text: string;
  ads_enabled: boolean;
  ad_slots: {
    top_banner: boolean;
    mid_content: boolean;
    sidebar: boolean;
    before_footer: boolean;
  };
  social_links: {
    telegram?: string;
    youtube?: string;
    github?: string;
    twitter?: string;
  };
  updated_at: string;
}

export interface LegalPage {
  id: string;
  page_type: 'about' | 'privacy' | 'terms' | 'disclaimer';
  title: string;
  content: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  created_at: string;
}

export type MaterialType = 'all' | 'pdf' | 'note' | 'question_bank';
