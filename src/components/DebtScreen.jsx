import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DebtScreen({ debt }) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

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
        Пройдите шаги по порядку – так задолженность закроется без лишних визитов.
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
      </div>

      {debt.faq && debt.faq.length > 0 && (
        <>
          <h2 className="section-heading mt-4">Частые вопросы</h2>
          <div className="faq-list">
            {debt.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span
                      className={isOpen ? "faq-chevron faq-chevron-open" : "faq-chevron"}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="faq-answer-wrap"
                      >
                        <p className="faq-answer">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}

      <button
        type="button"
        className="btn btn-back mt-4"
        onClick={() => navigate("/")}
      >
        ← Назад
      </button>
    </div>
  );
}
