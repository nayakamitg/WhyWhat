import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi) // load translations via http
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n to react-i18next
  .init({
    supportedLngs: ["en", "hi"],
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: { useSuspense: false },
  });

export default i18n;
