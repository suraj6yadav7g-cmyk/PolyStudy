import React from 'react';
import { ShieldCheck, FileText, ChevronLeft, HelpCircle } from 'lucide-react';
import { LegalPage as LegalPageType, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';

interface LegalPageProps {
  pageType: 'about' | 'privacy' | 'terms' | 'disclaimer';
  pages: LegalPageType[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  pageType,
  pages,
  settings,
  onNavigate,
}) => {
  const page = pages.find((p) => p.page_type === pageType);

  const fallbackTitles: Record<string, string> = {
    about: 'About PolyStudy',
    privacy: 'Privacy Policy',
    terms: 'Terms and Conditions',
    disclaimer: 'Educational Disclaimer',
  };

  const title = page?.title || fallbackTitles[pageType];
  const content = page?.content || 'Content is being updated by the administrator.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{title}</span>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last revised: {page ? new Date(page.updated_at).toLocaleDateString() : 'September 2026'} · PolyStudy Platform
        </p>
      </div>

      {/* Main Formatted Legal Text */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs prose prose-slate max-w-none text-sm leading-relaxed">
        {content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-base font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={index} className="list-disc pl-5 my-3 space-y-1 text-slate-700">
                {items.map((it, i) => (
                  <li key={i}>{it.replace(/^- /, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="text-slate-700 my-3">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* AdSense slot */}
      <AdSenseBanner slot="before_footer" settings={settings} />
    </div>
  );
};
