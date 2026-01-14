import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CycleSelect from "./CycleSelect";
import LanguageSelector from "./LanguageSelector";
import NotificationBell from "./NotificationBell";
import { sendReshTimeUpdate } from "../utils/reshTime";
import { useCycle } from "../context/CycleContext";
import Popup from "./Popup";
import "../styles/Header.css";
import "../styles/global.css";

function Header({ notificationCount }) {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const { patientData, demoMode, publicMode, refreshPatientData } = useCycle();
    const fullNotifs = patientData?.notifications?.messages || [];
const unreadCount = fullNotifs.filter(n => n.see !== "no").length;
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(
    () => sessionStorage.getItem(`lastRefreshTime_${patientData?.id}`) || ""
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
const taskCount = Array.isArray(patientData?.tasklist?.task) ? patientData.tasklist.task.length : 0;

  const dir = t("Direction");

  const updateNowFormatted = () => {
    const now = new Date();
    return (
      now.toLocaleDateString("he-IL") +
      " " +
      now.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleRefreshClick = async () => {
    if (
      isRefreshing ||
      !patientData?.id ||
      !patientData?.medicalcenterid ||
      demoMode ||
      publicMode
    ) return;

    setIsRefreshing(true);
    try {
      const success = await sendReshTimeUpdate({
        id: patientData.id,
        medicalcenterid: patientData.medicalcenterid,
      });

      if (success) {
        await refreshPatientData();
        const formatted = updateNowFormatted();
        sessionStorage.setItem(`lastRefreshTime_${patientData.id}`, formatted);
        setLastUpdate(formatted);
      }
    } catch (err) {
      console.error("❌ שגיאה ברענון:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (patientData?.id) {
      const key = `lastRefreshTime_${patientData.id}`;
      const saved = sessionStorage.getItem(key);

      if (saved) {
        setLastUpdate(saved);
      } else {
        const now = updateNowFormatted();
        sessionStorage.setItem(key, now);
        setLastUpdate(now);
      }
    }
  }, [patientData?.id]);

  return (
    <>
      {/* ✅ כפתור התנתקות ממורכז מחוץ להדר */}
    {!demoMode && (
  <div style={{ position: "absolute", top: 10, left: 20, zIndex: 10 }}>
    <button
      onClick={() => setShowLogoutPopup(true)}
      style={{
        backgroundColor: "#f3e9ff", // סגול בהיר
        color: "#6b4bb8",            // טקסט סגול כהה
        padding: "4px 12px",
        border: "1px solid #6b4bb8",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "0.9rem",
        lineHeight: "1.1",
      }}
    >
      {t("resetPass")}
    </button>
  </div>
)}


      {/* 🔲 פופאפ אישור */}
     {showLogoutPopup && (
  <Popup
    message={t("resetPassAlert")}
    showConfirm={true}
    confirmText={t("confirm")}
    cancelText={t("cancel")}
    onConfirm={() => {
      sessionStorage.clear();
      navigate("/");
    }}
    onClose={() => setShowLogoutPopup(false)}
  />
)}


      {/* 🔻 ה-Header הרגיל */}
      <header className="header" dir={dir} style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NotificationBell 
  count={unreadCount} 
  onClick={() => navigate("/notifications")} 
/>

          <nav style={{ display: "inline-flex", gap: 12 }}>
            <NavLink to="/today" className={({ isActive }) => isActive ? "active-link" : "inactive-link"}>{t("Home")}</NavLink>
            <NavLink to="/plan" className={({ isActive }) => isActive ? "active-link" : "inactive-link"}>{t("plan")}</NavLink>
            <NavLink to="/results" className={({ isActive }) => isActive ? "active-link" : "inactive-link"}>{t("Result")}</NavLink>
            <NavLink to="/summary" className={({ isActive }) => isActive ? "active-link" : "inactive-link"}>{t("finalSummary")}</NavLink>
        <NavLink
  to="/tasks"
  className={({ isActive }) => isActive ? "active-link nav-with-badge" : "inactive-link nav-with-badge"}
>
  {t("tasks")}
  {console.log("Header taskCount:", taskCount, "patientData.tasklist:", patientData?.tasklist)}

  {taskCount > 0 && <span className="nav-badge">{taskCount}</span>}
</NavLink>




          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              style={{
                fontSize: "1rem",
                cursor: isRefreshing ? "default" : "pointer",
                background: "none",
                border: "none",
                color: "#663399",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
              }}
            >
              {isRefreshing ? <span className="spinner" /> : <span>🔄 {t("refresh")}</span>}
            </button>
            <span style={{ fontSize: "0.85rem", color: "#2d7d2d", marginTop: "2px" }}>
              {t("lastUpdate")}: {lastUpdate || t("notUpdatedYet")}
            </span>
          </div>

          <CycleSelect compact />
          <LanguageSelector compact />
        </div>
      </header>
    </>
  );
}

export default Header;
