import { motion } from "framer-motion";

export default function PageTransition({
  children,
  initial = { opacity: 0, y: 12 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -12 },
  transition = { duration: 0.25, ease: "easeOut" }
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
