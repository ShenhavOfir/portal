import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "./json-translations/he.json";
import eng from "./json-translations/eng.json";

// נבנה רשימת שפות זמינות מתוך הקבצים
export const languages = [
  { code: "he",  name: he?.LanguageName || "עברית",  dir: he?.Direction || "rtl" },
  { code: "eng", name: eng?.LanguageName || "English", dir: eng?.Direction || "ltr" },
];

const resources = {
  he:  { translation: he?.Strings || {} },
  eng: { translation: eng?.Strings || {} },
};

const stored = sessionStorage.getItem("app_lang");
const defaultLang = stored && resources[stored] ? stored : "he";

function applyDirection(langCode) {
  const meta = languages.find(l => l.code === langCode) || languages[0];
  const html = document.documentElement;
  html.setAttribute("dir", meta.dir);
  html.setAttribute("lang", meta.code);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: "he",
    interpolation: { escapeValue: false },
  });

// להבטיח כיוון נכון בהתחלה
applyDirection(defaultLang);

// לעדכן כיוון בכל שינוי שפה
i18n.on("languageChanged", (lng) => {
  applyDirection(lng);
  sessionStorage.setItem("app_lang", lng);
});

export default i18n;
