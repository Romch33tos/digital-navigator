import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ym } from "react-metrika";

const METRIKA_ID = 114360014;

const cards = [
  {
    to: "/debt",
    title: "У меня академическая задолженность",
    description: "Пошаговый маршрут закрытия долга и контакты дирекции.",
    goal: "debt_click"
  },
  {
    to: "/reference",
    title: "Мне нужна справка",
    description: "Кабинеты, часы приёма и что взять с собой.",
    goal: "reference_click"
  },
  {
    to: "/faq",
    title: "Частые вопросы",
    description: "Быстрые ответы на типовые ситуации студентов.",
    goal: "faq_click"
  }
];

export default function HomeScreen() {
  return (
    <div className="home">
      <h1 className="home-title">Чем мы можем вам помочь?</h1>
      <p className="home-subtitle">
        Выберите ситуацию – навигатор объяснит, как действовать.
      </p>
      <div className="home-cards">
        {cards.map((card) => (
          <motion.div
            key={card.to}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Link
              to={card.to}
              className="card-link"
              onClick={() => ym(METRIKA_ID, "reachGoal", card.goal)}
            >
              <span className="card-title">{card.title}</span>
              <span className="card-description">{card.description}</span>
              <span className="card-arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
