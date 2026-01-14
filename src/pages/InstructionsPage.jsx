// src/pages/InstructionsPage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/instructions-page.css";
import { getInstructions } from "../i18n_instructions";
import "../styles/global.css";
export default function InstructionsPage() {
  const { t } = useTranslation();

  const instructions = getInstructions();
  const sections = Array.isArray(instructions) ? instructions : [];

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="instructions-page">
      <h2 className="page-title">{t("instructions")}</h2>

      {sections.length === 0 ? (
        <p>{t("noInstructions") || ""}</p>
      ) : (
        sections.map((section, idx) => (
          <div key={idx} className="instr-section">
            <div className="instr-header" onClick={() => toggle(idx)}>
              {section.title}
              <span className="instr-arrow">{openIndex === idx ? "▲" : "▼"}</span>
            </div>
            {openIndex === idx && section.data && (
              <div className="instr-content">
                {section.data.map((item, i2) => {
                  if (item.type === "subTitle") {
                    return (
                      <div key={i2} className="instr-subtitle">
                        {item.text}
                      </div>
                    );
                  } else if (item.type === "dot") {
                    return (
                      <div key={i2} className="instr-dot">
                       {item.text}
                      </div>
                    );
                  } else {
                    return (
                      <p key={i2} className="instr-text">
                        {item.text}
                      </p>
                    );
                  }
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
