// src/pages/TasksPage.jsx
import React from "react";
import { useCycle } from "../context/CycleContext";
import { useTranslation } from "react-i18next";
import "../styles/global.css";
function TasksPage() {
  const { tasklist } = useCycle();
  const { t } = useTranslation();

  const taskCount = tasklist?.length || 0;

  if (!tasklist || tasklist.length === 0) {
    return <div style={{ padding: "1rem" }}></div>; // 👈 מסך ריק אם אין משימות
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#7e4bbf" }}>{t("tasks")}</h2>

   

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {tasklist.map((task, idx) => {
          const isDone = task.done === "yes";
          return (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                border: "1px solid #eee",
              }}
            >
              {/* כותרת המשימה */}
              <div
                style={{
                  fontWeight: "bold",
                  color: "#7e4bbf",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                {task.todo}
              </div>

              {/* הערות אם יש */}
              <div
                style={{
                  color: "#555",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                {task.remarks ? task.remarks : t("noMoreTasks")}
              </div>

              {/* כפתור בוצע */}
              <button
                disabled
                className={`tp-done-btn ${isDone ? "done" : ""}`}
                style={{ cursor: "default" }}
              >
                <span className={`tp-done-icon ${isDone ? "yes" : "no"}`}>
                  {isDone ? "✔" : "—"}
                </span>{" "}
                {t("done")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TasksPage;
