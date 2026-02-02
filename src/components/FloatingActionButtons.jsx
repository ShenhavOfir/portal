// src/components/FloatingActionButtons.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaRegEye, FaQuestionCircle, FaRegFileAlt } from "react-icons/fa";
import "../styles/FloatingActionButtons.css";

/**
 * FloatingActionButtons - A component that renders 3 circular action buttons
 * positioned to float perfectly in the middle of the purple background split
 * 
 * The buttons are contained in a wrapper that ensures consistent positioning
 * across all screen resolutions and display sizes.
 */
export default function FloatingActionButtons() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="floating-actions-container">
      <div className="floating-actions-row">
        <button 
          className="floating-action-btn"
          onClick={() => navigate("/info-menu")}
          aria-label={t("infoMenu")}
        >
          <FaRegFileAlt size={26} />
          <span>{t("infoMenu")}</span>
        </button>

        <button 
          className="floating-action-btn"
          onClick={() => navigate("/demo")}
          aria-label={t("demo")}
        >
          <FaRegEye size={26} />
          <span>{t("demo")}</span>
        </button>

        <button 
          className="floating-action-btn"
          onClick={() => navigate("/contact")}
          aria-label={t("technicalSupport")}
        >
          <FaQuestionCircle size={26} />
          <span>{t("technicalSupport")}</span>
        </button>
      </div>
    </div>
  );
}
