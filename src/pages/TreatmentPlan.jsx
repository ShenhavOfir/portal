// src/pages/TreatmentPlan.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";

import Popup from "../components/Popup"; 
import { sendMedicineUpdate } from "../utils/medicineApi";
import { UltrasoundIcon, PumpIcon, ReturnIcon } from "../components/Icons";
import BackToCurrentCycle from "../components/BackToCurrentCycle";


import { useNavigate } from "react-router-dom";
 import "../styles/global.css";
import "../styles/TreatmentPlan.css";

function getDateRange(min, max) {
  const res = [];
  let d = new Date(min.slice(0, 4), Number(min.slice(4, 6)) - 1, min.slice(6, 8));
  const end = new Date(max.slice(0, 4), Number(max.slice(4, 6)) - 1, max.slice(6, 8));
  while (d <= end) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    res.push(`${y}${m}${day}`);
    d.setDate(d.getDate() + 1);
  } 
  return res;
}

export default function TreatmentPlan({ isEmbedded = false }) {



  

// 🆕 בדיקה אם זה המחזור האחרון
const { selectedDates, selectedCycle, patientData, refreshPatientData, selectedIndex, setSelectedIndex } = useCycle();

const navigate = useNavigate();

// ✅ אם המחזור הנבחר הוא הראשון ברשימה (index 0) – זה המחזור האחרון
const isLatestCycle = selectedIndex === 0;




  const { t } = useTranslation();
  const days = t("days", { returnObjects: true }); // מחזיר מערך של ימים
  const patientId = patientData?.id;
  const medicalCenterId = patientData?.medicalcenterid;

  const releases = selectedCycle?.medicinesrelease?.medicinerelease ?? [];
  const [isSending, setIsSending] = useState(false);

  // ✅ חדש: מצביעים על תרופות שממתינות לשליחה
  const [pendingKeys, setPendingKeys] = useState([]);
  const todayTasksRef = useRef(null);
  const medsSectionRef = useRef(null);
  const didInitialTodayScrollRef = useRef(false);

  useEffect(() => {
    console.log("📦 כל תרופות בשחרור (releases):", releases);
  }, [releases]);

  const ovulationList = Array.isArray(selectedCycle?.ovulation)
  ? selectedCycle.ovulation
  : selectedCycle?.ovulation
  ? [selectedCycle.ovulation]
  : [];


const ovulationWindow = useMemo(() => {
  const dates = new Set();
  ovulationList.forEach(item => {
    if (!item?.day || !/^\d{8}$/.test(item.day)) return;
    const ovulDate = new Date(
      item.day.slice(0,4),
      item.day.slice(4,6)-1,
      item.day.slice(6,8)
    );
    for (let i = -3; i <= 0; i++) {
      const d = new Date(ovulDate);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,"0");
      const day = String(d.getDate()).padStart(2,"0");
      dates.add(`${y}${m}${day}`);
    }
  });
  return Array.from(dates);
}, [ovulationList]);


  const ymdList = useMemo(() => {
    const fromDays = selectedDates.map(d => d.date).filter(d => /^\d{8}$/.test(d));
    const fromReleases = releases
      .flatMap(r => [r.fromdate, r.todate])
      .filter(d => /^\d{8}$/.test(d));
    const fromOvulation = ovulationWindow.filter(d => /^\d{8}$/.test(d));
    const all = [...fromDays, ...fromReleases, ...fromOvulation];
    if (all.length === 0) return [];
    const min = all.reduce((a,b) => a < b ? a : b);
    const max = all.reduce((a,b) => a > b ? a : b);
    return getDateRange(min, max);
  }, [selectedDates, releases, ovulationWindow]);

const weeks = useMemo(() => {
  if (!ymdList.length) return [];

  // תאריך הראשון ברשימה
  const firstYmd = ymdList[0];
  const firstDate = new Date(
    Number(firstYmd.slice(0,4)),
    Number(firstYmd.slice(4,6)) - 1,
    Number(firstYmd.slice(6,8))
  );

  // getDay(): 0 = Sunday, 1 = Monday, … 6 = Saturday
  const startDayIndex = firstDate.getDay();  

  // נכניס nulls בתחילת השבוע כדי ליישר
  const padded = Array(startDayIndex).fill(null).concat(ymdList);

  const chunks = [];
  for (let i = 0; i < padded.length; i += 7) {
    chunks.push(padded.slice(i, i + 7));
  }

  return chunks;
}, [ymdList]);




  const todayYMD = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const defaultYMD = ymdList.includes(todayYMD) ? todayYMD : ymdList[0];

  const [selected, setSelected] = useState(defaultYMD);

  const day = useMemo(() => selectedDates.find(d => d.date === selected), [selectedDates, selected]);

  const medsFromDay = useMemo(() => {
    const arr = day?.medicines;
    if (!Array.isArray(arr) || !arr.length) return [];
   return arr.map((m) => ({
  source: "day",
  name: m?.name ?? "",
  quantity: m?.quantity ?? "",
  type: m?.type ?? "",
  take: m?.take ?? "no" // ✅ הוספת שדה take
}));

  }, [day]);

  useEffect(() => {
    if (!medsFromDay.length || !selectedCycle?.firstdays) return;
    console.log("📅 בדיקת סיווג תרופות לתאריך:", selected);
    medsFromDay.forEach((med, idx) => {
      const phase = getMedicinePhase(selected, selectedCycle.firstdays);
      console.log(`🧪 תרופה ${idx + 1}:`, {
        name: med.name,
        quantity: med.quantity,
        type: med.type,
        source: med.source,
        phase,
      });
    });
  }, [medsFromDay, selected, selectedCycle?.firstdays]);

  function getMedicinePhase(date, firstdays = {}) {
    const {
      firstdaycycle = "0",
      firstdaysupport = "0",
      firstdaysuppress = "0",
    } = firstdays;

    const isValidYMD = val => typeof val === "string" && /^\d{8}$/.test(val);
    if (!isValidYMD(date)) return "⛔ לא תקין";

    if (isValidYMD(firstdaysupport) && date >= firstdaysupport) {
      return "after drug";
    }
    if (
      isValidYMD(firstdaysuppress) &&
      isValidYMD(firstdaycycle) &&
      date >= firstdaysuppress &&
      date < firstdaycycle
    ) {
      return "before drug";
    }

    return "cycle drug";
  }

  const releaseMap = useMemo(() => {
    const map = {};
    for (const m of releases) {
      if (!m.fromdate || !m.todate) continue;
      const dates = getDateRange(m.fromdate, m.todate);
      for (const date of dates) {
        if (!map[date]) map[date] = [];
        map[date].push({
          source: "release",
          name: m.name ?? "",
          quantity: m.quantity ?? "",
          type: m?.type ?? "",
          strong: m.strong ?? "",
          sign: m.sign ?? "",
          times: m.times ?? "",
          period: m.period ?? "",
        });
      }
    }
    return map;
  }, [releases]);

  const medsFromRanges = useMemo(() => releaseMap[selected] ?? [], [releaseMap, selected]);

const ovulationMeds = useMemo(() => {
  const filtered = ovulationList.filter(item => item.day === selected);
  return filtered.map((item, i) => ({
    source: "ovulation",
    name: item.medicine,
    quantity: "",
    type: "Ovulation",
    doctor: item.doctor,
    hour: item.hour,
    day: item.day,
    take: item.take ?? "no",
    index: ovulationList.findIndex(o => o === item), // 👈 פה נקבע את האינדקס האמיתי
  }));
}, [ovulationList, selected]);



  const medsToday = useMemo(() => [...medsFromDay, ...medsFromRanges, ...ovulationMeds],
                            [medsFromDay, medsFromRanges, ovulationMeds]);

  const grouped = useMemo(() => ({
      daily: medsToday.filter(m => m.source === "day"),
      release: medsToday.filter(m => m.source === "release"),
      ovulation: medsToday.filter(m => m.source === "ovulation"),
    }), [medsToday]);

  const storageKey = `medsDone:${selected}`;
  const [doneMeds, setDoneMeds] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMed, setPendingMed] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

useEffect(() => {
  const raw = sessionStorage.getItem(storageKey);
  try {
    setDoneMeds(raw ? JSON.parse(raw) : {});
  } catch {
    setDoneMeds({});
  }
  setConfirmOpen(false);
  setPendingMed(null);
}, [selected, storageKey]);
useEffect(() => {
  const extra = {};

  ovulationMeds.forEach((m) => {
    if (m.take === "yes") {
      const key = `${m.name}_${m.source}_${m.index}`;
      extra[key] = true;
    }
  });

  medsFromDay.forEach((m) => {
    if (m.take === "yes") {
      const key = `${m.name}_day`;
      extra[key] = true;
    }
  });

  setDoneMeds(prev => ({ ...prev, ...extra }));
}, [selected]); // ✅ לא [medsFromDay, ovulationMeds]





useEffect(() => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(doneMeds));
  } catch {
    console.warn("⚠️ לא הצלחנו לשמור ב-sessionStorage");
  }
}, [doneMeds, storageKey]);

const onClickDone = (name, source, date, index = 0) => {
  const key = source === "ovulation"
    ? `${name}_${source}_${index}`
    : `${name}_${source}`;
  console.log("🧪 Trying done button for key:", key, "doneMeds[key]:", doneMeds[key]);
  if (doneMeds[key]) {
    setPopupMessage(t("cantChangeMedicinText"));
    return;
  }
  setPendingMed({ name, source, date, index });
  setConfirmOpen(true);
};

const scrollToDailySections = () => {
  const target = todayTasksRef.current || medsSectionRef.current;
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const onSelectDay = (ymd) => {
  setSelected(ymd);
  setTimeout(scrollToDailySections, 50);
};

useEffect(() => {
  if (didInitialTodayScrollRef.current) return;
  if (!ymdList.length) return;
  if (!ymdList.includes(todayYMD)) return;
  if (selected !== todayYMD) return;

  didInitialTodayScrollRef.current = true;
  setTimeout(scrollToDailySections, 120);
}, [ymdList, selected, todayYMD]);

const confirmYes = async () => {
  if (pendingMed?.name && pendingMed?.source) {
    const { name, source, date, index } = pendingMed;
    const key = source === "ovulation"
      ? `${name}_${source}_${index}`
      : `${name}_${source}`;

    setPendingKeys(prev => [...prev, key]);
    setIsSending(true);

    try {
      const result = await sendMedicineUpdate({
        date,
        index,
        name,
        source,
        firstdays: selectedCycle?.firstdays,
        id: patientId,
        medicalcenterid: medicalCenterId,
      });

      if (result === true) {
        setDoneMeds(prev => ({ ...prev, [key]: true }));
        await refreshPatientData();
        console.log("🔁 נתונים לאחר רענון:", patientData.cycles);
        setSelected(selected); // 👈 זה מרענן את התצוגה של היום הנבחר מחדש
      } else {
        console.warn("❌ תרופה לא סומנה כבוצעה כי השליחה נכשלה");
      }
    } catch (err) {
      console.error("שגיאה בשליחה:", err);
    } finally {
      setPendingKeys(prev => prev.filter(k => k !== key));
      setIsSending(false);
      setConfirmOpen(false);
      setPendingMed(null);
    }
  }
};


  const confirmNo = () => {
    setConfirmOpen(false);
    setPendingMed(null);
  };

 const ovulationMsg = ovulationList.length
  ? ovulationList.map((o) =>
      `${t("pleaseNote")} ${formatHeYMD(o.day)} ${t("at")} ${o.hour} ${t("youNeedToEnject")} ${o.medicine}`
    ).join("\n")
  : null;


  return (
    <div className="tp-section">
      {!isEmbedded && (
        <>
          <h2 className="tp-section-title">{t("plan")}</h2>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
<BackToCurrentCycle />




</div>

          <div className="tp-calendar">
            {/* שורת ימי השבוע */}
<div className="tp-weekdays-row">
  {days.map((dayName, i) => (
    <div key={i} className="tp-weekday-cell">
      {dayName}
    </div>
  ))}
</div>

            {weeks.map((week, wi) => (
              <div key={wi} className="tp-week-row">
                {week.map((ymd, idx) => {
                  if (!ymd) return <div key={idx} className="tp-tile empty" />;
                  const d = selectedDates.find(x => x.date === ymd);
                  const a = String(d?.actions ?? "");
               const hasDayMeds = !!(d?.medicines?.length);
const countRelease = (releaseMap[ymd]?.length) || 0;
const hasReleaseMeds = countRelease > 0;

// נבדוק האם היום הוא ביוץ או אחד משלושת הימים שלפני
let isOvulationDay = false;
let isOvulationReminder = false;

ovulationList.forEach(o => {
  if (!o.day) return;
  const ovulDate = new Date(o.day.slice(0,4), o.day.slice(4,6)-1, o.day.slice(6,8));
  for (let i = -3; i <= 0; i++) {
    const d2 = new Date(ovulDate);
    d2.setDate(d2.getDate() + i);
    const y = d2.getFullYear();
    const m = String(d2.getMonth()+1).padStart(2,"0");
    const day = String(d2.getDate()).padStart(2,"0");
    const compare = `${y}${m}${day}`;
    if (compare === ymd) {
      if (i === 0) isOvulationDay = true; // זה יום הביוץ עצמו
      else isOvulationReminder = true;   // זה אחד מהימים שלפני
    }
  }
});

const iconsArr = [];

// דם / אולטרסאונד
if (a === "0") iconsArr.push(<span key="blood">💉</span>);
if (a === "1") iconsArr.push(<UltrasoundIcon key="us" />);
if (a === "2") {
  iconsArr.push(<span key="blood2">💉</span>);
  iconsArr.push(<UltrasoundIcon key="us2" />);
}

// חישוב תרופות רגילות בלבד (לא כולל תרופות ביוץ)
const regularCount = [
  ...(d?.medicines || []),
  ...(releaseMap[ymd] || []),
].length;

// תרופות ביוץ ביום עצמו – לפי ovulationList
const ovulationCount = ovulationList.filter((o) => o.day === ymd).length;

// 💊 רגיל – סופר רק תרופות יומיומיות + שחרור
if (regularCount > 0) {
  iconsArr.push(
    <span key="pillCount" className="tp-icon-pill">
      💊{regularCount > 1 && <sup>{regularCount}</sup>}
    </span>
  );
}

// 💊❗ אייקון מיוחד לתרופות ביוץ ביום עצמו – גלולה בתוך משולש אזהרה צהוב
if (ovulationCount > 0) {
  iconsArr.push(
    <span key="ovulPill" className="tp-ovulation-pill">
      <span className="tp-ovulation-triangle">
        <span className="tp-ovulation-pill-icon">💊</span>
      </span>
      {ovulationCount > 1 && (
        <span className="tp-ovulation-count">{ovulationCount}</span>
      )}
    </span>
  );
}
                  const visLabel = a === "3" ? t("pump") : a === "4" ? t("return") : null;
                  const active = ymd === selected;
                  const isToday = ymd === todayYMD;      // ✅ הוסף קביעה אם זה היום
                  const dateObj = new Date(
                    Number(ymd.slice(0, 4)),
                    Number(ymd.slice(4, 6)) - 1,
                    Number(ymd.slice(6, 8))
                  );
                  const weekdayName = dateObj.toLocaleDateString("he-IL", { weekday: "short" });

                  // תצוגה מקוצרת בתוך הקובייה – רק יום/חודש, בלי שנה
                  const shortDateLabel = `${ymd.slice(6, 8)}/${ymd.slice(4, 6)}`;

                  return (
                    <button
                      key={ymd}
                      onClick={() => onSelectDay(ymd)}
                      className={`tp-tile ${active ? "active" : ""} ${isToday ? "today" : ""}`}
                      title={formatHeYMD(ymd)}
                    >
                      <div className="tp-date">{shortDateLabel}</div>

                      {/* שורת אייקונים – תמיד קיימת, גם אם אין אייקונים בפועל, כדי לשמור על גובה אחיד */}
                      <div className="tp-icons">
                        {iconsArr.map((icon, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="tp-icon-sep">+</span>}
                            {icon}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* באדג' פעולה – כשאין טקסט, עדיין משאיר שורה ריקה לאותו גובה */}
                      {visLabel ? (
                        <div className="tp-badge">{visLabel}</div>
                      ) : (
                        <div className="tp-badge tp-badge-empty" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="tp-chosen">{formatHeYMD(selected)}</div>
          {/* משימות היום */}
<div className="tp-section" ref={todayTasksRef}>
  <h3 className="tp-section-title">{t("whatAreWeDoingToday")}</h3>
  {(() => {
    const a = String(day?.actions ?? "");
    const icons = {
  "0": <span>💉</span>,
  "1": <UltrasoundIcon />,
  "2": (
    <>
      <span>💉</span> + 
      <UltrasoundIcon />
    </>
  )
};

    const texts = {
      "0": t("Blood_test"),
      "1": t("Ultrasound"),
      "2": `${t("Blood_test")} + ${t("Ultrasound")}`,
      "3": t("Oocytes_pumping"),
      "4": t("Return_of_embryos"),
    };

    if (!texts[a]) {
      return <div className="tp-empty">{t("noTaksForToday")}</div>;
    }
console.log("📌 task actions key (a):", a);
console.log("📝 task text:", texts[a]);
console.log("🔔 task icon:", icons[a]);

    return (
      
      <div className="tp-task">
        <div className="tp-task-line">
          <span>{texts[a]}</span>
          <span className="tp-icons">{icons[a]}</span>
        </div>
      </div>
    );
  })()}
</div>

        </>
      )}
{ovulationList.map((o, idx) => {
  const ovulDate = new Date(
    o.day.slice(0, 4),
    o.day.slice(4, 6) - 1,
    o.day.slice(6, 8)
  );

  for (let i = -3; i <= -1; i++) {
    const d = new Date(ovulDate);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const compare = `${y}${m}${day}`;
    if (compare === selected) {
      return (
        <div className="tp-section" key={`ovulMsg_${idx}`}>
          <h3 className="tp-section-title">{t("ovulationDaytitle")}</h3>
          <div className="tp-med">
            <div className="tp-med-header">
              <strong>
                {t("pleaseNote")} {formatHeYMD(o.day)} {t("at")} {o.hour} {t("youNeedToEnject")} {o.medicine}
              </strong>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
})}



      {/* תרופות יומיות */}
      <div className="tp-section" ref={medsSectionRef}>
        <h3 className="tp-section-title">{t("injectionsAndMedicine")}</h3>
        {grouped.daily.length ? grouped.daily.map((m, idx) => {
          const key = `${m.name}_day`;
          const done = !!doneMeds[key];
          console.log("🔍 תרופה יומית:", {
  name: m.name,
  key,
  done: doneMeds[key],
  expectedTake: m.take,
  allDoneMeds: doneMeds,
});

          const pending = pendingKeys.includes(key);
          return (
            <div key={key} className="tp-med">
              <div className="tp-med-header">
                <strong>
                  {m.name}
                  {m.type ? ` (${m.type})` : ""}
                </strong>
            <button
  onClick={() => {
    if (done) {
      setPopupMessage(t("cantChangeMedicinText"));
      return;
    }
    if (!isLatestCycle) {
      setPopupMessage(t("cantchangedrugfromoldcycle"));
      return;
    }
    if (selected > todayYMD) {
      setPopupMessage(t("errorCantSetFutureDate"));
      return;
    }
    onClickDone(m.name, m.source, selected, m.index);
  }}
  className={`tp-done-btn ${done ? "done" : ""} ${pending ? "pending" : ""}`}
>
  {pending ? (
    <span className="loader small" />
  ) : (
    <>
      <span className={`tp-done-icon ${done ? "yes" : "no"}`}>
  {done ? "✔" : "—"}
</span>
{t("done")}
    </>
  )}
</button>



              </div>
              {m.quantity && (
                <div className="tp-med-quantity">
                  {t("dosage")}: {m.quantity}
                </div>
              )}
            </div>
          );
        }) : <div className="tp-empty">{t("noMedicineOrInjectionsToday")}</div>}
      </div>
{/* הודעות מהמרפאה */}
{day?.infoday?.length > 0 && (
  <div className="tp-section">
    <h3 className="tp-section-title">{t("messagesFromClinicTitle")}</h3>
    {day.infoday
      .slice()
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map((m) => (
        <div key={m.id} className="tp-message">
          <div className="tp-message-dr">{m.dr}</div>
          <div className="tp-message-text">{m.message}</div>
        </div>
      ))}
  </div>
)}


    {/* תרופות בשחרור */}
{grouped.release.length > 0 && (
  <div className="tp-section">
    <h3 className="tp-section-title">{t("medicinesrelease")}</h3>
    {grouped.release.map((m, idx) => {
      const key = `${m.name}_release`;
      return (
        <div key={key} className="tp-med">
          <div className="tp-med-header">
            <strong>
              {m.name}
              {m.type ? ` (${m.type})` : ""}
              {m.strong ? ` ${m.strong}${m.sign || ""}` : ""}
            </strong>
          </div>
          {m.quantity && (
            <div className="tp-med-quantity">
              {t("dosage")}: {m.quantity}
            </div>
          )}
          {m?.times && m?.period && (
            <div className="tp-med-period">
              {m.times} {t("times")} {t(`medicinesreleasePeriod.${m.period}`)}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}


      {/* מודל אישור */}
      {confirmOpen && (
        <ConfirmModal
          open={confirmOpen}
          text={t("changeMedicinText")}
          onConfirm={confirmYes}
          onCancel={confirmNo}
          t={t}
        />
      )}

      {/* ביוץ */}
{grouped.ovulation.length > 0 && (
  <div className="tp-section">
    <h3 className="tp-section-title">{t("ovulationDaytitle")}</h3>
    {grouped.ovulation.map((m, idx) => {
      const key = `${m.name}_${m.source}_${m.index}`;
      const done = !!doneMeds[key];
      const pending = pendingKeys.includes(key);

      return (
        <div key={key} className="tp-med">
          <div className="tp-med-header">
            <strong>
              {t("pleaseNote")} {formatHeYMD(m.day)} {t("at")} {m.hour} {t("youNeedToEnject")} {m.name}
            </strong>
      <button
  onClick={() => {
    if (done) {
      setPopupMessage(t("cantChangeMedicinText"));
      return;
    }
    if (!isLatestCycle) {
      setPopupMessage(t("cantchangedrugfromoldcycle"));
      return;
    }
    if (selected > todayYMD) {
      setPopupMessage(t("cantchangefuturedrug"));
      return;
    }
    onClickDone(m.name, m.source, selected, m.index);
  }}
  className={`tp-done-btn ${done ? "done" : ""} ${pending ? "pending" : ""}`}
>
  {pending ? (
    <span className="loader small" />
  ) : (
    <>
     <span className={`tp-done-icon ${done ? "yes" : "no"}`}>
  {done ? "✔" : "—"}
</span>
{t("done")}
    </>
  )}
</button>


          </div>
        </div>
      );
    })}
  </div>
)}



      <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
    </div>
  );
}


function ConfirmModal({ open, text, onConfirm, onCancel, t }) {
  if (!open) return null;
  return (
    <div className="tp-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tp-modal-box">
        <div className="tp-modal-text">{text}</div>
       <div className="tp-modal-actions">
  <button type="button" onClick={onConfirm} className="tp-modal-btn filled">{t("confirm")}</button>
  <button type="button" onClick={onCancel} className="tp-modal-btn">{t("cancel")}</button>
</div>

      </div>
    </div>
  );
}
