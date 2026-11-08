import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function ReferenceScreen({ reference }) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <h1 className="screen-title">Справки</h1>
      <p className="screen-subtitle">
        Выберите направление — покажем часы приёма и ответы на частые вопросы.
      </p>

      <motion.div
        className="reference-list"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {reference.map((ref) => (
          <motion.div
            key={ref.slug}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={`/reference/${ref.slug}`}
              className="reference-card reference-card-link"
            >
              <div className="reference-head">
                <span className="reference-cabinet">
                  Кабинет {ref.cabinet}
                </span>
                <span className="reference-title">{ref.title}</span>
              </div>
              <p className="reference-note">{ref.short}</p>
              <span className="card-arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

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
