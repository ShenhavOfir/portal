import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LoginPage.css";
import Popup from "../components/Popup";
import "../styles/global.css";
export default function OTPPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [popup, setPopup] = useState("");
// --- 🔐 הטלפון כפי ששמור בלוקאלי ---
  const phone = sessionStorage.getItem("phone") || "";
// פונקция שמצפינה את המספר
  function maskPhone(phone) {
    if (!phone) return "";
    const clean = phone.toString().trim();
    if (clean.length < 4) return "***";

    // שתי ספרות ראשונות + **** + שתי אחרונות
    return clean.slice(0, 2) + "****" + clean.slice(-2);
  }

  const maskedPhone = maskPhone(phone);

  useEffect(() => {
    const token = sessionStorage.getItem("secureToken");
    if (token) {
      navigate("/today");
      return;
    }

    const id = sessionStorage.getItem("patientID");
    const phone = sessionStorage.getItem("phone");
    function maskPhone(phone) {
    if (!phone) return "";
    const clean = phone.toString().trim();
    if (clean.length < 4) return "***";

    // שתי ספרות ראשונות + **** + שתי אחרונות
    return clean.slice(0, 2) + "****" + clean.slice(-2);
  }

  const maskedPhone = maskPhone(phone);
    if (!id || !phone) {
      navigate("/id-login");
    }
  }, [navigate]);

  const handleVerify = async () => {
    const id = sessionStorage.getItem("patientID");
    const phone = sessionStorage.getItem("phone");

    const payload = {
      CountryCode: "+972",
      PhoneNumber: phone,
      NID: id,
      VerificationCode: code,
    };

    try {
      const res = await fetch("/api/GetPatientDataByIDPhoneAndOTPNew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.returnCode === "200") {
        sessionStorage.setItem("secureToken", data.returnMsg);
        // נקה תז וטלפון אחרי התחברות מוצלחת
        sessionStorage.removeItem("patientID");
        sessionStorage.removeItem("phone");

        navigate("/today");
      } else if (data.returnCode === "400") {
        setPopup(t("otpCodeWrong"));
      } else {
        setPopup(t("generalError"));
      }
    } catch (err) {
      console.error("❌ שגיאת תקשורת:", err);
      setPopup(t("generalError"));
    }
  };

  const handleSendAgain = async () => {
    const id = sessionStorage.getItem("patientID");
    const phone = sessionStorage.getItem("phone");

    const payload = {
      CountryCode: "+972",
      PhoneNumber: phone,
      NID: id,
    };

    try {
      await fetch("/api/CheckPatientDataByIDAndPhoneNew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setPopup(t("otpResentInfo"));
    } catch (err) {
      console.error("❌ שגיאה בשליחה חוזרת:", err);
      setPopup(t("generalError"));
    }
  };

  return (
    <div className="login-container">
      <button className="tp-close-btn" onClick={() => navigate("/")}>✖</button>

      <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="login-form">
        {/* <h2>{t("otpValidateTitle")}</h2> */}
       <p style={{ lineHeight: "1.6", marginBottom: "16px", textAlign: "center" }}>
  {t("otpValidateContent")}
  <br />
 <strong
  style={{
    fontSize: "1.1rem",
    letterSpacing: "1px",
    direction: "ltr",
    unicodeBidi: "bidi-override",
    display: "inline-block"
  }}
  dir="ltr"
>
  {maskedPhone}
</strong>

</p>

        <input
          type="text"
          placeholder="00000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">{t("continue")}</button>

        <div className="otp-extra-options">
          <p className="link" onClick={() => setPopup("resendOptions")}>
            {t("didntGet")}
          </p>
        </div>
      </form>

      <Popup
        message={
          popup === "resendOptions" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
              <p className="link" onClick={handleSendAgain}>
                {t("sendAgain")}
              </p>
              <p className="link" onClick={() => navigate("/contact")}>
                {t("technicalSupport")}
              </p>
            </div>
          ) : popup
        }
        onClose={() => setPopup("")}
      />
    </div>
  );
}
