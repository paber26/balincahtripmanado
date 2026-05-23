import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No multipart data received',
    });
  }

  // Find the file block
  const file = body.find((item) => item.name === 'file');
  if (!file || !file.filename || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded or file is empty',
    });
  }

  // Ensure it is an image
  if (file.type && !file.type.startsWith('image/')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only image files are allowed',
    });
  }

  // Generate safe unique filename
  const extension = path.extname(file.filename) || '.jpg';
  const basename = path.basename(file.filename, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${basename}-${Date.now()}${extension}`;

  const supabase = useSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(filename, file.data, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filename);

      return {
        success: true,
        url: publicUrl,
        source: 'supabase',
      };
    } catch (err: any) {
      console.error('Failed to upload to Supabase storage. Error:', err.message || err);
      // Fallback to local storage below
    }
  }

  // Local fallback: write to public/uploads/
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, file.data);

    return {
      success: true,
      url: `/uploads/${filename}`,
      source: 'local',
    };
  } catch (err) {
    console.error('Failed to write local fallback uploaded file:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to write uploaded image permanently on both Supabase and local filesystem.',
    });
  }
});
