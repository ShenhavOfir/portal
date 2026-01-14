// src/pages/IDLoginPage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import Popup from "../components/Popup";
import "../styles/global.css";
export default function IDLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [popup, setPopup] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      CountryCode: "+972",
      PhoneNumber: phone,
      NID: id,
    };

    try {
      const res = await fetch("/api/CheckPatientDataByIDAndPhoneNew", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});


      const data = await res.json();

      if (data.returnCode === "408") {
        // הצלחה – נווט לעמוד OTP
        sessionStorage.setItem("patientID", id);
        sessionStorage.setItem("phone", phone);
        navigate("/otp", { replace: true });

      } else if (data.returnCode === "400") {
        // שגיאה לוגית מהשרת – ת"ז או מספר לא תואמים
        setPopup(t("error_message_SMS"));
      } else {
        // שגיאה כללית – כל קוד אחר
        setPopup(t("generalError"));
      }

    } catch (err) {
      console.error("❌ שגיאת רשת:", err);
      setPopup(t("generalError"));
    }
  };

  return (
    <div className="login-container">
      <button className="tp-close-btn" onClick={() => navigate("/")}>✖</button>

      <form onSubmit={handleSubmit} className="login-form">
        <h2>{t("loginToSystem")}</h2>
        <p>{t("ID_content")}</p>

        <input
          type="text"
          placeholder={t("ID_placeHolder")}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("phone_placeHolder")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit">{t("continue")}</button>
      </form>

      <Popup message={popup} onClose={() => setPopup("")} />
    </div>
  );
}
