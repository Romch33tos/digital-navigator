import { useNavigate } from "react-router-dom";

export default function ReferenceScreen({ reference }) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <h1 className="screen-title">Справки</h1>
      <p className="screen-subtitle">
        Выберите нужный кабинет — там подскажут, как получить документ.
      </p>

      <div className="reference-list">
        {reference.map((item, index) => (
          <article key={index} className="reference-card">
            <div className="reference-head">
              <span className="reference-cabinet">{item.cabinet}</span>
              <span className="reference-title">{item.title}</span>
            </div>
            <p className="reference-hours">Часы приёма: {item.hours}</p>
            <p className="reference-note">{item.note}</p>
          </article>
        ))}
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
