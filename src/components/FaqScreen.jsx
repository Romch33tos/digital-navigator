import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ym } from "react-metrika";

const METRIKA_ID = 114360014;

export default function FaqScreen({ faq }) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    if (openIndex !== index) {
      ym(METRIKA_ID, "reachGoal", "faq_open");
    }
    setOpenIndex((current) => (current === index ? null : index));
  };

  const openChat = () => {
    ym(METRIKA_ID, "reachGoal", "CHAT_OPEN_FROM_FAQ");
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Частые вопросы</h1>
      <p className="screen-subtitle">
        Нажмите на вопрос, чтобы посмотреть ответ.
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

      <div className="faq-cta">
        <p className="faq-cta-text">Не нашли ответ на свой вопрос?</p>
        <p className="faq-cta-hint">
          Наш чат-бот ответит за пару секунд — попробуйте!
        </p>
        <button
          type="button"
          onClick={openChat}
          className="faq-cta-btn"
        >
          <span className="faq-cta-btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="9" y1="10" x2="15" y2="10" />
              <line x1="9" y1="14" x2="13" y2="14" />
            </svg>
          </span>
          Спросить чат-бота
        </button>
      </div>

      <button
        type="button"
        className="btn btn-back mt-4"
        onClick={() => {
          ym(METRIKA_ID, "reachGoal", "back_click");
          navigate("/");
        }}
      >
        ← Назад
      </button>
    </div>
  );
}
