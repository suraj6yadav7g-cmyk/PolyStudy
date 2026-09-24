import React from 'react';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Plus,
  Eye,
  TrendingUp,
  FolderPlus,
  FilePlus,
  CheckCircle,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { Subject, PDFMaterial, NoteMaterial, SiteSettings } from '../types';

interface AdminDashboardProps {
  subjects: Subject[];
  pdfs: PDFMaterial[];
  notes: NoteMaterial[];
  settings: SiteSettings;
  onNavigateTab: (tab: string) => void;
  onOpenAddSubject: () => void;
  onOpenAddPdf: () => void;
  onOpenAddNote: () => void;
  onSelectPdf: (pdf: PDFMaterial) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  subjects,
  pdfs,
  notes,
  settings,
  onNavigateTab,
  onOpenAddSubject,
  onOpenAddPdf,
  onOpenAddNote,
  onSelectPdf,
}) => {
  // Metric calculations
  const totalSubjects = subjects.length;
  const totalPdfs = pdfs.length;
  const totalNotes = notes.length;

  const totalImages = notes.reduce(
    (acc, note) => acc + (note.images?.length || 0),
    0
  );

  const publishedMaterialsCount =
    subjects.filter((s) => s.status === 'published').length +
    pdfs.filter((p) => p.status === 'published').length +
    notes.filter((n) => n.status === 'published').length;

  const draftMaterialsCount =
    subjects.filter((s) => s.status === 'draft').length +
    pdfs.filter((p) => p.status === 'draft').length +
    notes.filter((n) => n.status === 'draft').length;

  // Recent materials
  const recentPdfs = [...pdfs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Curriculum Administration Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your polytechnic subjects, upload chapter PDFs, update formulas, and configure site monetizations.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddSubject}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Add Subject</span>
          </button>
          <button
            onClick={onOpenAddPdf}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>+ Add PDF</span>
          </button>
          <button
            onClick={onOpenAddNote}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Note</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid - Zero-pill discipline & tabular numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Subjects</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalSubjects}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Diploma Courses</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total PDFs</span>
            <FileText className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalPdfs}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Curriculum Documents</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Notes</span>
            <ImageIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalNotes}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lecture Summaries</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Note Images</span>
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalImages}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Diagrams & Sheets</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {publishedMaterialsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live on Website</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Drafts</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-600 font-mono tabular-nums">
            {draftMaterialsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Unpublished Items</p>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Uploads & Revisions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest items saved into the shared database.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('pdfs')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Manage All PDFs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPdfs.map((pdf) => {
                const subject = subjects.find((s) => s.id === pdf.subject_id);
                return (
                  <tr key={pdf.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {pdf.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {subject?.name || 'Unknown'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{pdf.chapter}</td>
                    <td className="py-3.5 px-4 font-mono">{pdf.file_size}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block font-semibold ${
                          pdf.status === 'published'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        ● {pdf.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(pdf.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectPdf(pdf)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Connection Status Card */}
      <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950">
              Database Persistence Status: Active & Operational
            </h3>
            <p className="text-xs text-indigo-900/70 mt-0.5">
              The public site and admin console are synchronized. Any subject, PDF, or note created in this admin console immediately appears on the live public site.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('settings')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          View Supabase SQL & Settings
        </button>
      </div>
    </div>
  );
};
