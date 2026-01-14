import React from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";

export default function TodayOverview() {
  const { selectedDates, selectedMeta } = useCycle();
  const { t } = useTranslation();

  const todayYMD = new Date().toLocaleDateString("en-CA").replace(/-/g, "");
  const day = selectedDates.find(d => d.date === todayYMD) ?? {};

  const messages = day.infoday ?? [];
  const action = String(day.actions ?? "");
  const icons = { "0": "💉", "1": "🖥️", "2": "💉 + 🖥️" };
  const texts = {
    "0": t("Blood_test"),
    "1": t("Ultrasound"),
    "2": `${t("Blood_test")} + ${t("Ultrasound")}`,
    "3": t("pump"),
    "4": t("return"),
  };

  const daily = (day.medicines ?? []).map(m => ({
    name: m.name || "",
    qty: m.quantity || "",
  }));

  const releaseAll = selectedMeta?.medicinesrelease?.medicinerelease ?? [];
  const release = releaseAll
    .filter(m => m.fromdate && m.todate && todayYMD >= m.fromdate && todayYMD <= m.todate)
    .map(m => ({ name: m.name || "", qty: m.quantity || "" }));

  return (
    <div className="tp-embedded-wrapper">
      {/* הודעות */}
      <div className="tp-section">
        <h4 className="tp-section-title">{t("messagesFromClinicTitle")}</h4>
        {messages.length
          ? messages.map((m, i) => <div key={i} className="tp-empty">{m.message}</div>)
          : <div className="tp-empty">{t("noClinicMessages")}</div>
        }
      </div>

      {/* משימות */}
      <div className="tp-section">
        <h4 className="tp-section-title">{t("whatAreWeDoingToday")}</h4>
        {texts[action]
          ? <div className="tp-enter"><span>{texts[action]}</span><span>{icons[action]}</span></div>
          : <div className="tp-empty">{t("noTaksForToday")}</div>
        }
      </div>

      {/* תרופות יומיות */}
      <div className="tp-section">
        <h4 className="tp-section-title">{t("injectionsAndMedicine")}</h4>
        {daily.length
          ? daily.map((m, i) => (
              <div key={i} className="tp-enter">
                {m.name}{m.qty ? ` — ${t("dosage")}: ${m.qty}` : ""}
              </div>
            ))
          : <div className="tp-empty">{t("noMedicineOrInjectionsToday")}</div>
        }
      </div>

      {/* תרופות שחרור */}
      <div className="tp-section">
        <h4 className="tp-section-title">{t("medicinesrelease")}</h4>
        {release.length
          ? release.map((m, i) => (
              <div key={i} className="tp-enter">
                {m.name}{m.qty ? ` — ${t("dosage")}: ${m.qty}` : ""}
              </div>
            ))
          : <div className="tp-empty">{t("noMedicineOrInjectionsToday")}</div>
        }
      </div>
    </div>
  );
}
