export default function ErrorScreen() {
  return (
    <div className="error-wrap" role="alert">
      <p className="error-text">
        Не удалось загрузить данные. Обратитесь в дирекцию института.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Повторить
      </button>
    </div>
  );
}
