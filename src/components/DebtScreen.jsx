import { useNavigate } from "react-router-dom";

export default function DebtScreen({ debt }) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <h1 className="screen-title">Академическая задолженность</h1>
      <p className="screen-subtitle">
        Пройдите шаги по порядку — так задолженность закроется без лишних визитов.
      </p>

      <ol className="steps">
        {debt.steps.map((step, index) => (
          <li key={index} className="step">
            <span className="step-number">{index + 1}</span>
            <span className="step-text">{step}</span>
          </li>
        ))}
      </ol>

      <div className="info-block">
        <div className="info-row">
          <span className="info-label">Кабинет</span>
          <span className="info-value">{debt.cabinet}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Часы приёма</span>
          <span className="info-value">{debt.hours}</span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-back"
        onClick={() => navigate("/")}
      >
        ← Назад
      </button>
    </div>
  );
}
