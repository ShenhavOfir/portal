import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../components/Popup";
import "../styles/ContactPage.css";

export default function ContactPageInternal() {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [popupMsg, setPopupMsg] = useState("");

  const validate = () => {
    const errs = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = t("min2chars");
    }

    if (!message.trim() || message.trim().length < 2) {
      errs.message = t("min2chars");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("📤 פנימי - נשלח:", { fullName, email, phone, message });
      setPopupMsg(t("sendSuccess"));
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    }
  };

  return (
    <div className="cp-page">
      <h2 className="cp-title">{t("technicalSupport")}</h2>

      <form className="cp-form" onSubmit={handleSubmit}>
        {/* שם מלא */}
        <div className="cp-group">
          <label className="cp-label">{t("fullName")}</label>
          <input
            className="cp-input"
            type="text"
            placeholder={t("inputFullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="cp-error">{errors.fullName}</div>}
        </div>

        {/* אימייל */}
        <div className="cp-group">
          <label className="cp-label">{t("email")}</label>
          <input
            className="cp-input"
            type="email"
            placeholder={t("inputEmail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* טלפון */}
        <div className="cp-group">
          <label className="cp-label">{t("phoneNumber")}</label>
          <input
            className="cp-input"
            type="text"
            placeholder={t("inputPhoneNumber")}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {/* תוכן ההודעה */}
        <div className="cp-group">
          <label className="cp-label">{t("messageContent")}</label>
          <textarea
            className="cp-textarea"
            placeholder={t("inputMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {errors.message && <div className="cp-error">{errors.message}</div>}
        </div>

        <button type="submit" className="cp-submit">
          {t("send")}
        </button>
      </form>

      <Popup message={popupMsg} onClose={() => setPopupMsg("")} />
    </div>
  );
}
