import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "./NotFound.jsx";

export default function ReferenceDetailScreen({ reference }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const ref = reference.find((item) => item.slug === slug);
  const [openIndex, setOpenIndex] = useState(null);

  if (!ref) {
    return <NotFound />;
  }

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="screen">
      <motion.button
        type="button"
        className="btn btn-back btn-back-top"
        onClick={() => navigate("/reference")}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        ← Все справки
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span className="reference-cabinet">Кабинет {ref.cabinet}</span>
        <h1 className="screen-title">{ref.fullTitle}</h1>
        <p className="screen-subtitle">{ref.intro}</p>
      </motion.div>

      <motion.section
        className="info-block"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
      >
        <span className="info-label schedule-title">График работы</span>
        <table className="schedule-table">
          <caption className="visually-hidden">
            График работы: {ref.fullTitle}
          </caption>
          <thead>
            <tr>
              <th scope="col">День недели</th>
              <th scope="col">Часы работы</th>
            </tr>
          </thead>
          <tbody>
            {ref.schedule.map((row) => (
              <tr key={row.day}>
                <td>{row.day}</td>
                <td>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.section>

      <motion.h2
        className="section-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        Частые вопросы
      </motion.h2>

      <motion.div
        className="faq-list"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
      >
        {ref.faq.map((qa, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={qa.q} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">{qa.q}</span>
                <span
                  className={
                    isOpen ? "faq-chevron faq-chevron-open" : "faq-chevron"
                  }
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
                    <p className="faq-answer">{qa.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
