// src/context/CycleContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import he from "../json-translations/he.json";
import eng from "../json-translations/eng.json";
import { useLocation } from "react-router-dom";

const CycleContext = createContext(null);
export const useCycle = () => {
  const ctx = useContext(CycleContext);
  if (!ctx) throw new Error("useCycle must be used within CycleProvider");
  return ctx;
};

function getEarliestFirstDay(firstdays = {}) {
  const candidates = [
    firstdays?.firstdaycycle,
    firstdays?.firstdaysupport,
    firstdays?.firstdaysuppress,
  ].filter((d) => d && d !== "0");
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => a.localeCompare(b))[0];
}

function formatYMD(ymd) {
  if (!ymd || String(ymd).length !== 8 || ymd === "0") return null;
  const y = +ymd.slice(0, 4);
  const m = +ymd.slice(4, 6) - 1;
  const d = +ymd.slice(6, 8);
  return new Date(Date.UTC(y, m, d)).toLocaleDateString("he-IL");
}

function getCyclesMeta(cycles = [], cycleLabel = "") {
  const total = cycles.length;
  return cycles.map((c, idx) => {
    const number = total - idx;
    const firstDayRaw = getEarliestFirstDay(c?.firstdays);
    const firstDayDate = formatYMD(firstDayRaw);
    return {
      index: idx,
      number,
      label: `${cycleLabel} ${number}`,
      firstDayRaw,
      firstDayDate,
    };
  });
}

function pickDemoData() {
  const d = i18n.language === "he" ? he?.Demonstration : eng?.Demonstration;
  return d || {};
}

export function CycleProvider({ children }) {
  const location = useLocation();
  const { t } = useTranslation();
  const cycleLabel = t("cycle");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [demoMode, setDemoMode] = useState(location.pathname === "/demo");
  const [publicMode, setPublicMode] = useState(true);

  const fetchPatientData = async (signal) => {
    try {
      if (demoMode) {
        console.log("🟣 DEMO MODE ENABLED – Loading local demo data");
        const demo = pickDemoData();
        setData(demo);
        setError(null);
        return demo;
      }

      const sessionId = sessionStorage.getItem("secureToken");
      if (!sessionId) {
        console.warn("⚠️ Missing patient session ID – falling back to DEMO mode");
        const demo = pickDemoData();
        setDemoMode(true);
        setData(demo);
        setError(null);
        return demo;
      }

     const response = await fetch("/api/PatientDataNew", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: sessionId }),
  signal,
});


      if (!response.ok) throw new Error("Network error");

      const result = await response.json();
      setData(result);
      setError(null);
      setPublicMode(false);
      return result;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("❌ Error loading data:", err);
        setError(err);
        sessionStorage.removeItem("secureToken");
      }
      return null;
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchPatientData(ac.signal);
    return () => ac.abort();
  }, [demoMode, i18n.language]);

  const refreshPatientData = async () => {
    console.log("🔄 Refreshing patient data...");
    return await fetchPatientData();
  };

  const cycles = Array.isArray(data?.cycles) ? data.cycles : [];
  const notifications = data?.notifications?.messages ?? [];
  const tasklist = data?.tasklist?.task ?? [];
  const meta = getCyclesMeta(cycles, cycleLabel);
  const selectedCycle = cycles[selectedIndex] ?? null;
  const selectedDates = Array.isArray(selectedCycle?.dates) ? selectedCycle.dates : [];
  const allDates = cycles.flatMap((c) => (Array.isArray(c?.dates) ? c.dates : []));
  const selectedMeta = meta[selectedIndex] ?? null;
  const ovaryfrozeninhospital = data?.ovaryfrozeninhospital ?? null;

  const value = useMemo(() => ({
    patientData: data,
    cycles,
    meta,
    selectedCycle,
    selectedDates,
    allDates,
    selectedMeta,
    selectedIndex,
    setSelectedIndex,
    notifications,
    tasklist,
    demoMode,
    setDemoMode,
    publicMode,
    setPublicMode,
    refreshPatientData,
    ovaryfrozeninhospital,
  }), [
    data,
    cycles,
    meta,
    selectedCycle,
    selectedDates,
    allDates,
    selectedMeta,
    selectedIndex,
    notifications,
    tasklist,
    demoMode,
    publicMode,
  ]);

  let content = children;
  if (error) {
    content = <div>{t("error")} {error.message}</div>;
  } else if (!data) {
    content = <div>⏳ {t("loading")}</div>;
  }

  return <CycleContext.Provider value={value}>{content}</CycleContext.Provider>;
}
