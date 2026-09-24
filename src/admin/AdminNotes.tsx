import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Upload,
  AlertTriangle,
  X,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { NoteMaterial, Subject, NoteImage, PublishStatus } from '../types';
import { generateSlug } from '../lib/storage';
import { uploadFileToStorage } from '../lib/supabase';

interface AdminNotesProps {
  notes: NoteMaterial[];
  subjects: Subject[];
  onSaveNote: (note: NoteMaterial) => void;
  onDeleteNote: (id: string) => void;
  onPreviewNote: (note: NoteMaterial) => void;
}

export const AdminNotes: React.FC<AdminNotesProps> = ({
  notes,
  subjects,
  onSaveNote,
  onDeleteNote,
  onPreviewNote,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteMaterial | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<NoteMaterial | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [chapter, setChapter] = useState('Unit 1');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [status, setStatus] = useState<PublishStatus>('published');
  const [images, setImages] = useState<NoteImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle('');
    setSlug('');
    setSubjectId(subjects[0]?.id || '');
    setChapter('Unit 1');
    setDescription('');
    setTagsStr('diagram, formula, notes');
    setStatus('published');
    setImages([
      {
        id: 'img-1',
        note_id: '',
        image_url: '/src/assets/images/thumb_engineering_math_1790238845271.jpg',
        caption: 'Engineering schematic diagram',
        display_order: 1,
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteMaterial) => {
    setEditingNote(note);
    setTitle(note.title);
    setSlug(note.slug);
    setSubjectId(note.subject_id);
    setChapter(note.chapter);
    setDescription(note.description);
    setTagsStr(note.tags?.join(', ') || '');
    setStatus(note.status);
    setImages(note.images || []);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingNote) {
      const existingSlugs = notes.map((n) => n.slug);
      setSlug(generateSlug(val, existingSlugs));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newImgs: NoteImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadFileToStorage('note-images', file);
        newImgs.push({
          id: 'img-' + Math.random().toString(36).substring(2, 9),
          note_id: editingNote?.id || '',
          image_url: res.url || URL.createObjectURL(file),
          caption: file.name.replace(/\.[^/.]+$/, ''),
          display_order: images.length + i + 1,
        });
      } catch (err) {
        console.error(err);
      }
    }

    setImages((prev) => [...prev, ...newImgs]);
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, caption } : img))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    const existingSlugs = notes
      .filter((n) => n.id !== editingNote?.id)
      .map((n) => n.slug);

    const finalSlug = slug.trim() || generateSlug(title, existingSlugs);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const noteData: NoteMaterial = {
      id: editingNote ? editingNote.id : 'note-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      slug: finalSlug,
      subject_id: subjectId,
      chapter: chapter.trim() || 'Unit 1',
      description: description.trim(),
      images: images,
      tags: tags,
      status: status,
      created_at: editingNote ? editingNote.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSaveNote(noteData);
    setIsModalOpen(false);
  };

  const toggleStatus = (note: NoteMaterial) => {
    const updated: NoteMaterial = {
      ...note,
      status: note.status === 'published' ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };
    onSaveNote(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notes & Diagram Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create visual lecture notes, upload multi-image engineering diagrams, and assign chapters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Note</span>
        </button>
      </div>

      {/* Notes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Note Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Images</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notes.map((note) => {
                const subject = subjects.find((s) => s.id === note.subject_id);
                return (
                  <tr key={note.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{note.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {subject?.name || 'Unknown'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{note.chapter}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {note.images?.length || 0} Image{note.images?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(note)}
                        className={`text-xs font-semibold cursor-pointer ${
                          note.status === 'published'
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle publish status"
                      >
                        ● {note.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewNote(note)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Preview Lightbox"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(note)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setNoteToDelete(note)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Note"
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

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingNote ? 'Edit Note' : 'Add New Lecture Note & Diagrams'}
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
                  Note Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Laser Pumping Principles & Resonator Optics"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
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
                    placeholder="e.g. Unit 3: Optics & Modern Physics"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Study Overview
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of formulas and diagrams included..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              {/* Multi-Image Upload Zone */}
              <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Diagrams & Note Images ({images.length})
                  </label>
                  <span className="text-[11px] text-slate-400">Multiple allowed</span>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                />

                {uploadingImage && (
                  <p className="text-xs text-indigo-600 font-medium">Uploading images...</p>
                )}

                {/* Uploaded image list */}
                {images.length > 0 && (
                  <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                    {images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200"
                      >
                        <img
                          src={img.image_url}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <input
                          type="text"
                          value={img.caption || ''}
                          onChange={(e) => updateCaption(idx, e.target.value)}
                          placeholder="Image label / caption..."
                          className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
                  placeholder="lasers, ruby laser, he-ne laser, diagrams"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
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
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete "{noteToDelete.title}"?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure? This note and all attached diagrams will be permanently removed.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setNoteToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteNote(noteToDelete.id);
                  setNoteToDelete(null);
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
