// src/components/InfoMenu.jsx
import React, { useState } from "react";
import menuData from "../json-translations/menu-he.json";
import { useTranslation } from "react-i18next";
import "./../styles/InfoMenuPage.css";
import "../styles/global.css";
export default function InfoMenu({ alwaysOpen = false }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(alwaysOpen);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(
    alwaysOpen ? 0 : null
  );

  const toggleCategory = (index) => {
    setOpenCategoryIndex((prev) => (prev === index ? null : index));
  };

  const categories = menuData?.categories ?? [];

  if (!i18n.language.startsWith("he")) return null;

  return (
    <div className="info-menu">
      {/* מצב פנימי: כותרת ניתנת לפתיחה/סגירה */}
      {!alwaysOpen && (
        <div
          className="info-toggle about-link large-link"
          onClick={() => setOpen(!open)}
          role="button"
          aria-expanded={open}
        >
          <span className="info-text">{t("infoMenu")}</span>
          <span className="arrow">{open ? "▲" : "▼"}</span>
        </div>
      )}
{(open || alwaysOpen) && (
  <ul className="category-list">
    {categories.map((category, index) => (
      <li key={index} className="category-item">
        {/* אם זה alwaysOpen לא מציגים כפתור חץ */}
        {alwaysOpen ? (
          <>
            <div className="category-title always">{category.name}</div>
            <ul className="link-list">
              {(category.links || []).map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <button
              className="category-title"
              onClick={() => toggleCategory(index)}
            >
              {category.name}
              <span style={{ marginInlineStart: "0.5em" }}>
                {openCategoryIndex === index ? "▲" : "▼"}
              </span>
            </button>
            {openCategoryIndex === index && (
              <ul className="link-list">
                {(category.links || []).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </li>
    ))}
  </ul>
)}

    </div>
  );
}
