// src/pages/NotificationsPage.jsx

import React, { useMemo, useState } from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";
import {
  markNotificationSeen
} from "../utils/notificationsApi";
import "../styles/NotificationsPage.css";
import "../styles/global.css";
export default function NotificationsPage() {
  const { patientData, refreshPatientData } = useCycle();
  const { t } = useTranslation();

  const fullList = patientData?.notifications?.messages || [];

  const visibleNotifications = useMemo(() => {
    return fullList
      .map((note, index) => ({ ...note, index }))
      .filter(n => n.see !== "no")
      .reverse();
  }, [fullList]);

  const [confirmState, setConfirmState] = useState({
    mode: null,
    targetIndex: null,
    targetIndices: []
  });
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSingleDelete = (notificationIndex) => {
    setConfirmState({
      mode: "single",
      targetIndex: notificationIndex,
      targetIndices: []
    });
  };

  const handleAllDelete = () => {
    const toDelete = fullList
      .map((note, index) => ({ ...note, index }))
      .filter(n => n.see === "yes");
    setConfirmState({
      mode: "all",
      targetIndex: null,
      targetIndices: toDelete.map(n => n.index)
    });
  };

  const handleConfirm = async () => {
    if (!patientData?.id) return;
    if (confirmState.mode === "single") {
      setDeletingIndex(confirmState.targetIndex);
      try {
        const success = await markNotificationSeen({
          patientId: patientData.id,
          notificationIndex: confirmState.targetIndex,
          medicalcenterid: "-1"
        });
        if (success) await refreshPatientData();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingIndex(null);
        setConfirmState({ mode: null, targetIndex: null, targetIndices: [] });
      }
    } else if (confirmState.mode === "all") {
      setIsDeletingAll(true);
      for (const idx of confirmState.targetIndices) {
        setDeletingIndex(idx);
        try {
          const success = await markNotificationSeen({
            patientId: patientData.id,
            notificationIndex: idx,
            medicalcenterid: "-1"
          });
          if (!success) break;
        } catch (err) {
          console.error(err);
          break;
        }
      }
      await refreshPatientData();
      setDeletingIndex(null);
      setIsDeletingAll(false);
      setConfirmState({ mode: null, targetIndex: null, targetIndices: [] });
    }
  };

  const handleCancel = () => {
    setConfirmState({ mode: null, targetIndex: null, targetIndices: [] });
  };

  const formatNotificationTime = (timeStr) => {
    const ymd = timeStr.slice(0, 8);
    const hh = timeStr.slice(8, 10);
    const mm = timeStr.slice(10, 12);
    const dateObj = new Date(
      Number(ymd.slice(0, 4)),
      Number(ymd.slice(4, 6)) - 1,
      Number(ymd.slice(6, 8))
    );
    const daysArray = t("days", { returnObjects: true });
    const dayLabel = daysArray[dateObj.getDay()] || "";

    return `${formatHeYMD(ymd)} • ${dayLabel} • ${hh}:${mm}`;
  };

  return (
    <div className="notifications-page">
      <h2>{t("alerts")}</h2>

      {visibleNotifications.length === 0 && !isDeletingAll && deletingIndex === null ? (
        <div>{t("noAlerts")}</div>
      ) : (
        <>
          <button
            className="btn-delete-all"
            onClick={handleAllDelete}
            disabled={isDeletingAll || deletingIndex !== null}
          >
            {isDeletingAll ? t("deleting")+"..." : t("deleteallnotification")}
          </button>

          <ul className="notifications-list">
            {visibleNotifications.map((note) => {
              const idx = note.index;
              const isThisDeleting = deletingIndex === idx;

              return (
                <li key={note.time + "_" + idx}>
                  <div className="notification-info">
                    <div className="time">
                      {formatNotificationTime(note.time)}
                    </div>
                    <div className="message">
                      {note.message}
                    </div>
                  </div>

                  <button
                    className="notification-delete-btn"
                    onClick={() => handleSingleDelete(idx)}
                    disabled={isDeletingAll || deletingIndex !== null}
                    title={t("deletenotification")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zM4.118 4 4 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4H4.118zM2.5 3h11V2h-11v1z"/>
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {confirmState.mode && (
        <div className="tp-modal-backdrop" role="dialog" aria-modal="true">
          <div className="tp-modal-box">
            <div className="tp-modal-text">
              {confirmState.mode === "single"
                ? t("confirmDeleteSingle")
                : t("confirmDeleteAll")}
            </div>
            <div className="tp-modal-actions">
              <button type="button" onClick={handleConfirm} className="tp-modal-btn filled"
                disabled={isDeletingAll || deletingIndex !== null}>
                {t("confirm")}
              </button>
              <button type="button" onClick={handleCancel} className="tp-modal-btn"
                disabled={isDeletingAll || deletingIndex !== null}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
