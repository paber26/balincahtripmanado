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

  const supabase = useSupabase();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('configurations')
        .upsert(
          {
            key: 'balincah_content',
            content: body,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        source: 'supabase',
      };
    } catch (err: any) {
      console.error('Failed to save to Supabase configurations table. Error:', err.message || err);
      // Fallback to local save below
    }
  }

  // Local fallback: write to public/content/content.json
  try {
    const contentPath = path.join(process.cwd(), 'public', 'content', 'content.json');
    await fs.writeFile(contentPath, JSON.stringify(body, null, 2), 'utf-8');
    return {
      success: true,
      source: 'local',
    };
  } catch (err) {
    console.error('Failed to write local fallback content.json:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to write website content configuration permanently on both Supabase and local filesystem.',
    });
  }
});
