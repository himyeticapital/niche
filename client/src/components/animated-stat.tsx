import { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedStat({
  value,
  suffix = "",
  label,
  duration = 2,
  decimals = 0,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let animationFrameId: number;
    let isMounted = true;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      if (!isMounted) return;
      
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(value * eased);

      if (now < endTime && isMounted) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (isMounted) {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration, prefersReducedMotion]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.floor(displayValue).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <p className="text-2xl md:text-3xl font-bold font-display">
        {formattedValue}{suffix}
      </p>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </motion.div>
  );
}

export function AnimatedStatsContainer({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-gradient-shift" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-primary/8 blur-2xl animate-float-slower" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
