// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguageSwitcher.css"; // נוסיף קובץ CSS חדש

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "he" ? "eng" : "he";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="language-switcher"
      aria-label="Switch language"
    >
      🌐
    </button>
  );
}
