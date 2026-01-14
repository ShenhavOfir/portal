import React from "react";
import { useNavigate } from "react-router-dom";
import ExaminationsPreview from "../components/ExaminationsPreview";
import "../styles/Dashboard.css";
import { useCycle } from "../context/CycleContext";
import { getLastExaminations } from "../utils/getLastExaminations";
import { useTranslation } from "react-i18next";
import TreatmentPlan from "../pages/TreatmentPlan";
import { UltrasoundIcon, ReturnIcon, PumpIcon } from "../components/Icons";
import BackToCurrentCycle from "../components/BackToCurrentCycle";

import "../styles/global.css";
function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedDates, selectedCycle, selectedIndex, setSelectedIndex } = useCycle();


  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  const homeToday = t("thisDay");
  const resultsLabel = t("results");
  const closedCycleTodayText = t("closedCycleTodayText");

  const todayYMD = new Date().toLocaleDateString("en-CA").replace(/-/g, "");
  const todayData = selectedDates.find((d) => d.date === todayYMD);
  const isPastCycle = typeof selectedIndex === "number" && selectedIndex > 0;
  const releaseMedsAll = selectedCycle?.medicinesrelease?.medicinerelease ?? [];
  const hasReleaseToday =
    Array.isArray(releaseMedsAll) &&
    releaseMedsAll.some((m) => m.fromdate <= todayYMD && m.todate >= todayYMD);
const goToLatestCycle = () => {
  setSelectedIndex(0);
  navigate("/today"); // נכון - זה הנתיב לדשבורד שלך
};




  const hasAnyMedsForToday = () => {
    const regular =
      selectedDates.find((d) => d.date === todayYMD)?.medicines?.length > 0;

    const ovulation = selectedCycle?.ovulation;
    const ovulationWindow = (() => {
      if (!ovulation?.day || !/^\d{8}$/.test(ovulation.day)) return [];
      const window = [];
      const base = new Date(
        ovulation.day.slice(0, 4),
        ovulation.day.slice(4, 6) - 1,
        ovulation.day.slice(6, 8)
      );
      for (let i = -3; i <= 0; i++) {
        const d = new Date(base);
        d.setDate(d.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        window.push(`${y}${m}${day}`);
      }
      return window;
    })();

    const hasOvulation = ovulationWindow.includes(todayYMD);
    const dayActions = todayData?.actions;
    const hasReturnOrPump = ["3", "4"].includes(String(dayActions));

    return regular || hasReleaseToday || hasOvulation || hasReturnOrPump;
  };

  const bloodTests = getLastExaminations(selectedDates, "blood", 50);
  const ultrasoundTests = getLastExaminations(selectedDates, "ultrasound", 50);

  return (
    <div className="dashboard-container container-lg" dir={dir}>
      <div className="ova-toolbar center">
        <BackToCurrentCycle />
      </div>

      <div className="row g-3 dashboard-row">
        {/* כרטיס "היום" */}
        <div className="col-12 col-lg-6">
          <div className="dashboard-card" onClick={() => navigate("/plan")}>
          <h3>{homeToday}</h3>

          {/* הודעה למחזורים קודמים בלבד */}
          {isPastCycle && (
            <div className="tp-empty closed-cycle-banner">
              {closedCycleTodayText}
            </div>
          )}

          {/* בתצוגת מחזור נוכחי בלבד – כל הקוביות של מה עושים היום/הודעות/תרופות וכו' */}
          {!isPastCycle && (
            <>
              {/* ✅ מה עושים היום - תמיד ראשון */}
              <div className="tp-section">
                <h4 className="tp-section-title">{t("whatAreWeDoingToday")}</h4>
                {todayData?.actions ? (
                  (() => {
                    const a = String(todayData.actions);
                    const texts = {
                      "0": t("Blood_test"),
                      "1": t("Ultrasound"),
                      "2": `${t("Blood_test")} + ${t("Ultrasound")}`,
                      "3": t("pump"),
                      "4": t("return"),
                    };
                    return (
                      <div className="tp-task">
                        <div className="tp-empty">{t("noTaksForToday")}</div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="tp-empty">{t("noTaksForToday")}</div>
                )}
              </div>

              {/* ✅ אם יש תרופות וכו' */}
              {hasAnyMedsForToday() ? (
                <TreatmentPlan isEmbedded selectedOverride={todayYMD} />
              ) : (
                <div className="tp-embedded-wrapper">
                  {/* הודעות */}
                  <div className="tp-section">
                    <h4 className="tp-section-title">{t("messagesFromClinicTitle")}</h4>
                    <div className="tp-empty">{t("noClinicMessages")}</div>
                  </div>

                  {/* תרופות יומיות */}
                  <div className="tp-section">
                    <h4 className="tp-section-title">{t("injectionsAndMedicine")}</h4>
                    <div className="tp-empty">{t("noMedicineOrInjectionsToday")}</div>
                  </div>

              {/* תרופות שחרור – יוצג רק אם יש תרופות שחרור היום */}
              {hasReleaseToday && (
                <div className="tp-section">
                  <h4 className="tp-section-title">{t("medicinesrelease")}</h4>
                  <div className="tp-empty">{t("noMedicineOrInjectionsToday")}</div>
                </div>
              )}
                </div>
              )}
            </>
          )}
          </div>
        </div>

        {/* כרטיס "תוצאות" */}
        <div className="col-12 col-lg-6">
          <div className="dashboard-card" onClick={() => navigate("/results")}>
            <h3>{resultsLabel}</h3>
            <ExaminationsPreview
              title={t("Blood_test")}
              icon="💉"
              items={bloodTests}
            />
            <ExaminationsPreview
              title={t("Ultrasound")}
              icon={<UltrasoundIcon />}
              items={ultrasoundTests}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
