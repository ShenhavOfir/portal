import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import InfoMenu from "../components/InfoMenu";
import "../styles/InfoMenuPage.css";
import "../styles/global.css";
export default function InfoMenuPageExternal() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir?.() === "rtl";

  return (
    <div className="info-page external">
      {/* חץ חזרה ללוגין */}
      <button
        className="info-back-btn"
        onClick={() => navigate("/")}
        aria-label={t("backToLogin")}
      >
        {isRTL ? (
          <MdArrowBack size={28} style={{ transform: "rotate(180deg)" }} />
        ) : (
          <MdArrowBack size={28} />
        )}
      </button>

      <h2 className="info-title">{t("infoMenu")}</h2>

      {/* ✅ כאן שולחים alwaysOpen כדי לפתוח הכל */}
      <InfoMenu alwaysOpen={true} />
    </div>
  );
}
