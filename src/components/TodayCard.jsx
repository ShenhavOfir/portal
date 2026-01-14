import { useNavigate } from "react-router-dom";
import ExaminationsPreview from "../components/ExaminationsPreview";
import "../styles/Dashboard.css";
import { useCycle } from "../context/CycleContext";
import { getLastExaminations } from "../utils/getLastExaminations";
import { useTranslation } from "react-i18next";
import TodayCard from "../components/TodayCard";
import { tFirst, tStrict } from "../utils/i18nHelpers";
import "../styles/global.css";
function Dashboard() {
  useTranslation(); // לעדכון אוטומטי כששפה משתנה
  const navigate = useNavigate();
  const { selectedDates } = useCycle();

  const title        = tFirst(["patientDashboard","Dashboard","dashboardTitle"]);
  const resultsLabel = tFirst(["Result","Results"]);

  const bloodTests = getLastExaminations(selectedDates, "blood", 50);
  const ultrasoundTests = getLastExaminations(selectedDates, "ultrasound", 50);

  return (
    <div className="dashboard-container">
      <h2>👩‍⚕️ {title}</h2>

      <div className="dashboard-grid">
        {/* "היום" – לא לוחיץ */}
        <div className="dashboard-card" style={{ cursor: "default" }} aria-label={tStrict("thisDay")}>
          <TodayCard />
        </div>

        {/* "תוצאות" – קליק על הרקע -> /results; קליק על כל preview -> טאב ספציפי */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/results")}
          style={{ cursor: "pointer" }}
          aria-label={resultsLabel}
        >
          <h3>{resultsLabel}</h3>

          <ExaminationsPreview
            title={tStrict("Blood_test")}
            icon="💉"
            items={bloodTests}
            emptyText={tFirst(["noExamsToShow","noResults","NoData"])}
            onClick={() =>
              navigate({ pathname: "/results", search: "?tab=blood" }, { state: { tab: "blood" } })
            }
          />

          <ExaminationsPreview
            title={tStrict("Ultrasound")}
            icon="🖥️"
            items={ultrasoundTests}
            emptyText={tFirst(["noExamsToShow","noResults","NoData"])}
            onClick={() =>
              navigate({ pathname: "/results", search: "?tab=ultrasound" }, { state: { tab: "ultrasound" } })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
