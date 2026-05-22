import AOS from "aos";

export default defineNuxtPlugin(() => {
  AOS.init({
    duration: 900,
    once: true,
    offset: 60,
    easing: "ease-out-cubic",
  });

  const nuxtApp = useNuxtApp();
  nuxtApp.hook("page:finish", () => {
    AOS.refreshHard();
  });
});
