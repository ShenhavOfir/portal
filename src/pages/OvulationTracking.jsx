import React, { useMemo } from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";
import BackToCurrentCycle from "../components/BackToCurrentCycle";


import "../styles/OvulationTracking.css";
import "../styles/global.css";
const isNonZero = (v) => {
  if (v == null) return false;
  const s = String(v).trim();
  return s !== "" && s !== "0" && s !== "00000000";
};

export default function OvulationTracking() {
  const { t } = useTranslation();
  const {
    meta,
    selectedIndex,
    setSelectedIndex,
    selectedMeta,
    cycles,
    ovaryfrozeninhospital,
  } = useCycle();

  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  const activeMeta =
    selectedMeta ?? meta.find((m) => m?.index === selectedIndex) ?? meta[0] ?? null;
  const activeCycle = cycles[activeMeta?.index ?? 0] ?? null;
  const summary = activeCycle?.summary ?? {};

  const L = {
    Oocytes_pumping: t("Oocytes_pumping"),
    pumped: t("pumped"),
    frozen: t("frozen"),
    pumpedOnDate: t("pumpedOnDate"),
    fertilitationStr: t("fertilitationStr"),
    Return_of_embryos: t("Return_of_embryos"),
    freshMany: t("freshMany"),
    defrostedMany: t("defrostedMany"),
    secondaryReturn: t("secondaryReturn"),
    secondaryReturnOnDate: t("secondaryReturnOnDate"),
    defrosted: t("defrosted"),
    defrostedOn: t("defrostedOn"),
    fertelizedDefrosted: t("fertelizedDefrosted"),
    defrostedManyWraped: t("defrostedManyWraped"),
    closedCycleButton: t("closedCycleButton"),
    noDatainCycle: t("noDatainCycle"),
    noResults: t("noResults"),
  };

  const retrievalBlock = useMemo(() => {
    const items = [];

    if (isNonZero(summary.pumping)) {
      let label = L.pumped;
      let value = String(summary.pumping);
      if (isNonZero(summary.fertilitation)) {
        value += ` ${L.fertilitationStr}${summary.fertilitation})`;
      }
      items.push({ label, value });
    }

    if (isNonZero(summary.frozen)) {
      items.push({ label: L.frozen, value: String(summary.frozen) });
    }

    const notes = [];
    if (isNonZero(summary.day)) {
      notes.push(`${L.pumpedOnDate} ${formatHeYMD(summary.day)}`);
    }

    const has = items.length > 0 || notes.length > 0;
    return has ? { items, notes } : null;
  }, [summary, L]);

  const returnBlock = useMemo(() => {
    const ret = summary.return || {};
    if (!isNonZero(ret.day)) return null;

    const items = [];
    if (isNonZero(ret.fresh)) items.push({ label: L.freshMany, value: String(ret.fresh) });
    if (isNonZero(ret.thawed)) items.push({ label: L.defrostedMany, value: String(ret.thawed) });

    const notes = [`${L.secondaryReturnOnDate} ${formatHeYMD(ret.day)}`];
    return { items, notes };
  }, [summary, L]);

  const returnAgainBlock = useMemo(() => {
    const ret2 = summary.returnagain || {};
    if (!isNonZero(ret2.day)) return null;

    const items = [];
    if (isNonZero(ret2.fresh)) items.push({ label: L.freshMany, value: String(ret2.fresh) });
    if (isNonZero(ret2.thawed)) items.push({ label: L.defrostedMany, value: String(ret2.thawed) });

    const notes = [`${L.secondaryReturnOnDate} ${formatHeYMD(ret2.day)}`];
    return { items, notes };
  }, [summary, L]);

  const defrostBlock = useMemo(() => {
    if (!isNonZero(summary.defrost) && !isNonZero(summary.defrostdate)) return null;

    const items = [];
    if (isNonZero(summary.defrost)) {
      items.push({ label: L.defrosted, value: String(summary.defrost) });
    }
    if (isNonZero(summary.defrostfertilitation)) {
      items.push({ label: L.fertelizedDefrosted, value: String(summary.defrostfertilitation) });
    }

    const notes = [];
    if (isNonZero(summary.defrostdate)) {
      notes.push(`${L.defrostedOn} ${formatHeYMD(summary.defrostdate)}`);
    }

    return { items, notes };
  }, [summary, L]);

  const blocks = [retrievalBlock, defrostBlock, returnBlock, returnAgainBlock].filter(Boolean);

  const goToLatest = () => setSelectedIndex(0);

  if (blocks.length === 0) {
    return (
      <section className="ova-page" dir={dir}>
        <article className="ova-card">
  <h3 className="ova-card-title">{t("EGGTITLE")}</h3>
</article>

        <div className="ova-toolbar center">
          <button type="button" className="ova-btn" onClick={goToLatest}>
            {L.closedCycleButton}
          </button>
        </div>
        <div className="ova-empty-chip">{L.noDatainCycle}</div>
      </section>
    );
  }

return (
<section className="ova-page" dir={dir}>
  {/* כפתור חזרה */}
 <div style={{ textAlign: "center", marginBottom: "12px" }}>
  <BackToCurrentCycle stayHere />

</div>



  <div className="ova-stack">
    {/* ✅ כל בלוקי המעקב בתוך כרטיס אחד */}
    <article className="ova-card">
      {/* כותרת עליונה */}
      <h3 className="ova-card-title">{t("EGGTITLE")}</h3>

      {/* כל הבלוקים ביחד */}
      {blocks.map((blk, bi) => {
        const hasItems = (blk.items?.length || 0) > 0;
        return (
          <div className="ova-inner-block" key={bi}>
            {blk.notes?.map((n, i) => (
              <div className="ova-note" key={`n-${i}`}>{n}</div>
            ))}
            {hasItems ? (
              blk.items.map((row, i) => (
                <div className="ova-row" key={`r-${i}`}>
                  <div className="ova-label">{row.label}</div>
                  <div className="ova-value">{row.value}</div>
                </div>
              ))
           ) : blk.notes?.length > 0 ? null : (
  <div className="ova-placeholder">{L.noResults}</div>
)
}
          </div>
        );
      })}
    </article>

    {/* ✅ קפואים – בלוק נפרד */}
    {Number(ovaryfrozeninhospital) > 0 && (
      <article className="ova-card">
        <h3 className="ova-card-title">{t("frozenSummery")}</h3>
        <p className="ova-frozen-text">
          {t("thereAre") + " " + ovaryfrozeninhospital + " " + t("eggsForFuter")}
        </p>
      </article>
    )}

    {/* ✅ הודעת סיום */}
    <p className="ova-discontinued-msg">
      ⚠️ {t("discontinuedMessage")}
    </p>
  </div>
</section>

);


}
