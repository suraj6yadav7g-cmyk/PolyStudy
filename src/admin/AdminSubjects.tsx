import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Upload,
  AlertTriangle,
  ExternalLink,
  ArrowUpDown,
  Sparkles,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import { Subject, PublishStatus } from '../types';
import { generateSlug } from '../lib/storage';
import { uploadFileToStorage } from '../lib/supabase';
import { copyToClipboard } from '../lib/clipboard';
import { compressImageToDataUrl } from '../lib/image-compress';

const PRESET_THUMBNAILS = [
  {
    name: 'Mathematics',
    url: '/src/assets/images/thumb_engineering_math_1790238845271.jpg',
    prompt: 'Professional educational textbook thumbnail for Engineering Mathematics diploma curriculum, featuring glowing 3D geometric polyhedrons, calculus integral symbols, matrix grids, golden ratio spirals, dark navy blue and royal purple high-tech backdrop, studio lighting, hyper-realistic, 16:9, no text'
  },
  {
    name: 'Physics',
    url: '/src/assets/images/thumb_engineering_physics_1790238857653.jpg',
    prompt: 'Modern educational textbook cover thumbnail for Engineering Physics diploma course, laser beams refracting through glass prism, electromagnetic wave spectrum, atomic nucleus orbit, deep indigo and neon emerald lighting, photorealistic, 16:9, no text'
  },
  {
    name: 'Chemistry',
    url: '/src/assets/images/thumb_eng_chemistry_1790239839384.jpg',
    prompt: 'Professional educational textbook thumbnail for Engineering Chemistry diploma curriculum, showing molecular structures, test tubes, crystal lattices, periodic table elements, clean modern flat vector and 3D glassmorphic science aesthetic, vibrant deep teal and navy blue background, high quality lighting, no text, crisp resolution'
  },
  {
    name: 'Engineering Drawing',
    url: '/src/assets/images/thumb_engineering_drawing_1790238871086.jpg',
    prompt: 'Clean technical blueprint thumbnail for Engineering Drawing diploma syllabus, mechanical drafting compass, isometric 3D CAD gears, architectural grid paper, precision drafting tools, royal blueprint blue and crisp white linework, 16:9, no text'
  },
  {
    name: 'Communication Skills',
    url: '/src/assets/images/thumb_comm_skills_1790239867663.jpg',
    prompt: 'Professional educational textbook thumbnail for Professional Communication Skills and Technical English, showing speech bubbles, open book, sound waves, global collaboration graphic elements, warm amber and violet modern geometric gradients, crisp minimal educational illustration, no text'
  },
  {
    name: 'Computer Fundamentals',
    url: '/src/assets/images/thumb_computer_fund_1790239853518.jpg',
    prompt: 'Professional educational textbook thumbnail for Computer Fundamentals and C Programming diploma curriculum, showing glowing circuit traces, code terminal brackets, CPU microchip, binary data streams, deep indigo and cyan cybernetic lighting, modern clean academic aesthetic, high definition, no text'
  },
];

interface AdminSubjectsProps {
  subjects: Subject[];
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onViewSubject: (slug: string) => void;
}

export const AdminSubjects: React.FC<AdminSubjectsProps> = ({
  subjects,
  onSaveSubject,
  onDeleteSubject,
  onViewSubject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState<PublishStatus>('published');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingSubject(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl(PRESET_THUMBNAILS[0].url);
    setDisplayOrder(subjects.length + 1);
    setStatus('published');
    setUploadFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setSlug(subject.slug);
    setDescription(subject.description);
    setImageUrl(subject.image_url);
    setDisplayOrder(subject.display_order);
    setStatus(subject.status);
    setUploadFeedback(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingSubject) {
      const existingSlugs = subjects.map((s) => s.slug);
      setSlug(generateSlug(val, existingSlugs));
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadFeedback(null);

    try {
      // First attempt fast client-side compression to lightweight DataURL
      const compressedDataUrl = await compressImageToDataUrl(file, 800, 600, 0.82);
      setImageUrl(compressedDataUrl);
      setUploadFeedback(`Uploaded & optimized (${Math.round(compressedDataUrl.length / 1024)} KB)`);
    } catch {
      // Fallback to FileReader directly
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageUrl(reader.result as string);
            setUploadFeedback('Image loaded successfully');
          }
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setUploadFeedback('Upload error: ' + (err?.message || 'Failed to read image file'));
      }
    } finally {
      setUploadingImage(false);
      // Reset input element so selecting same file again works
      e.target.value = '';
    }
  };

  const copyPromptText = async (prompt: string, idx: number) => {
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopiedPromptIndex(idx);
      setTimeout(() => setCopiedPromptIndex(null), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const existingSlugs = subjects
      .filter((s) => s.id !== editingSubject?.id)
      .map((s) => s.slug);

    const finalSlug = slug.trim() || generateSlug(name, existingSlugs);

    const subjectData: Subject = {
      id: editingSubject ? editingSubject.id : 'sub-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      image_url: imageUrl || '/src/assets/images/thumb_engineering_math_1790238845271.jpg',
      display_order: Number(displayOrder) || 1,
      status: status,
      created_at: editingSubject ? editingSubject.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSaveSubject(subjectData);
    setIsModalOpen(false);
  };

  const toggleStatus = (subject: Subject) => {
    const updated: Subject = {
      ...subject,
      status: subject.status === 'published' ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };
    onSaveSubject(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Subject Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, reorder, change thumbnails or publish polytechnic diploma curriculum subjects.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Thumbnail Prompts</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Subject</span>
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects
                .sort((a, b) => a.display_order - b.display_order)
                .map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-center text-slate-400">
                      {subject.display_order}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={subject.image_url}
                          alt=""
                          className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <span>{subject.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      /subjects/{subject.slug}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                      {subject.description}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(subject)}
                        className={`text-xs font-semibold cursor-pointer ${
                          subject.status === 'published'
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle publish state"
                      >
                        ● {subject.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewSubject(subject.slug)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(subject)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit subject"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSubjectToDelete(subject)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSubject ? 'Edit Subject' : 'Add New Polytechnic Subject'}
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
                  Subject Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Engineering Mathematics"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug (Auto-generated or custom)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="engineering-mathematics"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed overview of syllabus units covered in this subject..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publication Status
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
              </div>

              {/* Subject Thumbnail Image Selection & Customization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Subject Thumbnail Image
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPromptModalOpen(true)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>View AI Prompts</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  {/* Current Active Preview */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-200 shrink-0 shadow-xs">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRESET_THUMBNAILS[0].url;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        Active Thumbnail
                      </p>
                      <p className="text-[10px] text-slate-500 truncate font-mono">
                        {imageUrl || 'No image selected'}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-3 h-3 text-indigo-600" />
                          <span>{uploadingImage ? 'Processing...' : 'Upload Device File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        {uploadFeedback && (
                          <span className={`text-[10px] ${uploadFeedback.includes('error') ? 'text-rose-600' : 'text-emerald-600 font-medium'}`}>
                            {uploadFeedback}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct URL Input */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Paste Image URL (or Web Link):
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-mono text-slate-700"
                    />
                  </div>

                  {/* Instant Presets Selection */}
                  <div>
                    <p className="text-[11px] font-medium text-slate-600 mb-1.5">
                      Or pick from High-Quality Subject Presets:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_THUMBNAILS.map((preset) => {
                        const isSelected = imageUrl === preset.url;
                        return (
                          <button
                            type="button"
                            key={preset.name}
                            onClick={() => setImageUrl(preset.url)}
                            className={`group relative rounded-lg overflow-hidden border text-left transition-all ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                            title={`Select ${preset.name}`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-11 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="p-1 bg-white text-[9px] font-semibold text-slate-700 truncate">
                              {preset.name}
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Thumbnail Prompt Generator Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Subject Thumbnail AI Prompts Generator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Copy and paste these prompts into Midjourney, ChatGPT, Ideogram, or Gemini to create 4K diploma thumbnails
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                💡 <strong>Tip for Best Results:</strong> Use aspect ratio <strong>16:9</strong> with parameter <code>--no text</code> or <code>no text overlay</code> to keep the artwork modern, uncluttered, and readable on mobile devices.
              </div>

              {PRESET_THUMBNAILS.map((preset, idx) => (
                <div
                  key={preset.name}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={preset.url}
                        alt=""
                        className="w-10 h-7 rounded object-cover border border-slate-200"
                      />
                      <span className="font-bold text-xs text-slate-900">
                        {preset.name}
                      </span>
                    </div>

                    <button
                      onClick={() => copyPromptText(preset.prompt, idx)}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedPromptIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200/80 select-all leading-relaxed">
                    {preset.prompt}
                  </p>
                </div>
              ))}

              {/* Master Custom Formula */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Custom Subject Master Prompt Formula:</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-mono bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
                  "Professional educational 3D textbook cover thumbnail for [SUBJECT NAME] diploma polytechnic curriculum, featuring [KEY TOPICS / LAB INSTRUMENTS / DIAGRAMS], clean glassmorphic aesthetic, dark slate and vibrant cyan studio lighting, hyper-detailed, 16:9 aspect ratio, clean composition, no text"
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-2xs cursor-pointer"
              >
                Close Prompts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete "{subjectToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove this subject and all its associated material links?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSubjectToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteSubject(subjectToDelete.id);
                  setSubjectToDelete(null);
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
