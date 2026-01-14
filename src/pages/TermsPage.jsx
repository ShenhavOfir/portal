// src/pages/TermsPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("he");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        height: "100vh",
        width: "100%",
        padding: 0,
        margin: 0,
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <iframe
        src="/terms.pdf"
        title="Terms and Conditions"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}

