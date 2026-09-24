import React, { useState, useMemo } from 'react';
import { FileText, Download, Eye, Search, Filter, BookOpen } from 'lucide-react';
import { PDFMaterial, Subject, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { generatePolytechnicPDFBlob, downloadBlobAsFile } from '../lib/pdf-generator';

interface PDFsPageProps {
  pdfs: PDFMaterial[];
  subjects: Subject[];
  settings: SiteSettings;
  onSelectPdf: (pdf: PDFMaterial) => void;
  onViewSubject: (slug: string) => void;
}

export const PDFsPage: React.FC<PDFsPageProps> = ({
  pdfs,
  subjects,
  settings,
  onSelectPdf,
  onViewSubject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'downloads' | 'title'>('recent');

  const publishedPdfs = pdfs.filter((p) => p.status === 'published');

  const filteredPdfs = useMemo(() => {
    return publishedPdfs
      .filter((pdf) => {
        const matchesSubject =
          selectedSubjectId === 'all' || pdf.subject_id === selectedSubjectId;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          pdf.title.toLowerCase().includes(q) ||
          pdf.chapter.toLowerCase().includes(q) ||
          pdf.description.toLowerCase().includes(q) ||
          pdf.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesSubject && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'downloads') {
          return (b.download_count || 0) - (a.download_count || 0);
        }
        return a.title.localeCompare(b.title);
      });
  }, [publishedPdfs, selectedSubjectId, searchTerm, sortBy]);

  const handleDownload = (pdf: PDFMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = subjects.find((s) => s.id === pdf.subject_id);
    const blob = generatePolytechnicPDFBlob({
      title: pdf.title,
      subjectName: subject?.name || 'Polytechnic Engineering',
      chapter: pdf.chapter,
      description: pdf.description,
    });
    downloadBlobAsFile(blob, `${pdf.slug}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Document Library
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Polytechnic Diploma PDF Notes & Guides
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Search, read directly inside your browser, or download official semester syllabus notes, unit question banks, and formulas in PDF format.
        </p>
      </div>

      {/* AdSense Top */}
      <AdSenseBanner slot="top_banner" settings={settings} />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PDF by title, unit, tag..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 flex-1 sm:flex-initial"
          >
            <option value="all">All Subjects ({publishedPdfs.length})</option>
            {subjects.map((sub) => {
              const count = publishedPdfs.filter((p) => p.subject_id === sub.id).length;
              return (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({count})
                </option>
              );
            })}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="recent">Most Recent</option>
            <option value="downloads">Most Downloaded</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* PDFs Grid */}
      {filteredPdfs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No PDF documents found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or subject selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map((pdf) => {
            const subject = subjects.find((s) => s.id === pdf.subject_id);
            return (
              <div
                key={pdf.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-500">{pdf.file_size}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {pdf.title}
                  </h3>

                  {subject && (
                    <button
                      onClick={() => onViewSubject(subject.slug)}
                      className="text-xs font-semibold text-indigo-600 hover:underline mt-1 text-left block"
                    >
                      {subject.name}
                    </button>
                  )}

                  <p className="text-xs text-slate-500 mt-0.5">{pdf.chapter}</p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {pdf.description}
                  </p>

                  {pdf.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pdf.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPdf(pdf)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={(e) => handleDownload(pdf, e)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
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
