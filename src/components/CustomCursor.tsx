import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  /* Dot — snappy */
  const dx = useSpring(mx, { stiffness: 500, damping: 35 });
  const dy = useSpring(my, { stiffness: 500, damping: 35 });

  /* Ring — silky lag */
  const rx = useSpring(mx, { stiffness: 90, damping: 20 });
  const ry = useSpring(my, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (isCoarsePointer || reducedMotion) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as Element;
      setHovered(!!t.closest("a,button,[role='button'],input,textarea,select,[data-cursor]"));
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.style.cursor = "";
    };
  }, [isCoarsePointer, mx, my, reducedMotion]);

  if (isCoarsePointer || reducedMotion) return null;

  return (
    <>
      {/* Outer ring — plain dark, no blend mode */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "hsl(25 20% 8% / 0.55)",
        }}
        animate={{
          width:  hovered ? 52 : clicking ? 22 : 34,
          height: hovered ? 52 : clicking ? 22 : 34,
          opacity: visible ? 1 : 0,
          borderWidth: hovered ? "1px" : "1.5px",
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Inner dot — white with depth shadow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dx,
          y: dy,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "hsl(25 20% 8%)",
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.35), 0 1px 4px rgba(255,255,255,0.2)",
        }}
        animate={{
          width:  hovered ? 7 : clicking ? 11 : 6,
          height: hovered ? 7 : clicking ? 11 : 6,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
