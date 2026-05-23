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

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure directory exists
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, file.data);

  return {
    success: true,
    url: `/uploads/${filename}`,
  };
});
