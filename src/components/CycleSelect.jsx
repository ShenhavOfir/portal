// src/components/CycleSelect.jsx
import React, { useEffect } from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";
import "../styles/CycleSelect.css"; // קובץ עיצוב חדש

function toYMD(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s || s === "0" || s === "00000000") return null;
  return /^\d{8}$/.test(s) ? s : null;
}

function earliestFromFirstdays(cycle) {
  if (!cycle) return null;
  const fd = cycle.firstdays || {};
  const keys = ["firstdaycycle", "firstdaysupport", "firstdaysuppress"];
  const cands = keys.map(k => toYMD(fd[k])).filter(Boolean);
  if (cands.length === 0) return null;
  return cands.reduce((min, d) => (d < min ? d : min));
}

export default function CycleSelect({ compact = false }) {
  const { meta, cycles, selectedIndex, setSelectedIndex } = useCycle();
  const { t } = useTranslation();

  if (!Array.isArray(meta) || meta.length === 0) return null;

  useEffect(() => {
    if (selectedIndex == null || Number.isNaN(selectedIndex)) {
      const latest = meta[0]?.index;
      if (latest != null) setSelectedIndex(latest);
    }
  }, [meta, selectedIndex, setSelectedIndex]);

  const L = { cycle: t("cycle") };

  const options = meta.map((m, i) => {
    const friendlyNo = meta.length - i;
    const cycle = cycles?.[i];
    const earliest = earliestFromFirstdays(cycle);
    const dateText = earliest ? formatHeYMD(earliest) : "—";

    return {
      value: m.index,
      label: `${L.cycle} ${friendlyNo} — ${dateText}`,
    };
  });

  const selectClass = compact ? "cycle-select compact" : "cycle-select";
  const wrapperClass = compact
    ? "cycle-select-wrapper compact"
    : "cycle-select-wrapper";

  return (
    <div className={wrapperClass}>
      <select
        value={selectedIndex ?? ""}
        onChange={(e) => setSelectedIndex(Number(e.target.value))}
        className={selectClass}
        aria-label={L.cycle}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
