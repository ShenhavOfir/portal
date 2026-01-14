import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";
import "./../styles/TestResults.css";
import "../styles/global.css";

export default function BloodResultsTable({ dates = [] }) {
  const { t } = useTranslation();

  // כיוון מהתרגומים בלבד (ללא נפילה חכמה)
  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined; // אם אין מפתח — לא קובע dir

  const tableData = useMemo(() => {
    const safe = Array.isArray(dates) ? dates : [];

    // קיבוץ לפי תאריך -> { 'YYYYMMDD': { 'LH': '54', 'E2': '...' } }
    const grouped = {};
    let total = 0;

    safe.forEach((day) => {
      const dayDate = day?.date;
      const bloodTests = day?.examinations?.blood ?? [];
      if (!dayDate) return;
      if (!grouped[dayDate]) grouped[dayDate] = {};

      bloodTests.forEach((b) => {
        const name = (b?.name ?? "").trim();
        const resultRaw = b?.result ?? "";
        const result = typeof resultRaw === "string" ? resultRaw.trim() : String(resultRaw);
        if (name) {
          grouped[dayDate][name] = result;
          total += 1;
        }
      });
    });

    // יצירת רשימה של כל שמות הבדיקות (לעמודות)
    const allTestNames = Array.from(
      new Set(
        Object.values(grouped).flatMap((testsPerDate) => Object.keys(testsPerDate))
      )
    );

    // תאריכים שיש להם לפחות תוצאה אחת
    const filteredDates = Object.keys(grouped)
      .filter((date) => {
        const tests = grouped[date];
        return Object.values(tests).some((v) => v !== null && String(v).trim() !== "");
      })
      .sort((a, b) => b.localeCompare(a)); // ממיינים מהחדש לישן

    return { grouped, allTestNames, filteredDates, totalBloodCount: total };
  }, [dates]);

  const { grouped, allTestNames, filteredDates, totalBloodCount } = tableData;

  // אם אין בכלל בדיקות – לא מציגים כלום
  if (!totalBloodCount) return null;

  return (
    <div className="results-wrap" dir={dir}>
      <div className="results-toolbar">
        {/* כותרת – מתורגמת לפי המפתח הקיים */}
        <h2>{t("Blood_test")}</h2>
      </div>

      <div className="table-scroll">
        <table className="results-table" dir={dir}>
          <thead>
            <tr>
              <th style={{ width: 140 }}>{t("Date")}</th>
              {allTestNames.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((date) => (
              <tr key={date}>
                <td>{formatHeYMD(date)}</td>
                {allTestNames.map((name) => (
                  <td key={name}>{grouped[date][name] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
