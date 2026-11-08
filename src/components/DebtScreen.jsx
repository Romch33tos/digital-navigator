import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DebtScreen({ debt }) {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Академическая задолженность</h1>
      <p className="screen-subtitle">
        Пройдите шаги по порядку — так задолженность закроется без лишних визитов.
      </p>

      <motion.ol
        className="steps"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {debt.steps.map((step, index) => (
          <motion.li key={index} className="step" variants={item}>
            <span className="step-number">{index + 1}</span>
            <span className="step-text">{step}</span>
          </motion.li>
        ))}
      </motion.ol>

      <div className="info-block">
        <div className="info-row">
          <span className="info-label">Кабинет дирекции</span>
          <span className="info-value">{debt.cabinet}</span>
        </div>
        
        <div className="schedule-container">
          <span className="info-label schedule-title">График работы дирекции</span>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>День недели</th>
                <th>Часы работы</th>
              </tr>
            </thead>
            <tbody>
              {debt.schedule.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.day}</td>
                  <td>{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {debt.referenceInfo && (
          <div className="info-row mt-3">
            <span className="info-label" style={{ fontSize: "14px", color: "var(--accent)" }}>
              {debt.referenceInfo}
            </span>
          </div>
        )}
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
