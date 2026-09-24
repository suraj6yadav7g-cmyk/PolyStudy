import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, Search, Eye, BookOpen, Layers } from 'lucide-react';
import { NoteMaterial, Subject, SiteSettings } from '../types';
import { AdSenseBanner } from '../components/AdSenseBanner';

interface NotesPageProps {
  notes: NoteMaterial[];
  subjects: Subject[];
  settings: SiteSettings;
  onSelectNote: (note: NoteMaterial) => void;
  onViewSubject: (slug: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  notes,
  subjects,
  settings,
  onSelectNote,
  onViewSubject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');

  const publishedNotes = notes.filter((n) => n.status === 'published');

  const filteredNotes = useMemo(() => {
    return publishedNotes.filter((note) => {
      const matchSubject =
        selectedSubjectId === 'all' || note.subject_id === selectedSubjectId;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.chapter.toLowerCase().includes(q) ||
        note.description.toLowerCase().includes(q) ||
        note.tags?.some((t) => t.toLowerCase().includes(q));

      return matchSubject && matchSearch;
    });
  }, [publishedNotes, selectedSubjectId, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Visual Notes & Diagrams
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Lecture Notes & Technical Diagrams
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Visual summaries, formulas, and high-resolution labeled engineering diagrams. Click any note card to open the interactive image gallery & zoom lightbox.
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
            placeholder="Search notes, diagrams, formula sheets..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 w-full sm:w-auto"
        >
          <option value="all">All Subjects ({publishedNotes.length})</option>
          {subjects.map((sub) => {
            const count = publishedNotes.filter((n) => n.subject_id === sub.id).length;
            return (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No notes found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const subject = subjects.find((s) => s.id === note.subject_id);
            const coverImage = note.images?.[0]?.image_url || '/src/assets/images/thumb_engineering_math_1790238845271.jpg';

            return (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Preview Banner */}
                  <div
                    onClick={() => onSelectNote(note)}
                    className="h-44 bg-slate-100 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={coverImage}
                      alt={note.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-xs font-semibold text-white">
                        {note.chapter}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                        {note.images.length} Image{note.images.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {subject && (
                      <button
                        onClick={() => onViewSubject(subject.slug)}
                        className="text-xs font-semibold text-indigo-600 hover:underline block text-left mb-1"
                      >
                        {subject.name}
                      </button>
                    )}

                    <h3
                      onClick={() => onSelectNote(note)}
                      className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug cursor-pointer"
                    >
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>

                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onSelectNote(note)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Lightbox</span>
                  </button>
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
