import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const supabase = useSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('content')
        .eq('key', 'balincah_content')
        .single();

      if (!error && data) {
        return data.content;
      }

      console.warn(
        'Could not fetch configuration from Supabase (row might be missing or table not created). Falling back to local content.json. Error:',
        error?.message
      );
    } catch (err) {
      console.error('Supabase query error, falling back to local content.json:', err);
    }
  }

  // Local fallback: read file from public/content/content.json
  try {
    const localPath = path.join(process.cwd(), 'public', 'content', 'content.json');
    const localContent = await fs.readFile(localPath, 'utf-8');
    return JSON.parse(localContent);
  } catch (err) {
    console.error('Failed to read local fallback content.json:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve website content from both Supabase and local fallback files.',
    });
  }
});
