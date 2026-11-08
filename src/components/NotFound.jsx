import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="error-wrap">
      <p className="error-text">Раздел не найден.</p>
      <Link to="/reference" className="btn btn-primary">
        К списку справок
      </Link>
    </div>
  );
}
