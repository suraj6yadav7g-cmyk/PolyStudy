import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Upload,
  AlertTriangle,
  X,
  CheckCircle,
  FileCheck,
  Star
} from 'lucide-react';
import { PDFMaterial, Subject, PublishStatus } from '../types';
import { generateSlug } from '../lib/storage';
import { uploadFileToStorage } from '../lib/supabase';

interface AdminPDFsProps {
  pdfs: PDFMaterial[];
  subjects: Subject[];
  onSavePdf: (pdf: PDFMaterial) => void;
  onDeletePdf: (id: string) => void;
  onPreviewPdf: (pdf: PDFMaterial) => void;
}

export const AdminPDFs: React.FC<AdminPDFsProps> = ({
  pdfs,
  subjects,
  onSavePdf,
  onDeletePdf,
  onPreviewPdf,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDFMaterial | null>(null);
  const [pdfToDelete, setPdfToDelete] = useState<PDFMaterial | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [chapter, setChapter] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [tagsStr, setTagsStr] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>('published');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  const openCreateModal = () => {
    setEditingPdf(null);
    setTitle('');
    setSlug('');
    setSubjectId(subjects[0]?.id || '');
    setChapter('Unit 1');
    setDescription('');
    setFileUrl('/uploads/sample-curriculum.pdf');
    setFileSize('1.8 MB');
    setTagsStr('polytechnic, syllabus, notes');
    setIsFeatured(false);
    setStatus('published');
    setUploadProgress(null);
    setUploadFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (pdf: PDFMaterial) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setSlug(pdf.slug);
    setSubjectId(pdf.subject_id);
    setChapter(pdf.chapter);
    setDescription(pdf.description);
    setFileUrl(pdf.file_url);
    setFileSize(pdf.file_size);
    setTagsStr(pdf.tags?.join(', ') || '');
    setIsFeatured(!!pdf.is_featured);
    setStatus(pdf.status);
    setUploadProgress(null);
    setUploadFileName('');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPdf) {
      const existingSlugs = pdfs.map((p) => p.slug);
      setSlug(generateSlug(val, existingSlugs));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Validation Error: Please select a valid .pdf file.');
      return;
    }

    setUploadFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFileSize(sizeInMB);

    // Simulate real upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (!prev || prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const res = await uploadFileToStorage('pdfs', file);
      clearInterval(interval);
      setUploadProgress(100);
      setFileUrl(res.url || URL.createObjectURL(file));
      setTimeout(() => setUploadProgress(null), 1000);
    } catch {
      clearInterval(interval);
      setUploadProgress(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    const existingSlugs = pdfs
      .filter((p) => p.id !== editingPdf?.id)
      .map((p) => p.slug);

    const finalSlug = slug.trim() || generateSlug(title, existingSlugs);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const pdfData: PDFMaterial = {
      id: editingPdf ? editingPdf.id : 'pdf-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      slug: finalSlug,
      subject_id: subjectId,
      chapter: chapter.trim() || 'Unit 1',
      description: description.trim(),
      file_url: fileUrl || '/uploads/sample.pdf',
      file_size: fileSize,
      tags: tags,
      is_featured: isFeatured,
      status: status,
      download_count: editingPdf ? editingPdf.download_count : 0,
      created_at: editingPdf ? editingPdf.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSavePdf(pdfData);
    setIsModalOpen(false);
  };

  const toggleStatus = (pdf: PDFMaterial) => {
    const updated: PDFMaterial = {
      ...pdf,
      status: pdf.status === 'published' ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };
    onSavePdf(updated);
  };

  const toggleFeatured = (pdf: PDFMaterial) => {
    const updated: PDFMaterial = {
      ...pdf,
      is_featured: !pdf.is_featured,
      updated_at: new Date().toISOString(),
    };
    onSavePdf(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            PDF Document Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, update, feature, or publish diploma PDFs. Changes reflect instantly on the public website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload PDF</span>
        </button>
      </div>

      {/* PDFs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">PDF Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pdfs.map((pdf) => {
                const subject = subjects.find((s) => s.id === pdf.subject_id);
                return (
                  <tr key={pdf.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{pdf.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {subject?.name || 'Unknown'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{pdf.chapter}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {pdf.file_size}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(pdf)}
                        className={`text-xs font-semibold cursor-pointer ${
                          pdf.status === 'published'
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle publish status"
                      >
                        ● {pdf.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleFeatured(pdf)}
                        className={`p-1 rounded cursor-pointer ${
                          pdf.is_featured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title="Toggle featured status"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(pdf.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewPdf(pdf)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Preview PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(pdf)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPdfToDelete(pdf)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete PDF"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit PDF Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPdf ? 'Edit PDF Material' : 'Upload New Diploma PDF'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PDF Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Matrices – Unit 1 Complete Solved Theory"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-sans"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chapter / Unit
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Unit 1: Matrices"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Syllabus Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of theorems, definitions, and questions covered in this document..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              {/* PDF File Upload Zone */}
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    PDF Document File (.pdf only)
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {fileSize}
                  </span>
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />

                {uploadFileName && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{uploadFileName}</span>
                  </p>
                )}

                {uploadProgress !== null && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-indigo-600 font-mono text-right">
                      Uploading to storage: {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="matrices, algebra, determinants, diploma math"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PublishStatus)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Highlight in Featured Section</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs cursor-pointer"
                >
                  {editingPdf ? 'Save Changes' : 'Publish PDF to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {pdfToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete "{pdfToDelete.title}"?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure? Students will no longer be able to view or download this PDF document.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPdfToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePdf(pdfToDelete.id);
                  setPdfToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
