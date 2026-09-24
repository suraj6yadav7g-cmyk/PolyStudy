import React, { useState } from 'react';
import { Scale, Save, CheckCircle2, FileText } from 'lucide-react';
import { LegalPage } from '../types';

interface AdminLegalProps {
  pages: LegalPage[];
  onSavePage: (page: LegalPage) => void;
}

export const AdminLegal: React.FC<AdminLegalProps> = ({
  pages,
  onSavePage,
}) => {
  const [selectedType, setSelectedType] = useState<'about' | 'privacy' | 'terms' | 'disclaimer'>('about');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentPage = pages.find((p) => p.page_type === selectedType) || {
    id: 'legal-' + selectedType,
    page_type: selectedType,
    title: selectedType.toUpperCase(),
    content: '',
    updated_at: new Date().toISOString(),
  };

  const [title, setTitle] = useState(currentPage.title);
  const [content, setContent] = useState(currentPage.content);

  const handleSelectTab = (type: 'about' | 'privacy' | 'terms' | 'disclaimer') => {
    setSelectedType(type);
    const pg = pages.find((p) => p.page_type === type);
    if (pg) {
      setTitle(pg.title);
      setContent(pg.content);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPage: LegalPage = {
      ...currentPage,
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString(),
    };
    onSavePage(updatedPage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional & Legal Pages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update institutional policy documents required for student transparency and Google AdSense compliance.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Policy page saved!</span>
          </div>
        )}
      </div>

      {/* Page Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        {[
          { type: 'about', label: 'About PolyStudy' },
          { type: 'privacy', label: 'Privacy Policy' },
          { type: 'terms', label: 'Terms & Conditions' },
          { type: 'disclaimer', label: 'Academic Disclaimer' },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => handleSelectTab(item.type as any)}
            className={`pb-3 border-b-2 transition-colors ${
              selectedType === item.type
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Page Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Page Content (Supports Markdown format, headings, bullets)
            </label>
            <span className="text-[11px] text-slate-400">
              Last saved: {new Date(currentPage.updated_at).toLocaleDateString()}
            </span>
          </div>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:border-indigo-500 font-mono leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Legal Page</span>
          </button>
        </div>
      </form>
    </div>
  );
};
