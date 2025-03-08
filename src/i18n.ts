import i18n from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    lng: "zh-CN",
    fallbackLng: "en",
    cache: {
      enabled: true,
    },
    initImmediate: true,
    maxRetries: 1,
    react: {
      useSuspense: true,
      bindI18n: "languageChanged loaded",
    },
    cleanCode: true,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    returnedObjectHandler: (key, value, options) => {
      return JSON.stringify({ key, value, options });
    },
    backend: {
      loadPath: `${import.meta.env.VITE_API_HOST}/locales/{{lng}}/{{ns}}`,
    },
  })
  .catch(() => {
    console.error("Failed to initialize i18n");
  });

export default i18n;
