import { Link } from "react-router-dom";
import PlaneIcon from "./PlaneIcon.jsx";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-link" aria-label="На главную">
        <span className="header-icon">
          <PlaneIcon size={32} color="var(--teal)" variant="stylized" />
        </span>
        <span className="header-text">
          <span className="header-title">Цифровой навигатор</span>
          <span className="header-subtitle">Институт цифры · маршрут студента</span>
        </span>
      </Link>
    </header>
  );
}
