import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqScreen({ faq }) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Частые вопросы</h1>
      <p className="screen-subtitle">
        Нажмите на вопрос, чтобы увидеть ответ.
      </p>

      <div className="faq-list">
        {faq.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">{item.q}</span>
                <span className={isOpen ? "faq-chevron faq-chevron-open" : "faq-chevron"} aria-hidden="true">
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
