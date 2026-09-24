import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, FolderOpen, Layers } from 'lucide-react';
import { Subject, PDFMaterial, NoteMaterial, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';

interface SubjectsPageProps {
  subjects: Subject[];
  pdfs: PDFMaterial[];
  notes: NoteMaterial[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({
  subjects,
  pdfs,
  notes,
  settings,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const publishedSubjects = subjects
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  const filteredSubjects = publishedSubjects.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Curriculum Structure
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Diploma Engineering Subjects
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Browse through all polytechnic core engineering subjects. Click any subject to access complete unit PDFs, formulas, handwritten lecture notes, and question banks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter subjects..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* AdSense Top Slot */}
      <AdSenseBanner slot="top_banner" settings={settings} />

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {searchTerm ? `No subjects match "${searchTerm}"` : 'Subjects will appear here soon.'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm
              ? 'Try clearing your search term.'
              : 'Add new subjects in the Admin Panel to populate this list dynamically.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const subjectPdfs = pdfs.filter(
              (p) => p.subject_id === subject.id && p.status === 'published'
            );
            const subjectNotes = notes.filter(
              (n) => n.subject_id === subject.id && n.status === 'published'
            );

            return (
              <div
                key={subject.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img
                    src={subject.image_url || '/src/assets/images/thumb_engineering_math_1790238845271.jpg'}
                    alt={subject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                    <span className="text-white text-xs font-semibold drop-shadow-xs flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Engineering Branch Module
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h2>
                    <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {subject.description || 'Full curriculum notes, blueprints, and past papers.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Zero-Pill Metadata */}
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-mono tabular-nums font-semibold text-slate-700">
                        {subjectPdfs.length}
                      </span>
                      <span>PDFs</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700">
                        {subjectNotes.length}
                      </span>
                      <span>Notes</span>
                    </div>

                    <button
                      onClick={() => onNavigate(`/subjects/${subject.slug}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Material</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Before Footer AdSense */}
      <AdSenseBanner slot="before_footer" settings={settings} />
    </div>
  );
};
