import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/ContactPage.css";

function ContactPage({ external = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="cp-page">
      <h2 className="cp-title">{t("technicalSupport")}</h2>

      <form className="cp-form" onSubmit={(e) => e.preventDefault()}>
        <div className="cp-group">
          <label className="cp-label">{t("fullName")}</label>
          <input
            className="cp-input"
            type="text"
            placeholder={t("inputFullName")}
          />
        </div>

        <div className="cp-group">
          <label className="cp-label">{t("phoneNumber")}</label>
          <input
            className="cp-input"
            type="text"
            placeholder={t("inputPhoneNumber")}
          />
        </div>

        <div className="cp-group">
          <label className="cp-label">{t("messageContent")}</label>
          <textarea
            className="cp-textarea"
            placeholder={t("inputMessage")}
          />
        </div>

        <button type="submit" className="cp-submit">
          {t("send")}
        </button>
      </form>

      {external && (
        <button
          onClick={() => navigate("/")}
          className="cp-back"
        >
          {t("backToLogin")}
        </button>
      )}
    </div>
  );
}

export default ContactPage;
