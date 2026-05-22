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
      ],
    },
  },
  runtimeConfig: {
    public: {
      contentUrl: "/content/content.json"
    }
  }
});

