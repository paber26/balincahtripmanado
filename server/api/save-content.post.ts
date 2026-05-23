import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No JSON body received',
    });
  }

  const contentPath = path.join(process.cwd(), 'public', 'content', 'content.json');

  // Verify and write to file
  await fs.writeFile(contentPath, JSON.stringify(body, null, 2), 'utf-8');

  return {
    success: true,
  };
});
