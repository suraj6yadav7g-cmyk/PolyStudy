import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, FileText, Image as ImageIcon, BookOpen, ChevronRight, Tag } from 'lucide-react';
import { Subject, PDFMaterial, NoteMaterial } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  pdfs: PDFMaterial[];
  notes: NoteMaterial[];
  onSelectPdf: (pdf: PDFMaterial) => void;
  onSelectSubject: (slug: string) => void;
  onSelectNote: (note: NoteMaterial) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  pdfs,
  notes,
  onSelectPdf,
  onSelectSubject,
  onSelectNote,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'note' | 'subject'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedSubjectId('all');
      setTypeFilter('all');
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd+K or Ctrl+K to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();

    const matchedSubjects = (typeFilter === 'all' || typeFilter === 'subject')
      ? subjects.filter((s) => {
          if (s.status !== 'published') return false;
          if (!cleanQuery) return false;
          return (
            s.name.toLowerCase().includes(cleanQuery) ||
            s.description.toLowerCase().includes(cleanQuery) ||
            s.slug.toLowerCase().includes(cleanQuery)
          );
        })
      : [];

    const matchedPdfs = (typeFilter === 'all' || typeFilter === 'pdf')
      ? pdfs.filter((p) => {
          if (p.status !== 'published') return false;
          if (selectedSubjectId !== 'all' && p.subject_id !== selectedSubjectId) return false;
          if (!cleanQuery) return selectedSubjectId !== 'all';
          return (
            p.title.toLowerCase().includes(cleanQuery) ||
            p.chapter.toLowerCase().includes(cleanQuery) ||
            p.description.toLowerCase().includes(cleanQuery) ||
            p.tags?.some((t) => t.toLowerCase().includes(cleanQuery))
          );
        })
      : [];

    const matchedNotes = (typeFilter === 'all' || typeFilter === 'note')
      ? notes.filter((n) => {
          if (n.status !== 'published') return false;
          if (selectedSubjectId !== 'all' && n.subject_id !== selectedSubjectId) return false;
          if (!cleanQuery) return selectedSubjectId !== 'all';
          return (
            n.title.toLowerCase().includes(cleanQuery) ||
            n.chapter.toLowerCase().includes(cleanQuery) ||
            n.description.toLowerCase().includes(cleanQuery) ||
            n.tags?.some((t) => t.toLowerCase().includes(cleanQuery))
          );
        })
      : [];

    return {
      subjects: matchedSubjects,
      pdfs: matchedPdfs,
      notes: matchedNotes,
      totalCount: matchedSubjects.length + matchedPdfs.length + matchedNotes.length,
    };
  }, [query, selectedSubjectId, typeFilter, subjects, pdfs, notes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:pt-20">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, PDFs, notes, units, e.g. 'Matrices', 'Drawing', 'Physics'..."
            className="w-full text-base bg-transparent border-none outline-none placeholder:text-slate-400 text-slate-900 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-md">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('pdf')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'pdf'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PDFs
            </button>
            <button
              onClick={() => setTypeFilter('note')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'note'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setTypeFilter('subject')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'subject'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Subjects
            </button>
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query && selectedSubjectId === 'all' ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2.5 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                Type keywords to explore Polytechnic study material
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs">
                {['Matrices', 'Laser', 'Drawing Projections', 'Calculus', 'Corrosion', 'C Programming'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.totalCount === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm font-medium">No study materials matched "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for broader terms like "Unit 1", "Math", "Drawing", or reset filters.
              </p>
            </div>
          ) : (
            <>
              {/* Subjects Group */}
              {searchResults.subjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Subjects ({searchResults.subjects.length})
                  </h4>
                  <div className="space-y-1.5">
                    {searchResults.subjects.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onSelectSubject(sub.slug);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                              {sub.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-1">{sub.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs Group */}
              {searchResults.pdfs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    PDF Materials ({searchResults.pdfs.length})
                  </h4>
                  <div className="space-y-1.5">
                    {searchResults.pdfs.map((pdf) => {
                      const subject = subjects.find((s) => s.id === pdf.subject_id);
                      return (
                        <button
                          key={pdf.id}
                          onClick={() => {
                            onSelectPdf(pdf);
                            onClose();
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                                {pdf.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{subject?.name || 'Subject'}</span>
                                <span>·</span>
                                <span>{pdf.chapter}</span>
                                <span>·</span>
                                <span className="font-mono">{pdf.file_size}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 px-2 py-1 bg-indigo-50 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            View PDF
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes Group */}
              {searchResults.notes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Study Notes & Diagrams ({searchResults.notes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {searchResults.notes.map((note) => {
                      const subject = subjects.find((s) => s.id === note.subject_id);
                      return (
                        <button
                          key={note.id}
                          onClick={() => {
                            onSelectNote(note);
                            onClose();
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                                {note.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{subject?.name}</span>
                                <span>·</span>
                                <span>{note.chapter}</span>
                                <span>·</span>
                                <span>{note.images.length} Image{note.images.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-amber-700 px-2 py-1 bg-amber-50 rounded group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            View Notes
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <span>Global Search PolyStudy</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
