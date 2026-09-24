import React from 'react';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Search,
  FolderOpen
} from 'lucide-react';
import { Subject, PDFMaterial, NoteMaterial, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { generatePolytechnicPDFBlob, downloadBlobAsFile } from '../lib/pdf-generator';

interface HomePageProps {
  subjects: Subject[];
  pdfs: PDFMaterial[];
  notes: NoteMaterial[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
  onSelectPdf: (pdf: PDFMaterial) => void;
  onSelectNote: (note: NoteMaterial) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  subjects,
  pdfs,
  notes,
  settings,
  onNavigate,
  onSelectPdf,
  onSelectNote,
  onOpenSearch,
}) => {
  // Published only
  const publishedSubjects = subjects
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  const publishedPdfs = pdfs.filter((p) => p.status === 'published');
  const publishedNotes = notes.filter((n) => n.status === 'published');

  const featuredPdfs = publishedPdfs.filter((p) => p.is_featured);
  const recentPdfs = [...publishedPdfs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6);

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
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200/80 pt-10 pb-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100/70 border border-indigo-200/60 rounded-md text-xs font-semibold text-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Polytechnic Diploma Academic Repository · 2026 Curriculum</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
                All Your Polytechnic Study Material in One Place
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Find notes, PDFs, important questions and study material for your diploma studies.
                Organized systematically by subjects, units, and technical examination boards.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/subjects')}
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Subjects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/pdfs')}
                  className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Browse PDFs</span>
                </button>

                <button
                  onClick={onOpenSearch}
                  className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors hidden sm:flex items-center justify-center border border-slate-200"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/70 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct PDF Downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unit-Wise Solved Questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Free For Students</span>
                </div>
              </div>
            </div>

            {/* Right Educational Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-2xl p-2 shadow-xl border border-slate-200/90 overflow-hidden group">
                <img
                  src="/src/assets/images/hero_polytechnic_study_1790238832818.jpg"
                  alt="Polytechnic Diploma Engineering Study Illustration"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-16/9 object-cover rounded-xl group-hover:scale-101 transition-transform duration-300"
                />
                <div className="p-3 bg-white flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">PolyStudy Resource Hub</span>
                  <span className="text-indigo-600 font-medium font-mono tabular-nums">
                    {publishedSubjects.length} Subjects · {publishedPdfs.length} PDFs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSenseBanner slot="top_banner" settings={settings} />
      </div>

      {/* Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Polytechnic Diploma Subjects
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select your diploma engineering subject to access chapter PDFs, notes, and question banks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/subjects')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {publishedSubjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-800">Subjects will appear here soon.</h3>
            <p className="text-xs text-slate-400 mt-1">
              Admin can add subjects from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedSubjects.map((subject) => {
              const subjectPdfCount = publishedPdfs.filter((p) => p.subject_id === subject.id).length;
              const subjectNoteCount = publishedNotes.filter((n) => n.subject_id === subject.id).length;

              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Subject Image Thumbnail */}
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={subject.image_url || '/src/assets/images/thumb_engineering_math_1790238845271.jpg'}
                      alt={subject.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                      <span className="text-white text-xs font-semibold drop-shadow-xs">
                        Diploma Course
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {subject.description || 'Comprehensive syllabus-aligned lecture materials and solved diploma problems.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* Zero-Pill Metadata */}
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-mono tabular-nums font-semibold text-slate-700">
                          {subjectPdfCount}
                        </span>
                        <span>PDFs</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-700">
                          {subjectNoteCount}
                        </span>
                        <span>Notes</span>
                      </div>

                      <button
                        onClick={() => onNavigate(`/subjects/${subject.slug}`)}
                        className="px-3 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
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
      </section>

      {/* Mid-Content AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSenseBanner slot="mid_content" settings={settings} />
      </div>

      {/* Featured Material Section */}
      {featuredPdfs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Featured Study Materials
              </h2>
            </div>
            <span className="text-xs text-slate-500">Curated high-priority exam units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPdfs.slice(0, 3).map((pdf) => {
              const subject = subjects.find((s) => s.id === pdf.subject_id);
              return (
                <div
                  key={pdf.id}
                  className="bg-white rounded-xl border border-amber-200/70 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-2">
                      <span>Featured Pick</span>
                      <span className="font-mono text-slate-500">{pdf.file_size}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {pdf.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {subject?.name} · {pdf.chapter}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {pdf.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectPdf(pdf)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={(e) => handleDownload(pdf, e)}
                      className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Materials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Latest Study Material
            </h2>
            <p className="text-slate-600 text-xs mt-1">
              Recently uploaded lecture notes and examination PDFs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/pdfs')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentPdfs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">No study material available yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {recentPdfs.map((pdf) => {
              const subject = subjects.find((s) => s.id === pdf.subject_id);
              return (
                <div
                  key={pdf.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {pdf.title}
                      </h4>
                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{subject?.name || 'Polytechnic'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pdf.chapter}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{pdf.file_size}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(pdf.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onSelectPdf(pdf)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={(e) => handleDownload(pdf, e)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Before Footer AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSenseBanner slot="before_footer" settings={settings} />
      </div>
    </div>
  );
};
