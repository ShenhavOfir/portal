// src/components/InjectionGuide.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import "./../styles/injection-guide.css";
import "../styles/global.css";
export default function InjectionGuide() {
  const { t, i18n } = useTranslation();

 

  return (
    <div className="injection-guide">
      <h2 className="guide-title">{t("injectionTitle")}</h2>

      {/* התוכן שנוסף לפני התמונות */}
      <p className="injection-content">{t("injectionContent")}</p>

      <div className="guide-step">
        <h3 className="step-title">{t("step1")}</h3>
        <p className="step-text">{t("washHands")}</p>
        <img
          src="/images/wash-hands.jpg"
         
          className="step-image"
        />
      </div>

      <div className="guide-step">
        <h3 className="step-title">{t("step2")}</h3>
        <p className="step-text">{t("prepareEquipment")}</p>
        <img
          src="/images/injection_equipment.jpg"
          
          className="step-image"
        />
      </div>

      <div className="guide-step">
        <h3 className="step-title">{t("step3")}</h3>
        <p className="step-text">{t("insertNeedle")}</p>
        <img
          src="/images/inject-needle.jpg"
         
          className="step-image"
        />
      </div>

      <div className="guide-step">
        <h3 className="step-title">{t("step4")}</h3>
        <p className="step-text">{t("destroyNeedle")}</p>
        <img
          src="/images/sharps_disposal.jpg"
          
          className="step-image"
        />
      </div>
    </div>
  );
}
