// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "he",
  fallbackLng: false, // ❌ אין fallback
  resources: {},      // נטען דינאמית דרך LangProvider
  interpolation: {
    escapeValue: false, // לא נדרש בריאקט
  },
  debug: false,
});

export default i18n;
