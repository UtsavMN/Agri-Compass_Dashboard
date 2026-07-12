import { motion } from "framer-motion";

export const SectionLabel = ({
  text, className = ""
}: { text: string; className?: string }) => (
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4 ${className}`}
  >
    {text}
  </motion.p>
);
