import { supabase } from './supabase';

const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'media';

/**
 * Upload a file to Supabase Storage and return the public URL.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

  const { error } = await supabase!.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    throw error;
  }

  const { data } = supabase!.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};
