import { createClient } from '@supabase/supabase-js';
import { compressImageToDataUrl } from './image-compress';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload helper that uploads to Supabase Storage if configured,
 * otherwise stores as data URL or public blob URL
 */
export async function uploadFileToStorage(
  bucket: 'pdfs' | 'subject-images' | 'note-images' | 'website-assets',
  file: File,
  path?: string
): Promise<{ url: string; error: string | null }> {
  const fileName = path || `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) {
        return { url: '', error: error.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      console.warn('Supabase upload failed, falling back to local object storage', err);
    }
  }

  // Fallback for preview / demo when Supabase credentials are not connected
  if (file.type.startsWith('image/')) {
    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 800, 600, 0.82);
      return { url: compressedDataUrl, error: null };
    } catch {
      // fallback to object URL
      return { url: URL.createObjectURL(file), error: null };
    }
  }

  return new Promise((resolve) => {
    // If it's a small document, convert to data URL so it persists
    if (file.size < 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, error: null });
      };
      reader.onerror = () => {
        resolve({ url: URL.createObjectURL(file), error: null });
      };
      reader.readAsDataURL(file);
    } else {
      resolve({ url: URL.createObjectURL(file), error: null });
    }
  });
}
