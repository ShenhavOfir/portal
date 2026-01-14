// src/components/HamburgerMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import InfoMenu from "./InfoMenu";
import { useTranslation } from "react-i18next";
import TermsModal from "./TermsModal"; // ✅ ייבוא המודל של תנאי שימוש
import "./../styles/hamburger-menu.css";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); // ✅ מצב להצגת תנאים
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* כפתור פתיחת תפריט */}
      <button className="hamburger-button" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* תפריט צדדי */}
      <div className={`hamburger-drawer ${open ? "open" : ""}`}>
        <button className="close-button" onClick={() => setOpen(false)}>
          ×
        </button>

        {/* הקישורים לבית/תוכנית/תוצאות/סיכום/משימות עברו לסרגל התחתון במובייל */}

        {/* כפתור הנחיות זריקה */}
        <Link
          to="/injection-guide"
          className="menu-item about-link"
          onClick={() => setOpen(false)}
        >
          {t("injectionGuide")}
        </Link>

        {/* כפתור הנחיות */}
        <Link
          to="/instructions"
          className="menu-item about-link"
          onClick={() => setOpen(false)}
        >
          {t("instructions")}
        </Link>

        {/* ✅ כפתור תנאי שימוש כמודל */}
<button
  className="menu-item about-link"
  onClick={() => {
    setOpen(false);
    setShowTermsModal(true);
  }}
>
  {t("terms")}
</button>





        {/* כפתור אודות */}
        <Link
          to="/about"
          className="menu-item about-link"
          onClick={() => setOpen(false)}
        >
          {t("about")}
        </Link>

        {/* כפתור תמיכה טכנית */}
        <Link
          to="/app-contact"
          className="menu-item about-link"
          onClick={() => setOpen(false)}
        >
          {t("technicalSupport")}
        </Link>


        {/* תפריט מידע נוסף יוצג רק בעברית */}
        {i18n.language.startsWith("he") && <InfoMenu />}
      </div>

      {/* רקע שחור לסגירה בלחיצה */}
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      {/* ✅ מודל תנאי שימוש */}
      {showTermsModal && (
        <TermsModal
          pdfUrl="/terms.pdf"
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </>
  );
}
