import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/global.css";
import "../styles/about-page.css";
export default function AboutSection() {
  const { t } = useTranslation();

  const items = [
    t("appGuide"),
    t("protocolInfo"),
    t("medicineReminder"),
    t("scheduleStr"),
    t("labResults"),
    t("pumpInfo"),
    t("updatedEggsStatus"),
    t("andMore"),
  ];

  return (
    <div className="about-section">
      <p><strong>{t("appInfo")}</strong></p>

      <ul className="bullet-list">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* תצוגת טקסט לא ממוספרת */}
      <p>{t("infoComment")}</p>
      <p>
        <a href={`mailto:${t("emailAddress")}`}>{t("emailAddress")}</a>
      </p>
    </div>
  );
}
