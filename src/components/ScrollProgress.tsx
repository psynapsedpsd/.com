import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ScrollProgress() {
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      raw.set(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [raw]);

  return (
    <motion.div
      className="fixed top-0 left-0 h-[2.5px] z-[9998] origin-left rounded-full"
      style={{
        scaleX: progress.get() / 100,
        width: "100%",
        background: "linear-gradient(to right, hsl(0 62% 38%), hsl(0 62% 55%))",
      }}
    >
      {/* We use a scaleX transform via direct style binding */}
      <ScrollBar progress={progress} />
    </motion.div>
  );
}

function ScrollBar({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    return progress.on("change", v => setWidth(v));
  }, [progress]);

  return (
    <div
      className="h-[2.5px] rounded-full transition-none"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, hsl(0 62% 38%), hsl(0 62% 52%), hsl(25 80% 55%))",
        boxShadow: "0 0 8px hsl(0 62% 38% / 0.5)",
      }}
    />
  );
}
