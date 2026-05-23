import { promises as fs } from 'fs';
import path from 'path';

/**
 * POST /api/save-content
 * Saves the full content JSON into normalized Supabase tables.
 * Falls back to local content.json if Supabase is unavailable.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'No JSON body received' });
  }

  const supabase = useSupabase();

  if (supabase) {
    try {
      const now = new Date().toISOString();

      // ── 1. site_config ────────────────────────────────────────
      const configKeys = [
        'siteName', 'tagline', 'whatsappE164', 'instagramHandle',
        'location', 'heroTitle', 'heroSubtitle', 'aboutText',
      ];
      const configRows = configKeys.map((key) => ({
        key,
        value: body[key] ?? '',
        updated_at: now,
      }));
      const { error: configErr } = await supabase
        .from('site_config')
        .upsert(configRows, { onConflict: 'key' });
      if (configErr) throw new Error('site_config: ' + configErr.message);

      // ── 2. gallery (global) ───────────────────────────────────
      const galleryItems: any[] = (body.gallery || []).map((g: any, i: number) => ({
        title: g.title ?? '',
        description: g.desc ?? '',
        image: g.image ?? '',
        sort_order: i,
      }));

      // Delete all and re-insert (simplest strategy for ordered lists)
      const { error: gallDelErr } = await supabase.from('gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (gallDelErr) throw new Error('gallery delete: ' + gallDelErr.message);
      if (galleryItems.length > 0) {
        const { error: gallInsErr } = await supabase.from('gallery').insert(galleryItems);
        if (gallInsErr) throw new Error('gallery insert: ' + gallInsErr.message);
      }

      // ── 3. destinations ───────────────────────────────────────
      const destItems: any[] = (body.destinations || []).map((d: any, i: number) => ({
        name: d.name ?? '',
        description: d.desc ?? '',
        image: d.image ?? '',
        sort_order: i,
      }));
      const { error: destDelErr } = await supabase.from('destinations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (destDelErr) throw new Error('destinations delete: ' + destDelErr.message);
      if (destItems.length > 0) {
        const { error: destInsErr } = await supabase.from('destinations').insert(destItems);
        if (destInsErr) throw new Error('destinations insert: ' + destInsErr.message);
      }

      // ── 4. testimonials ───────────────────────────────────────
      const testimonialItems: any[] = (body.testimonials || []).map((t: any, i: number) => ({
        quote: t.quote ?? '',
        author: t.by ?? '',
        sort_order: i,
      }));
      const { error: testDelErr } = await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (testDelErr) throw new Error('testimonials delete: ' + testDelErr.message);
      if (testimonialItems.length > 0) {
        const { error: testInsErr } = await supabase.from('testimonials').insert(testimonialItems);
        if (testInsErr) throw new Error('testimonials insert: ' + testInsErr.message);
      }

      // ── 5. faqs ───────────────────────────────────────────────
      const faqItems: any[] = (body.faqs || []).map((f: any, i: number) => ({
        question: f.q ?? '',
        answer: f.a ?? '',
        sort_order: i,
      }));
      const { error: faqDelErr } = await supabase.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (faqDelErr) throw new Error('faqs delete: ' + faqDelErr.message);
      if (faqItems.length > 0) {
        const { error: faqInsErr } = await supabase.from('faqs').insert(faqItems);
        if (faqInsErr) throw new Error('faqs insert: ' + faqInsErr.message);
      }

      // ── 6. reasons ────────────────────────────────────────────
      const reasonItems: any[] = (body.reasons || []).map((r: any, i: number) => ({
        text: typeof r === 'string' ? r : (r.text ?? ''),
        sort_order: i,
      }));
      const { error: reasonDelErr } = await supabase.from('reasons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (reasonDelErr) throw new Error('reasons delete: ' + reasonDelErr.message);
      if (reasonItems.length > 0) {
        const { error: reasonInsErr } = await supabase.from('reasons').insert(reasonItems);
        if (reasonInsErr) throw new Error('reasons insert: ' + reasonInsErr.message);
      }

      // ── 7. packages + sub-tables ──────────────────────────────
      const packages: any[] = body.packages || [];

      // Delete all existing packages (cascade deletes sub-tables via FK)
      const { error: pkgDelErr } = await supabase.from('packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (pkgDelErr) throw new Error('packages delete: ' + pkgDelErr.message);

      for (let i = 0; i < packages.length; i++) {
        const pkg = packages[i];

        // Insert package row
        const { data: pkgRow, error: pkgInsErr } = await supabase
          .from('packages')
          .insert({
            name: pkg.name ?? '',
            description: pkg.desc ?? '',
            type: pkg.type ?? '',
            location: pkg.location ?? '',
            duration: pkg.duration ?? '',
            price_from: pkg.priceFrom ?? 0,
            rating: pkg.rating ?? 5.0,
            featured: pkg.featured ?? false,
            image: pkg.image ?? '',
            location_detail: pkg.location_detail ?? '',
            sort_order: i,
            updated_at: now,
          })
          .select('id')
          .single();

        if (pkgInsErr || !pkgRow) throw new Error(`package[${i}] insert: ` + pkgInsErr?.message);
        const pkgId = pkgRow.id;

        // Build package_items rows
        const itemRows: any[] = [
          ...(pkg.facilities || []).map((t: string, idx: number) => ({ package_id: pkgId, type: 'facility', text: t, sort_order: idx })),
          ...(pkg.exclusions || []).map((t: string, idx: number) => ({ package_id: pkgId, type: 'exclusion', text: t, sort_order: idx })),
          ...(pkg.accommodations || []).map((t: string, idx: number) => ({ package_id: pkgId, type: 'accommodation', text: t, sort_order: idx })),
          ...(pkg.policies || []).map((t: string, idx: number) => ({ package_id: pkgId, type: 'policy', text: t, sort_order: idx })),
        ];
        if (itemRows.length > 0) {
          const { error: itemsErr } = await supabase.from('package_items').insert(itemRows);
          if (itemsErr) throw new Error(`package_items[${i}]: ` + itemsErr.message);
        }

        // Build package_itinerary rows
        const itineraryRows: any[] = (pkg.itinerary || []).map((it: any, idx: number) => ({
          package_id: pkgId,
          time: it.time ?? '',
          text: it.text ?? '',
          sort_order: idx,
        }));
        if (itineraryRows.length > 0) {
          const { error: itinErr } = await supabase.from('package_itinerary').insert(itineraryRows);
          if (itinErr) throw new Error(`package_itinerary[${i}]: ` + itinErr.message);
        }

        // Build package_gallery rows
        const pgalleryRows: any[] = (pkg.gallery || []).map((g: any, idx: number) => ({
          package_id: pkgId,
          title: g.title ?? '',
          description: g.desc ?? '',
          image: g.image ?? '',
          sort_order: idx,
        }));
        if (pgalleryRows.length > 0) {
          const { error: pgallErr } = await supabase.from('package_gallery').insert(pgalleryRows);
          if (pgallErr) throw new Error(`package_gallery[${i}]: ` + pgallErr.message);
        }
      }

      // ── 8. Also update legacy configurations table as backup ──
      await supabase.from('configurations').upsert(
        { key: 'balincah_content', content: body, updated_at: now },
        { onConflict: 'key' }
      );

      return { success: true, source: 'supabase' };
    } catch (err: any) {
      console.error('Failed to save to Supabase multi-table. Error:', err.message || err);
      // Fall through to local save
    }
  }

  // Local fallback
  try {
    const contentPath = path.join(process.cwd(), 'public', 'content', 'content.json');
    await fs.writeFile(contentPath, JSON.stringify(body, null, 2), 'utf-8');
    return { success: true, source: 'local' };
  } catch (err) {
    console.error('Failed to write local fallback content.json:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save website content.',
    });
  }
});
