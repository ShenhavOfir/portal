// src/components/LanguageSelect.jsx
import React from "react";
import { useLang } from "../context/LangProvider";
import "../styles/LanguageSelect.css"; // ודא שקובץ כזה קיים

export default function LanguageSelect({ showLabel = false }) {
  const { lang, setLang, loading, error, languages, t } = useLang();

  const labelText = t("language");
  const displayLabel = labelText !== "language" ? labelText : "";

  return (
    <div className="language-select-wrapper">
      {showLabel && displayLabel && (
        <span className="language-select-label">
          {displayLabel}
        </span>
      )}

      <select
        aria-label={labelText}
        value={lang}
        disabled={loading}
        onChange={(e) => setLang(e.target.value)}
        className="language-select-dropdown"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} dir="ltr" title={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      {loading && (
        <span className="language-select-loading" title="Loading...">
          ⏳
        </span>
      )}

      {error && (
        <span className="language-select-error" title={error}>
          ⚠️
        </span>
      )}
    </div>
  );
}
