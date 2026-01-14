import { useNavigate } from "react-router-dom";
import "../styles/TodayTestsPreview.css";

function TodayTestsPreview({ tests }) {
  const navigate = useNavigate();

  return (
    <div className="tests-preview">
      <h3>📋 בדיקות אחרונות</h3>
      <ul>
        {tests.slice(0, 4).map((test, index) => (
          <li key={index}>{test.name}</li>
        ))}
      </ul>
      <button className="action-button" onClick={() => navigate("/results")}>
        לפירוט מלא
      </button>
    </div>
  );
}

export default TodayTestsPreview;
