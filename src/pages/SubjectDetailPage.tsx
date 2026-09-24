import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Search,
  ChevronLeft,
  Calendar,
  Layers,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { Subject, PDFMaterial, NoteMaterial, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { generatePolytechnicPDFBlob, downloadBlobAsFile } from '../lib/pdf-generator';

interface SubjectDetailPageProps {
  slug: string;
  subjects: Subject[];
  pdfs: PDFMaterial[];
  notes: NoteMaterial[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
  onSelectPdf: (pdf: PDFMaterial) => void;
  onSelectNote: (note: NoteMaterial) => void;
}

export const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({
  slug,
  subjects,
  pdfs,
  notes,
  settings,
  onNavigate,
  onSelectPdf,
  onSelectNote,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'notes' | 'questions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');

  const subject = subjects.find((s) => s.slug === slug);

  // All materials related to this subject
  const subjectPdfs = useMemo(
    () => pdfs.filter((p) => p.subject_id === subject?.id && p.status === 'published'),
    [pdfs, subject]
  );

  const subjectNotes = useMemo(
    () => notes.filter((n) => n.subject_id === subject?.id && n.status === 'published'),
    [notes, subject]
  );

  // Extract unique chapters
  const availableChapters = useMemo(() => {
    const chapters = new Set<string>();
    subjectPdfs.forEach((p) => p.chapter && chapters.add(p.chapter));
    subjectNotes.forEach((n) => n.chapter && chapters.add(n.chapter));
    return Array.from(chapters);
  }, [subjectPdfs, subjectNotes]);

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Subject Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested diploma subject does not exist or has been removed.
        </p>
        <button
          onClick={() => onNavigate('/subjects')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
        >
          Back to All Subjects
        </button>
      </div>
    );
  }

  // Filtered PDFs
  const filteredPdfs = subjectPdfs.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchChap = selectedChapter === 'all' || p.chapter === selectedChapter;
    return matchQuery && matchChap;
  });

  // Filtered Notes
  const filteredNotes = subjectNotes.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
    const matchChap = selectedChapter === 'all' || n.chapter === selectedChapter;
    return matchQuery && matchChap;
  });

  const handleDownloadPdf = (pdf: PDFMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = generatePolytechnicPDFBlob({
      title: pdf.title,
      subjectName: subject.name,
      chapter: pdf.chapter,
      description: pdf.description,
    });
    downloadBlobAsFile(blob, `${pdf.slug}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate('/subjects')}
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{subject.name}</span>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 p-6 sm:p-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Diploma Curriculum Syllabus
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {subject.name}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              {subject.description || 'Full subject study materials, lecture summaries, practicals, and examination papers.'}
            </p>

            {/* Zero-Pill Counters */}
            <div className="flex items-center gap-4 pt-3 text-xs text-slate-500 font-medium border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {subjectPdfs.length}
                </span>
                <span>Available PDFs</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {subjectNotes.length}
                </span>
                <span>Lecture Notes & Diagrams</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {availableChapters.length}
                </span>
                <span>Curriculum Units</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 h-48 md:h-full min-h-[180px] bg-slate-100 relative overflow-hidden">
            <img
              src={subject.image_url || '/src/assets/images/thumb_engineering_math_1790238845271.jpg'}
              alt={subject.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* AdSense Top Slot */}
      <AdSenseBanner slot="top_banner" settings={settings} />

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Interactive Segmented Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Materials ({subjectPdfs.length + subjectNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            PDFs ({subjectPdfs.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Notes & Diagrams ({subjectNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Exam Questions
          </button>
        </div>

        {/* Search within subject and Chapter dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {availableChapters.length > 0 && (
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 w-full sm:w-auto outline-none focus:border-indigo-500"
            >
              <option value="all">All Units / Chapters</option>
              {availableChapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this subject..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {/* Important Questions Tab Spec */}
        {activeTab === 'questions' && (
          <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-6 mb-6">
            <h3 className="text-base font-bold text-indigo-950 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Frequently Repeated Polytechnic Board Questions ({subject.name})
            </h3>
            <p className="text-xs text-indigo-900/80 mb-4">
              Compiled from previous 5-year Diploma semester examinations for BTE / MSBTE / DTE curriculum.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                <div className="flex justify-between items-center text-xs font-semibold text-indigo-700 mb-1">
                  <span>Unit 1 Exam Target</span>
                  <span className="font-mono">10 Marks Question</span>
                </div>
                <p className="text-xs text-slate-800">
                  State fundamental theorems, write down mathematical derivations, and solve boundary condition numericals with standard step-wise notation.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                <div className="flex justify-between items-center text-xs font-semibold text-indigo-700 mb-1">
                  <span>Unit 2 Exam Target</span>
                  <span className="font-mono">5 Marks Question</span>
                </div>
                <p className="text-xs text-slate-800">
                  Draw labeled engineering schematic diagrams, state 3 practical workshop applications, and explain working principles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PDFs Section */}
        {(activeTab === 'all' || activeTab === 'pdf') && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pt-2">
              PDF Study Material ({filteredPdfs.length})
            </h2>

            {filteredPdfs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No PDFs found for the selected criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-slate-500">{pdf.file_size}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-3">
                        {pdf.title}
                      </h3>

                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {pdf.chapter}
                      </p>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {pdf.description}
                      </p>

                      {pdf.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {pdf.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {new Date(pdf.created_at).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectPdf(pdf)}
                          className="px-3 py-1.5 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </button>
                        <button
                          onClick={(e) => handleDownloadPdf(pdf, e)}
                          className="px-3 py-1.5 rounded-md text-white bg-slate-900 hover:bg-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes & Diagrams Section */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div className="space-y-3 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Lecture Notes & Diagrams ({filteredNotes.length})
            </h2>

            {filteredNotes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No lecture notes available yet for this subject.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {note.images.length} Image{note.images.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors mt-3">
                        {note.title}
                      </h3>

                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {note.chapter}
                      </p>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {note.description}
                      </p>

                      {/* Small preview of images */}
                      {note.images?.length > 0 && (
                        <div className="flex gap-2 mt-3 overflow-hidden">
                          {note.images.slice(0, 3).map((img, idx) => (
                            <div key={img.id || idx} className="w-16 h-12 rounded bg-slate-100 overflow-hidden border border-slate-200">
                              <img
                                src={img.image_url}
                                alt="Note thumbnail"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() => onSelectNote(note)}
                        className="px-3.5 py-1.5 rounded-md text-amber-800 bg-amber-50 hover:bg-amber-100 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Notes & Gallery</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Before Footer AdSense */}
      <AdSenseBanner slot="before_footer" settings={settings} />
    </div>
  );
};
