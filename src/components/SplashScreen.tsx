import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "PSYNAPSE".split("");
const SCRAMBLE_CHARS = "ΨΣΦΠΩΔΛΘ∑∫◈◇◎▲△Ω∂∇";
const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

/* ── Canvas: glowing neural network ── */
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let w = (c.width = innerWidth), h = (c.height = innerHeight);
    const onR = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    window.addEventListener("resize", onR);
    const pts = Array.from({ length: 24 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
    let raf: number;
    let last = 0;
    const tick = (now: number) => {
      if (now - last < 34) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = now;
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245,237,224,0.55)"; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            const alpha = (1 - d / 120) * 0.18;
            ctx.strokeStyle = `rgba(139,32,32,${alpha})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ── Per-letter scramble ── */
function ScrambleLetter({ char, delay }: { char: string; delay: number }) {
  const [display, setDisplay] = useState(SCRAMBLE_CHARS[0]);
  const [landed, setLanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), delay);
    let count = 0;
    const scramble = setTimeout(() => {
      const iv = setInterval(() => {
        count++;
        setDisplay(
          count < 7
            ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            : char
        );
        if (count >= 7) { setLanded(true); clearInterval(iv); }
      }, 55);
      return () => clearInterval(iv);
    }, delay + 80);
    return () => { clearTimeout(show); clearTimeout(scramble); };
  }, [char, delay]);

  return (
    <motion.span
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 100,
        letterSpacing: "0.12em",
        lineHeight: 1,
        display: "inline-block",
        minWidth: "0.65em",
        textAlign: "center",
        fontSize: "clamp(2.2rem, 7.5vw, 5.5rem)",
        color: landed ? "#f5ede0" : "rgba(245,237,224,0.55)",
        textShadow: "none",
        transition: "color 0.15s",
      }}
      initial={{ y: 90, opacity: 0, rotateX: 70, filter: "blur(8px)" }}
      animate={visible ? { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: 0, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {visible ? display : ""}
    </motion.span>
  );
}

/* ── Main component ── */
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2700);
    const t2 = setTimeout(onComplete, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: "#080503" }}
          exit={{
            clipPath: ["inset(0% 0% 0% 0%)", "inset(50% 0% 50% 0%)"],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <NeuralCanvas />

          {/* Expanding pulse rings */}
          {[0.1, 0.35, 0.6].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none border"
              style={{ borderColor: `rgba(139,32,32,${0.5 - i * 0.12})` }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: 420 + i * 180, height: 420 + i * 180, opacity: 0 }}
              transition={{ delay, duration: 1.4, ease: "easeOut" }}
            />
          ))}

          {/* Logo */}
          <motion.div
            className="relative z-10 mb-7"
            initial={{ scale: 0, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.28, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={logoSrc}
              alt="PSYNAPSE"
              style={{
                width: 76, height: 76,
                objectFit: "contain",
                filter: "invert(1) brightness(0.88)",
              }}
            />
          </motion.div>

          {/* Letters — scramble + 3-D entrance */}
          <div
            className="relative z-10 flex items-end overflow-visible mb-5"
            style={{ perspective: "600px", perspectiveOrigin: "50% 100%" }}
          >
            {LETTERS.map((ch, i) => (
              <ScrambleLetter key={i} char={ch} delay={480 + i * 85} />
            ))}
          </div>

          {/* Horizontal light-beam sweep across letters */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              top: "calc(50% - 1px)",
              height: 2,
              width: "6vw",
              background:
                "linear-gradient(to right, transparent, rgba(245,237,224,0.9), transparent)",
              filter: "blur(1px)",
            }}
            initial={{ left: "10%", opacity: 0 }}
            animate={{ left: "90%", opacity: [0, 1, 1, 0] }}
            transition={{ delay: 0.85, duration: 0.9, ease: "easeInOut" }}
          />

          {/* Divider line */}
          <motion.div
            className="relative z-10 mb-4 rounded-full"
            style={{ height: 1.5, background: "#8b2020" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 72, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.55, ease: "easeOut" }}
          />

          {/* Subtitle — character by character */}
          <motion.p
            className="relative z-10 font-serif italic tracking-[0.28em]"
            style={{
              fontSize: "clamp(0.75rem, 1.8vw, 1.05rem)",
              color: "rgba(245,237,224,0.38)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.7 }}
          >
            Psychology Club · DPS Dwarka
          </motion.p>

          {/* Loading bar with shimmer */}
          <motion.div
            className="absolute bottom-0 left-0 z-20"
            style={{
              height: 3,
              background:
                "linear-gradient(to right, transparent, #6b1515, #c0392b, #c0392b, #6b1515, transparent)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 2.2, ease: "easeInOut" }}
          />

          {/* Corner stamp */}
          <motion.span
            className="absolute bottom-5 right-6 font-mono z-10"
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              color: "rgba(245,237,224,0.18)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            DPS DWARKA · EST. 2022
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
