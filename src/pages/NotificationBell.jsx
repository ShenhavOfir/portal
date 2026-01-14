import React from "react";
import { useTranslation } from "react-i18next";
import "./NotificationBell.css"; // נבנה עיצוב מותאם
import "../styles/global.css";
function NotificationBell({ count = 0, onClick }) {
  const { t } = useTranslation();
  const hasNotifications = count > 0;

  return (
    <div className="notification-bell" onClick={onClick} role="button" aria-label={t("notifications")}>
      🔔
      {hasNotifications && <span className="notification-badge">{count}</span>}
    </div>
  );
}

export default NotificationBell;
