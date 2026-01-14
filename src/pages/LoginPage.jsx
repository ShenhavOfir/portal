// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { useTranslation } from "react-i18next";
import LanguageSelectorLogin from "../components/LanguageSelectorLogin";
import { FaRegEye, FaQuestionCircle, FaRegFileAlt, FaIdCard, FaQrcode } from "react-icons/fa";
import Popup from "../components/Popup";
import TermsModal from "../components/TermsModal";
import "../styles/global.css";
export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [accepted, setAccepted] = useState(false);
  const [popup, setPopup] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  // ✅ כניסה אוטומטית אם יש סשן פתוח
  useEffect(() => {
    const token = sessionStorage.getItem("secureToken");
    if (token) {
      navigate("/today");
    }
  }, [navigate]);
  const handleStart = () => {
    if (accepted) {
      setShowOptions(true);
    } else {
      setPopup(t("pleaseApprove_T_C"));
    }
  };

  const handleOption = (option) => {
    setShowOptions(false);
    if (option === "barcode") {
      alert("📷 פתיחת מצלמה (כאן ייכנס הקוד לפתיחת מצלמה אמיתית)");
    } else if (option === "id") {
      navigate("/id-login");
    }
  };

  return (
    <div className="login-container">
      <LanguageSelectorLogin />
      <h1 className="logo">eve4u</h1>
      <p className="subtitle">{t("scanBarcodeInstructions")}</p>

      <button className="start-btn" onClick={handleStart}>
        {t("start")}
      </button>

      <div className="actions-row">
        <button onClick={() => navigate("/info-menu")}>
          <FaRegFileAlt size={26} />
          <span>{t("infoMenu")}</span>
        </button>

        <button onClick={() => navigate("/demo")}>
          <FaRegEye size={26} />
          <span>{t("demo")}</span>
        </button>

        <button onClick={() => navigate("/contact")}>
          <FaQuestionCircle size={26} />
          <span>{t("technicalSupport")}</span>
        </button>
      </div>

      <div className="terms-row">
        <input
          type="checkbox"
          id="terms"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <label htmlFor="terms">
          {t("agreeToTerms")}{" "}
          <span className="link" onClick={() => setShowTerms(true)}>
            {t("agreeToTerms_2")}
          </span>
        </label>
      </div>

      <Popup message={popup} onClose={() => setPopup("")} />

      {showOptions && (
        <div className="tp-modal-backdrop">
          <div className="tp-modal-box">
            <button className="tp-close-btn" onClick={() => setShowOptions(false)}>
              ✖
            </button>

            <button className="tp-modal-btn small" onClick={() => handleOption("barcode")}>
              <FaQrcode size={18} /> {t("barcodeScan")}
            </button>

            <button className="tp-modal-btn small" onClick={() => handleOption("id")}>
              <FaIdCard size={18} /> {t("idConnect")}
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <TermsModal
          pdfUrl="/terms.pdf"
          onClose={() => setShowTerms(false)}
        />
      )}
    </div>
  );
}
