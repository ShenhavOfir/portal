// src/components/NotificationBell.jsx
import React from "react";
import "../styles/NotificationBell.css";
import "../styles/global.css";
function NotificationBell({ count = 0, onClick }) {
  return (
    <button className="notification-bell" onClick={onClick}>
      <span role="img" aria-label="bell">🔔</span>
      {count > 0 && <div className="notification-count">{count}</div>}
    </button>
  );
}

export default NotificationBell;
