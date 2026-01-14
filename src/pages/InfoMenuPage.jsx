export default function InfoMenuPage({ external = false }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir?.() === "rtl";

  return (
    <div className="info-page">
      {external && (
        <button
          className="info-back-btn"
          onClick={() => navigate("/")}
          aria-label={t("backToLogin")}
        >
          {isRTL ? (
            <MdArrowBack size={28} style={{ transform: "rotate(180deg)" }} />
          ) : (
            <MdArrowBack size={28} />
          )}
        </button>
      )}

      {/* אם חיצוני → נפתח ישר */}
      <InfoMenu alwaysOpen={external} />
    </div>
  );
}
