import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cards = [
  {
    to: "/debt",
    title: "У меня академическая задолженность",
    description: "Пошаговый маршрут закрытия долга и контакты дирекции."
  },
  {
    to: "/reference",
    title: "Мне нужна справка",
    description: "Кабинеты, часы приёма и что взять с собой."
  },
  {
    to: "/faq",
    title: "Частые вопросы",
    description: "Быстрые ответы на типовые ситуации студентов."
  }
];

export default function HomeScreen() {
  return (
    <div className="home">
      <h1 className="home-title">Куда вам нужно?</h1>
      <p className="home-subtitle">
        Выберите ситуацию — навигатор покажет маршрут и кабинеты.
      </p>
      <div className="home-cards">
        {cards.map((card) => (
          <motion.div
            key={card.to}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Link to={card.to} className="card-link">
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
