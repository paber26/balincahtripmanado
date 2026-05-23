import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/content
 * Reads content from Supabase normalized tables and returns a unified JSON object.
 * Falls back to local content.json if Supabase is unavailable.
 */
export default defineEventHandler(async () => {
  const supabase = useSupabase();

  if (supabase) {
    try {
      // Fetch all tables in parallel
      const [
        siteConfigResult,
        packagesResult,
        packageItemsResult,
        packageItineraryResult,
        galleryResult,
        packageGalleryResult,
        destinationsResult,
        testimonialsResult,
        faqsResult,
        reasonsResult,
      ] = await Promise.all([
        supabase.from('site_config').select('key, value').order('key'),
        supabase.from('packages').select('*').order('sort_order'),
        supabase.from('package_items').select('*').order('sort_order'),
        supabase.from('package_itinerary').select('*').order('sort_order'),
        supabase.from('gallery').select('*').order('sort_order'),
        supabase.from('package_gallery').select('*').order('sort_order'),
        supabase.from('destinations').select('*').order('sort_order'),
        supabase.from('testimonials').select('*').order('sort_order'),
        supabase.from('faqs').select('*').order('sort_order'),
        supabase.from('reasons').select('*').order('sort_order'),
      ]);

      // Check if tables exist (PGRST205 = table not found)
      const tablesMissing = [
        siteConfigResult, packagesResult, galleryResult, destinationsResult
      ].some(r => r.error?.code === 'PGRST205');

      if (tablesMissing) {
        console.warn('Multi-table schema not found. Falling back to configurations table or local file.');
        // Try legacy single-table fallback
        const { data: legacyData, error: legacyError } = await supabase
          .from('configurations')
          .select('content')
          .eq('key', 'balincah_content')
          .single();
        if (!legacyError && legacyData) return legacyData.content;
        throw new Error('No data source available');
      }

      // Check for other errors
      const errors = [
        siteConfigResult, packagesResult, packageItemsResult, packageItineraryResult,
        galleryResult, packageGalleryResult, destinationsResult, testimonialsResult,
        faqsResult, reasonsResult,
      ].filter(r => r.error && r.error.code !== 'PGRST116');

      if (errors.length > 0) {
        const err = errors[0].error;
        console.error('Supabase fetch error:', err?.message);
        throw new Error(err?.message || 'Supabase error');
      }

      // Build config map
      const configMap: Record<string, string> = {};
      for (const row of siteConfigResult.data || []) {
        configMap[row.key] = row.value ?? '';
      }

      // Group package sub-tables by package_id
      const packageItems = packageItemsResult.data || [];
      const packageItinerary = packageItineraryResult.data || [];
      const pkgGallery = packageGalleryResult.data || [];

      // Compose packages array
      const packages = (packagesResult.data || []).map((pkg: any) => {
        const items = packageItems.filter((i: any) => i.package_id === pkg.id);
        const itinerary = packageItinerary.filter((i: any) => i.package_id === pkg.id);
        const gallery = pkgGallery.filter((g: any) => g.package_id === pkg.id);

        return {
          id: pkg.id,
          name: pkg.name,
          desc: pkg.description,
          type: pkg.type,
          location: pkg.location,
          duration: pkg.duration,
          priceFrom: pkg.price_from,
          rating: Number(pkg.rating),
          featured: pkg.featured,
          image: pkg.image,
          location_detail: pkg.location_detail,
          facilities: items.filter((i: any) => i.type === 'facility').map((i: any) => i.text),
          exclusions: items.filter((i: any) => i.type === 'exclusion').map((i: any) => i.text),
          accommodations: items.filter((i: any) => i.type === 'accommodation').map((i: any) => i.text),
          policies: items.filter((i: any) => i.type === 'policy').map((i: any) => i.text),
          itinerary: itinerary.map((i: any) => ({ time: i.time, text: i.text })),
          gallery: gallery.map((g: any) => ({ title: g.title, desc: g.description, image: g.image })),
        };
      });

      // Compose unified content object (same shape as before)
      return {
        siteName: configMap.siteName ?? 'Balincah Trip Manado',
        tagline: configMap.tagline ?? '',
        whatsappE164: configMap.whatsappE164 ?? '',
        instagramHandle: configMap.instagramHandle ?? '',
        location: configMap.location ?? '',
        heroTitle: configMap.heroTitle ?? '',
        heroSubtitle: configMap.heroSubtitle ?? '',
        aboutText: configMap.aboutText ?? '',
        packages,
        gallery: (galleryResult.data || []).map((g: any) => ({
          title: g.title,
          desc: g.description,
          image: g.image,
        })),
        destinations: (destinationsResult.data || []).map((d: any) => ({
          name: d.name,
          desc: d.description,
          image: d.image,
        })),
        testimonials: (testimonialsResult.data || []).map((t: any) => ({
          quote: t.quote,
          by: t.author,
        })),
        faqs: (faqsResult.data || []).map((f: any) => ({
          q: f.question,
          a: f.answer,
        })),
        reasons: (reasonsResult.data || []).map((r: any) => r.text),
      };
    } catch (err: any) {
      console.error('Supabase error, falling back to local content.json:', err?.message || err);
    }
  }

  // Local fallback
  try {
    const localPath = path.join(process.cwd(), 'public', 'content', 'content.json');
    const localContent = await fs.readFile(localPath, 'utf-8');
    return JSON.parse(localContent);
  } catch (err) {
    console.error('Failed to read local fallback content.json:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve website content.',
    });
  }
});
