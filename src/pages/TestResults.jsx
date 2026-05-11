// src/pages/TestResults.jsx 
import React, { useMemo, useState } from "react";
import { formatHeYMD } from "../utils/date";
import "../styles/TestResults.css";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import "../styles/global.css";
import BackToCurrentCycle from "../components/BackToCurrentCycle";

/** SVG מינימלי לאולטרסאונד */
function UltrasoundIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17c4 2.5 14 2.5 18 0" />
      <path d="M5 14.5c3 2 11 2 14 0" />
      <path d="M7 12.2c2 1.3 8 1.3 10 0" />
      <circle cx="14.8" cy="10.2" r="2.1" />
      <path d="M12.8 12.3c-1.2.2-2.6 1.1-3.4 2.1" />
    </svg>
  );
}

/** מאחד מבנה לרשימת פריטים {label,value} */
function normalizeItems(arr) {
  return (arr ?? [])
    .map((it) => {
      if (typeof it === "string") return { label: "", value: it };
      const label = (it?.name ?? it?.label ?? "").trim();
      const raw = it?.result ?? it?.value ?? "";
      const value = (raw ?? "").toString().trim();
      return { label, value };
    })
    .filter((x) => x.label || x.value);
}

/** בניית רשומות לפי מצב הטאבים */
function buildEntries(dates, mode) {
  const safe = Array.isArray(dates) ? dates : [];
  const out = [];
  safe.forEach((day) => {
    const date = day?.date;
    const blood = normalizeItems(day?.examinations?.blood);
    const ultra = normalizeItems(day?.examinations?.ultrasound);

    if (mode === "blood" && blood.length) out.push({ date, type: "blood", items: blood });
    if (mode === "ultrasound" && ultra.length) out.push({ date, type: "ultrasound", items: ultra });
    if (mode === "both") {
      if (ultra.length) out.push({ date, type: "ultrasound", items: ultra });
      if (blood.length) out.push({ date, type: "blood", items: blood });
    }
  });
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out;
}

/** תגית סוג (דם/אולטרסאונד) – אייקון בלבד ללא טקסט סטטי */
function TypeBadge({ type }) {
  const isBlood = type === "blood";
  return (
    <div className={`type-badge ${isBlood ? "blood" : "ultra"}`} aria-hidden="true">
      {isBlood ? "💉" : <UltrasoundIcon />}
    </div>
  );
}

// מחלק ערכי בדיקה ארוכים לכמה שורות (2–3 ערכים בכל שורה) כדי שלא ייחתכו
function splitValueIntoRows(raw) {
  if (raw == null) return "";
  const str = String(raw);
  if (!str.includes(",")) return str; // אין מה לפצל

  const parts = str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length <= 3) return [parts.join(", ")];
  if (parts.length === 4) {
    return [parts.slice(0, 2).join(", "), parts.slice(2).join(", ")]; // 2 + 2
  }

  // 5 ומעלה – 3 ואז זוגות (3 + 2, 3 + 2 + 2, ...)
  const rows = [];
  rows.push(parts.slice(0, 3).join(", "));
  let i = 3;
  while (i < parts.length) {
    rows.push(parts.slice(i, i + 2).join(", "));
    i += 2;
  }
  return rows;
}

/** כרטיס תוצאה בודד */
function ResultCard({ entry, dir }) {
  const cols = entry.items
    .filter((it) => it.label || it.value)
    .map((it) => ({ name: it.label || "", value: it.value || "" }));

  return (
    <article className="result-card" dir={dir}>
      <header className="result-card-header">
        <div className="header-left">
          <TypeBadge type={entry.type} />
          <div className="date-chip">{formatHeYMD(entry.date)}</div>
        </div>
        <div className={`pill ${entry.type === "blood" ? "blood" : "ultra"}`}>
          {entry.type === "blood" ? "💉" : <UltrasoundIcon />}
        </div>
      </header>

      <div className="mini-grid-wrap">
        <div className="mini-grid" style={{ "--cols": cols.length }}>
          {cols.map((c, i) => (
            <div className="mini-head" key={`h-${i}`} title={c.name}>
              {c.name}
            </div>
          ))}
          {cols.map((c, i) => {
            const rows = splitValueIntoRows(c.value);
            return (
            <div className="mini-val" key={`v-${i}`} title={c.value}>
                {Array.isArray(rows)
                  ? rows.map((row, ri) => (
                      <span className="mini-val-row" key={ri}>
                        {row}
                      </span>
                    ))
                  : rows}
            </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default function TestResults() {
  const [tab, setTab] = useState("both");
  const { selectedDates } = useCycle();
  const { t } = useTranslation();

  // כיוון ותוויות – רק מהתרגומים (אין fallback)
  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  const titleLabel = t("Result");
  const bothLabel = t("Blood_test_Ultrasound");
  const bloodLabel = t("Blood_test");
  const ultraLabel = t("Ultrasound");
  const emptyLabel = t("noResults");

  const dates = selectedDates;
  const entries = useMemo(() => buildEntries(dates, tab), [dates, tab]);

  const tabs = [
    {
      key: "both",
      label: bothLabel,
      icon: (
        <span className="seg-both" aria-hidden="true">
          <span className="seg-both-part">💉</span>
          <span className="seg-both-plus">+</span>
          <span className="seg-both-part">
            <UltrasoundIcon />
          </span>
        </span>
      ),
    },
    { key: "blood", label: bloodLabel, icon: <span aria-hidden="true">💉</span> },
    { key: "ultrasound", label: ultraLabel, icon: <UltrasoundIcon /> },
  ];

  return (
    <section className="results-page" dir={dir}>
      <div className="page-header">
        <h2>{titleLabel}</h2>
{/* ⭐ כפתור חזרה למחזור האחרון – להישאר בדף בלי ניווט */}
        <div className="results-back-wrap">
          <BackToCurrentCycle />
        </div>

        {/* טאבים – כל תווית מתורגמת מה-JSON */}
        <div className="segmented" role="tablist" aria-label={titleLabel}>
          {tabs.map((tb) => (
            <button
              key={tb.key}
              type="button"
              role="tab"
              aria-selected={tab === tb.key}
              aria-label={tb.label}
              className={`seg-btn ${tab === tb.key ? "active" : ""}`}
              onClick={() => setTab(tb.key)}
              title={tb.label}
            >
              <span className="seg-icon">{tb.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">{emptyLabel}</div>
      ) : (
        <div className="cards">
          {entries.map((e, i) => (
            <ResultCard key={`${e.date}-${e.type}-${i}`} entry={e} dir={dir} />
          ))}
        </div>
      )}
    </section>
  );
}
