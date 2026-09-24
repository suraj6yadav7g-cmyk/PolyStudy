import React from 'react';
import { BookOpen, Send, Youtube, Github, Twitter } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {settings.site_name || 'PolyStudy'}
              </span>
            </div>
            <p className="text-indigo-300 text-sm font-medium">
              "{settings.tagline || 'Study Smarter. Learn Better.'}"
            </p>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {settings.description ||
                'Free, comprehensive, syllabus-aligned polytechnic and diploma engineering study materials, lecture notes, formula sheets, and past question papers.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.social_links?.telegram && (
                <a
                  href={settings.social_links.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.youtube && (
                <a
                  href={settings.social_links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.github && (
                <a
                  href={settings.social_links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.twitter && (
                <a
                  href={settings.social_links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Academic Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5">
              Study Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/subjects')}
                  className="hover:text-white transition-colors text-left"
                >
                  Diploma Subjects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pdfs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Engineering PDFs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/notes')}
                  className="hover:text-white transition-colors text-left"
                >
                  Lecture Notes & Diagrams
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5">
              Legal & Compliance
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms-and-conditions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Academic Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-indigo-400 transition-colors text-left text-xs text-slate-500 pt-2 block"
                >
                  Staff Admin Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {settings.site_name || 'PolyStudy'}. All rights reserved.</p>
          <p className="text-slate-500 text-center sm:text-right">
            {settings.footer_text || 'Curriculum notes for diploma engineering students.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
