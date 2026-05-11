// === src/components/ContactFloating.jsx ===
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdSupportAgent } from "react-icons/md";
import { useTranslation } from "react-i18next"; // ✅ תרגומים
import "../styles/ContactFloating.css";
function ContactFloating() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
  <div
  className="cf-floating"
  onClick={() => navigate("/app-contact")}  // 👈 במקום /contact
  title={t("contactUs")}
  role="button"
  aria-label={t("contactUs")}
>
  <MdSupportAgent className="cf-icon" />
</div>

  );
}

export default ContactFloating;
