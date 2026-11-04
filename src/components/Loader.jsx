import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <motion.span
        className="loader-text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Загрузка…
      </motion.span>
    </div>
  );
}
