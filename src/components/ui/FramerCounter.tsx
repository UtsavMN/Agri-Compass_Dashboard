import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface FramerCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const FramerCounter = ({ value, duration = 2.5, suffix = "", className = "" }: FramerCounterProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });

  const display = useTransform(spring, (current) => 
    Math.floor(current).toString() + suffix
  );

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
};
