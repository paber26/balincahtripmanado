export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["aos/dist/aos.css"],
  app: {
    head: {
      title: "Balincah Trip Manado",
      meta: [
        {
          name: "description",
          content:
            "Balincah Trip Manado — Open trip, private trip, snorkeling, diving, dan boat charter ke Bunaken, Nain, dan Siladen. Booking mudah via WhatsApp.",
        },
        { name: "theme-color", content: "#00AEEF" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap",
        },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon-180.png" }
      ],
    },
  },
  runtimeConfig: {
    public: {
      contentUrl: "/api/content"
    }
  }
});
