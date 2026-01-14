// src/components/LanguageSelector.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../i18n";
import "../styles/LanguageSelector.css"; // נייבא את קובץ ה-CSS החדש

export default function LanguageSelector({ compact = false }) {
  const { i18n, t } = useTranslation();
  const dir = i18n.dir?.() || "rtl";
  const isRTL = dir === "rtl";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* כפתור פתיחת בחירת שפה – במקום דרופדאון */}
      <button
        type="button"
        className={`lang-trigger ${compact ? "lang-trigger-compact" : ""}`}
        onClick={() => setOpen(true)}
        dir={dir}
        aria-label={t("chooseLanguage")}
      >
        <span className="lang-trigger-icon">🌐</span>
      </button>

      {/* פופאפ בחירת שפה */}
      {open && (
        <div
          className="tp-modal-backdrop"
          onClick={() => setOpen(false)}
        >
          <div
            className="tp-modal-box lang-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lang-modal-title">
              {t("chooseLanguage")}
            </div>
            <div className="lang-modal-options">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`lang-option-btn ${
                    i18n.language === l.code ? "active" : ""
                  }`}
                  onClick={() => {
                    i18n.changeLanguage(l.code);
                    sessionStorage.setItem("app_lang", l.code);
                    setOpen(false);
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

}
