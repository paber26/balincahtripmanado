type TourPackage = {
  name?: string;
  desc?: string;
  facilities?: string[];
  type?: "open_trip" | "private_trip" | "charter" | "snorkeling" | "diving" | "island_hopping" | "other";
  location?: string;
  duration?: string;
  priceFrom?: number;
  rating?: number;
  featured?: boolean;
  image?: string;
  gallery?: string[];
  videoEmbedUrl?: string;
};

export type SiteContent = {
  siteName?: string;
  tagline?: string;
  whatsappE164?: string;
  instagramHandle?: string;
  location?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  packages?: TourPackage[];
  destinations?: { name?: string; desc?: string; image?: string }[];
  gallery?: { title?: string; desc?: string; image?: string }[];
  itinerary?: { time?: string; text?: string }[];
  reasons?: string[];
  testimonials?: { quote?: string; by?: string }[];
  faqs?: { q?: string; a?: string }[];
  instagram?: {
    photos?: { image: string; postUrl?: string; caption?: string }[];
    videos?: { embedUrl: string; postUrl?: string; title?: string }[];
  };
};

export function useContent() {
  const config = useRuntimeConfig();
  return useFetch<SiteContent>(config.public.contentUrl, { default: () => ({}) });
}

