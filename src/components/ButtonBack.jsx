import { useNavigate } from "react-router-dom";

function ButtonBack() {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate("/")}>
      ←חזרה
    </button>
  );
}

export default ButtonBack;
