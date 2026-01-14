// src/components/DemoBanner.jsx
import React from "react";
import { useCycle } from "../context/CycleContext";
import { useNavigate } from "react-router-dom";
import "../styles/DemoBanner.css";
import { useTranslation } from "react-i18next";
import "../styles/global.css";
export default function DemoBanner() {
  const { demoMode, setDemoMode } = useCycle();
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!demoMode) return null;

  const exitDemo = () => {
    setDemoMode(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* רקע ״הדגמה״ כמו שהיה קודם */}
      <div className="demo-overlay">
        {Array.from({ length: 1000 }).map((_, i) => (
          <span key={i}>{t("demo")}</span>
        ))}
      </div>

      {/* כפתור יציאה בלבד – בלי קופסה שחורה, מתחת לבחירת מחזור */}
      <div className="demo-exit-box">
        <button
          type="button"
          className="btn btn-purple styled-block-btn demo-exit-btn"
          onClick={exitDemo}
        >
          {t("exitfromdemo")}
        </button>
      </div>
    </>
  );
}


