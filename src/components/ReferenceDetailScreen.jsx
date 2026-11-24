import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ym } from "react-metrika";
import NotFound from "./NotFound.jsx";

const METRIKA_ID = 114360014;

const icons = {
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.1 1-1.1 1.7v.5" />
      <path d="M12 17h.01" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
      <path d="M15 9h3a2 2 0 0 1 2 2v10" />
      <path d="M4 21h16" />
      <path d="M8 7h3M8 11h3M8 15h3" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
};

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function ReferenceDetailScreen({ reference }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const ref = reference.find((item) => item.slug === slug);
  const [openIndex, setOpenIndex] = useState(null);

  if (!ref) {
    return <NotFound />;
  }

  const toggle = (index) => {
    if (openIndex !== index) {
      ym(METRIKA_ID, "reachGoal", "faq_open");
    }
    setOpenIndex((current) => (current === index ? null : index));
  };

  const servicesHeading =
    ref.servicesHeading || (slug === "union" ? "Направления работы" : "Чем вам могут помочь");

  return (
    <div className="screen">
      <motion.section
        className="ref-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="ref-hero-icon">
          <span className="ref-hero-icon-glyph">{icons.building}</span>
        </div>
        <div className="ref-hero-body">
          <div className="ref-hero-meta">
            <span className="ref-chip">
              {icons.pin}
              Кабинет {ref.cabinet}
            </span>
          </div>
          <h1 className="ref-hero-title">{ref.fullTitle}</h1>
          {ref.intro && ref.intro.length > 0 && (
            <div className="ref-hero-intro">
              {ref.intro.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {ref.links && ref.links.length > 0 && (
            <div className="ref-hero-links">
              {ref.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ref-hero-link"
                  onClick={() => ym(METRIKA_ID, "reachGoal", "ref_service_click")}
                >
                  <span className="ref-hero-link-icon">{icons.link}</span>
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {ref.services && ref.services.length > 0 && (
        <motion.section
          className="ref-section"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <h2 className="section-heading">
            <span className="section-heading-icon">{icons.help}</span>
            {servicesHeading}
          </h2>
          <div className="services-grid">
            {ref.services.map((service, index) => (
              <motion.article key={index} className="service-card" variants={itemVariants}>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-text">{service.text}</p>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-link"
                    onClick={() => ym(METRIKA_ID, "reachGoal", "ref_service_click")}
                  >
                    Перейти
                    <span className="service-link-icon">{icons.arrow}</span>
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="ref-section"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        <h2 className="section-heading">
          <span className="section-heading-icon">{icons.calendar}</span>
          График работы
        </h2>
        <div className="schedule-card">
          <table className="schedule-table">
            <caption className="visually-hidden">График работы: {ref.fullTitle}</caption>
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
        </div>
      </motion.section>

      {ref.teachers && ref.teachers.length > 0 && (
        <motion.section
          className="ref-section"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <h2 className="section-heading">
            <span className="section-heading-icon">{icons.user}</span>
            Преподаватели кафедры
          </h2>
          <div className="teachers-grid">
            {ref.teachers.map((teacher, index) => (
              <motion.article key={index} className="teacher-card" variants={itemVariants}>
                <h3 className="teacher-name">{teacher.name}</h3>
                <p className="teacher-position">{teacher.position}</p>
                {teacher.courses && <p className="teacher-courses">{teacher.courses}</p>}
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}

      {ref.otherDepartments && ref.otherDepartments.length > 0 && (
        <motion.section
          className="ref-section"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <h2 className="section-heading">
            <span className="section-heading-icon">{icons.building}</span>
            Другие популярные кафедры
          </h2>
          <div className="dept-grid">
            {ref.otherDepartments.map((dept) => (
              <motion.div key={dept.cabinet} className="dept-card" variants={itemVariants}>
                <span className="dept-cabinet">{icons.pin}{dept.cabinet}</span>
                <span className="dept-title">{dept.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="ref-section"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        <h2 className="section-heading">
          <span className="section-heading-icon">{icons.help}</span>
          Частые вопросы
        </h2>
        <div className="faq-list">
          {ref.faq.map((qa, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div key={qa.q} className="faq-item" variants={itemVariants}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{qa.q}</span>
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
                      <p className="faq-answer">{qa.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.button
        type="button"
        className="btn btn-back"
        onClick={() => {
          ym(METRIKA_ID, "reachGoal", "back_click");
          navigate("/reference");
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
      >
        <span className="btn-icon">{icons.back}</span>
        Все справки
      </motion.button>
    </div>
  );
}
