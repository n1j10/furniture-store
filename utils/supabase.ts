import { createClient } from '@supabase/supabase-js';

const bucket = 'furnature-storage';

export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);


export const uploadImage = async (image: File) => {

    const timeTamp = Date.now();
    // Sanitize the client-supplied filename to avoid path tricks in storage keys
    const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100);
    const newName = `${timeTamp}-${safeName}`;

    const { data, error } = await supabase
        .storage.from(bucket)
        .upload(newName, image, { cacheControl: '3600' });

    if (error || !data) throw new Error('Image upload failed');
    
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;

};


export const deleteImage = (url: string) => {
  const imageName =decodeURIComponent(url.split('/').pop() as string);   //decodeURIComponent to remove image from supabase storage

  if (!imageName) throw new Error('Invalid URL');
  return supabase.storage.from(bucket).remove([imageName]);
};
 