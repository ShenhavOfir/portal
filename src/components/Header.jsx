import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";

import CycleSelect from "./CycleSelect";
import LanguageSelector from "./LanguageSelector";
import Popup from "./Popup";
import { sendReshTimeUpdate } from "../utils/reshTime";
import { useCycle } from "../context/CycleContext";

import HamburgerMenu from "./HamburgerMenu";
import { IoNotificationsSharp } from "react-icons/io5";
import { languages } from "../i18n";

import "../styles/global.css";
import "../styles/header.css";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { patientData, demoMode, publicMode, refreshPatientData } = useCycle();
  const dir = languages.find((l) => l.code === i18n.language)?.dir || "rtl";

  const fullNotifs = patientData?.notifications?.messages || [];
  const unreadCount = fullNotifs.filter((n) => n.see !== "no").length;

  const taskCount = Array.isArray(patientData?.tasklist?.task)
    ? patientData.tasklist.task.length
    : 0;

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(() =>
    sessionStorage.getItem(`lastRefreshTime_${patientData?.id}`) || ""
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const medicalCenterName = patientData?.medicalcentername || "";

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
    )
      return;

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

      {/* כפתור התנתקות בדסקטופ – מעל ההדר, בצד שמאל */}
      {!demoMode && (
        <div className="desktop-logout-wrapper">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="btn btn-purple styled-block-btn header-logout-btn desktop-logout-btn"
            type="button"
          >
            {t("resetPass")}
          </button>
        </div>
      )}

      <Navbar expand="md" bg="light" className="mb-3 custom-navbar">
        <Container fluid className="px-3" dir={dir}>
       <div className="header-inner">
  {/* ימני – פעמון, שפה ותפריט המבורגר */}
<div className="right-header">
  <div className="notif-btn yellow-bell">
    <button
      onClick={() => navigate("/notifications")}
      className="btn btn-link p-0 m-0"
    >
      <IoNotificationsSharp />
    </button>
    {unreadCount > 0 && (
      <span className="notif-badge red-badge">{unreadCount}</span>
    )}
  </div>

  <LanguageSelector compact />

  <div className="hamburger-wrapper">
    <HamburgerMenu />
  </div>
</div>


  {/* מרכז – תפריט ניווט */}
  <div className="nav-wrapper d-none d-md-flex">
    <Nav className="nav-links">
      <Nav.Link as={NavLink} to="/today">{t("Home")}</Nav.Link>
      <Nav.Link as={NavLink} to="/plan">{t("plan")}</Nav.Link>
      <Nav.Link as={NavLink} to="/results">{t("results")}</Nav.Link>
      <Nav.Link as={NavLink} to="/summary">{t("finalSummary")}</Nav.Link>
      <Nav.Link as={NavLink} to="/tasks">
        {t("tasks")}
        {taskCount > 0 && <Badge bg="danger" pill>{taskCount}</Badge>}
      </Nav.Link>
    </Nav>
  </div>

  {/* מרכז – בוחר מחזור */}
  <div className="cycle-center">
    <CycleSelect compact />
  </div>

  {/* שמאל – כפתור התנתקות + רענון (דסקטופ), ורענון למובייל בשורה נפרדת */}
  <div className="left-header">
    {/* כפתור התנתקות – דסקטופ + מובייל (ההבדל במיקומים נעשה ב-CSS) */}
    {!demoMode && (
      <button
        onClick={() => setShowLogoutPopup(true)}
        className="btn btn-purple styled-block-btn header-logout-btn mobile-logout-btn"
        type="button"
      >
        {t("resetPass")}
      </button>
    )}

    {/* רענון + טקסט עדכון לדסקטופ – במובייל מוסתר, ומשתמשים ב-mobile-refresh-row */}
    <div className="desktop-refresh-row" dir={dir}>
      <button
        onClick={handleRefreshClick}
        disabled={isRefreshing}
        className="btn-refresh"
        type="button"
      >
        {isRefreshing ? "⏳" : "🔄"}
      </button>
      {lastUpdate && (
        <span className="last-update-text">
          {t("lastUpdate")}: {lastUpdate}
          {medicalCenterName ? `, ${t("medicalcenterid")} : ${medicalCenterName}` : ""}
        </span>
      )}
    </div>
  </div>

  {/* רענון + טקסט עדכון למובייל – שורה שנייה מלאה בגריד */}
  <div className="mobile-refresh-row" dir={dir}>
    <button
      onClick={handleRefreshClick}
      disabled={isRefreshing}
      className="btn-refresh"
      type="button"
    >
      {isRefreshing ? "⏳" : "🔄"}
    </button>
    {lastUpdate && (
      <span className="last-update-text">
        {t("lastUpdate")}: {lastUpdate}
        {medicalCenterName ? `, ${t("medicalcenterid")} : ${medicalCenterName}` : ""}
      </span>
    )}
  </div>
</div>

        </Container>
      </Navbar>
    </>
  );
}
