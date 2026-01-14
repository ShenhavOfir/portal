// src/context/LangProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import i18n from "../i18n/i18n";
import { I18nextProvider, useTranslation } from "react-i18next";

const LangCtx = createContext(null);

const LANGS = [
  { code: "he", label: "עברית", dir: "rtl", locale: "he-IL" },
  { code: "en", label: "English", dir: "ltr", locale: "en-US" },
];

const API_BASE = "/lang";
const dictKey = (lng) => `dict_${lng}`;
const savedLangKey = "app_lang";

async function fetchDictionary(lang) {
  const url = `${API_BASE}/GetLanguageObjectByKey?key=${encodeURIComponent(lang)}&_=${Date.now()}`;
  console.log("🌐 FETCH:", url); // ← תוודא שזה מודפס
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) return res.json();
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    throw new Error("Unexpected dictionary format");
  }
}

function toDictionary(raw) {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.Strings && typeof raw.Strings === "object") return raw.Strings;
    const wrappers = [
      "data", "result", "value",
      "dictionary", "Dictionary",
      "translations", "Translations"
    ];
    for (const k of wrappers) {
      if (raw[k] && typeof raw[k] === "object") return toDictionary(raw[k]);
    }
    return raw;
  }
  if (Array.isArray(raw)) {
    const map = {};
    for (const it of raw) {
      const k = it?.key ?? it?.Key ?? it?.name ?? it?.Name ?? it?.id;
      const v = it?.value ?? it?.Value ?? it?.translation ?? it?.Translation ?? it?.text;
      if (k) map[String(k)] = v ?? "";
    }
    return map;
  }
  return {};
}

function applyDocDir(code) {
  const cfg = LANGS.find((x) => x.code === code) || LANGS[0];
  document.documentElement.setAttribute("dir", cfg.dir);
  document.documentElement.setAttribute("lang", cfg.locale || code);
}

export function LangProvider({ children, defaultLang = "he" }) {
  console.log("🔧 LangProvider mounted");

  const [lang, setLang] = useState(() => localStorage.getItem(savedLangKey) || defaultLang);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🌍 useEffect - lang changed:", lang);
    let cancel = false;

    const loadDictionary = async () => {
      setLoading(true);
      setError("");

      try {
        let dict = null;
        try {
          const cached = localStorage.getItem(dictKey(lang));
          dict = cached ? JSON.parse(cached) : null;
        } catch {
          localStorage.removeItem(dictKey(lang));
        }

        if (!dict) {
          const raw = await fetchDictionary(lang);
          dict = toDictionary(raw);
          localStorage.setItem(dictKey(lang), JSON.stringify(dict));
        }

        i18n.removeResourceBundle(lang, "translation");
        i18n.addResourceBundle(lang, "translation", dict, true, true);
        await i18n.changeLanguage(lang);

        if (!cancel) {
          applyDocDir(lang);
          localStorage.setItem(savedLangKey, lang);
          setLoading(false);
        }
      } catch (e) {
        console.error("[i18n] load error:", e);
        if (!cancel) {
          setError(e.message || "Language load error");
          setLoading(false);
        }
      }
    };

    loadDictionary();
    return () => {
      cancel = true;
    };
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    loading,
    error,
    languages: LANGS,
  }), [lang, loading, error]);

  return (
    <I18nextProvider i18n={i18n}>
      <LangCtx.Provider value={value}>
        {children}
      </LangCtx.Provider>
    </I18nextProvider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  const { t } = useTranslation();
  return { ...ctx, t };
}

export function useLangSafe() {
  try {
    const ctx = useContext(LangCtx);
    const { t } = useTranslation();
    if (!ctx) {
      return {
        lang: "he",
        setLang: () => {},
        loading: false,
        error: "",
        languages: LANGS,
        t: (k) => k,
      };
    }
    return { ...ctx, t };
  } catch {
    return {
      lang: "he",
      setLang: () => {},
      loading: false,
      error: "",
      languages: LANGS,
      t: (k) => k,
    };
  }
}
