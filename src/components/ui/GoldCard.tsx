import { motion } from "framer-motion";

interface GoldCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export const GoldCard = ({
  children, className = "", glowColor = "#E5D08F", onClick
}: GoldCardProps) => (
  <motion.div
    onClick={onClick}
    whileHover={{
      y: -5,
      borderColor: `${glowColor}33`,
      boxShadow: `0 12px 40px ${glowColor}10`,
    }}
    transition={{ duration: 0.28 }}
    className={`bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl transition-all duration-300 ${
      onClick ? "cursor-pointer" : "cursor-default"
    } ${className}`}
  >
    {children}
  </motion.div>
);
