import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "./json-translations/he.json";
import eng from "./json-translations/eng.json";

const LANG_STORAGE_KEY = "app_lang";

function safeGet(storage, key) {
  try {
    return storage?.getItem?.(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  try {
    storage?.setItem?.(key, value);
  } catch {
    // ignore (storage may be blocked)
  }
}

function safeRemove(storage, key) {
  try {
    storage?.removeItem?.(key);
  } catch {
    // ignore
  }
}

// Policy: only language stays in localStorage. Remove legacy cached dict_* keys if they exist.
function cleanupLegacyLocalStorage() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && /^dict_/i.test(k)) localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

// One-time migration: older builds stored app_lang in sessionStorage.
function migrateLangSessionToLocal() {
  const fromSession = safeGet(sessionStorage, LANG_STORAGE_KEY);
  const inLocal = safeGet(localStorage, LANG_STORAGE_KEY);
  if (fromSession && !inLocal) safeSet(localStorage, LANG_STORAGE_KEY, fromSession);
  if (fromSession) safeRemove(sessionStorage, LANG_STORAGE_KEY);
}

// נבנה רשימת שפות זמינות מתוך הקבצים
export const languages = [
  { code: "he",  name: he?.LanguageName || "עברית",  dir: he?.Direction || "rtl" },
  { code: "eng", name: eng?.LanguageName || "English", dir: eng?.Direction || "ltr" },
];

const resources = {
  he:  { translation: he?.Strings || {} },
  eng: { translation: eng?.Strings || {} },
};

cleanupLegacyLocalStorage();
migrateLangSessionToLocal();

const stored = safeGet(localStorage, LANG_STORAGE_KEY);
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
  safeSet(localStorage, LANG_STORAGE_KEY, lng);
});

export default i18n;
