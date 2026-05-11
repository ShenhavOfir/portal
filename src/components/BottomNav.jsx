import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCycle } from "../context/CycleContext";
import { languages } from "../i18n";
import "../styles/BottomNav.css";

export default function BottomNav() {
  const { t, i18n } = useTranslation();
  const { patientData } = useCycle();
  const dir = languages.find((l) => l.code === i18n.language)?.dir || "rtl";

  const taskCount = Array.isArray(patientData?.tasklist?.task)
    ? patientData.tasklist.task.length
    : 0;

  return (
    <nav className="bottom-nav" dir={dir}>
      <NavLink
        to="/today"
        className={({ isActive }) =>
          `bottom-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">🏠</span>
        <span className="bottom-nav-label">{t("Home")}</span>
      </NavLink>

      <NavLink
        to="/plan"
        className={({ isActive }) =>
          `bottom-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">📅</span>
        <span className="bottom-nav-label">{t("plan")}</span>
      </NavLink>

      <NavLink
        to="/results"
        className={({ isActive }) =>
          `bottom-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">🧪</span>
        <span className="bottom-nav-label">{t("results")}</span>
      </NavLink>

      <NavLink
        to="/summary"
        className={({ isActive }) =>
          `bottom-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">📊</span>
        <span className="bottom-nav-label">{t("finalSummary")}</span>
      </NavLink>

      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `bottom-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">✅</span>
        <span className="bottom-nav-label">
          {t("tasks")}
          {taskCount > 0 && (
            <span className="bottom-nav-badge">{taskCount}</span>
          )}
        </span>
      </NavLink>
    </nav>
  );
}


