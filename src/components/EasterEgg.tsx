import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "psych";

/* Random neuron node */
interface Node { id: number; x: number; y: number; vx: number; vy: number; r: number; }
interface Spark { id: number; x: number; y: number; tx: number; ty: number; }

function NeuronCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const count = 60;
    const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      r: Math.random() * 3 + 1.5,
    }));

    let t = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      /* Update */
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      /* Connections */
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.7;
            const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.04 + i * 0.3));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(180, 60, 60, ${alpha * pulse})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            /* Traveling spark on some connections */
            if (Math.random() < 0.003) {
              const progress = (Math.sin(t * 0.05) + 1) / 2;
              const sx = a.x + (b.x - a.x) * progress;
              const sy = a.y + (b.y - a.y) * progress;
              ctx.beginPath();
              ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 160, 100, ${alpha})`;
              ctx.fill();
            }
          }
        }
      }

      /* Nodes */
      nodes.forEach((n, i) => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.05 + i * 0.5);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 40, 40, ${0.7 * pulse})`;
        ctx.fill();
        /* Glow */
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 80, 60, ${0.12 * pulse})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

const sparks: Spark[] = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * 2 * Math.PI;
  return {
    id: i,
    x: 50 + Math.cos(angle) * 5,
    y: 50 + Math.sin(angle) * 5,
    tx: 50 + Math.cos(angle) * (35 + Math.random() * 40),
    ty: 50 + Math.sin(angle) * (35 + Math.random() * 40),
  };
});

export function EasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(false);

  const trigger = useCallback(() => {
    setTriggered(true);
    setTimeout(() => setTriggered(false), 4200);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const next = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      setTyped(next);
      if (next === SECRET) trigger();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed, trigger]);

  /* Show hint after 20s of idling on page */
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 20000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Subtle floating hint */}
      <AnimatePresence>
        {hint && !triggered && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-20 left-6 z-40 pointer-events-none"
          >
            <p className="text-[10px] font-mono text-foreground/20 tracking-[0.2em]">
              try typing something…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            key="egg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "hsl(36 55% 93% / 0.96)", backdropFilter: "blur(2px)" }}
            onClick={() => setTriggered(false)}
          >
            <NeuronCanvas active={triggered} />

            {/* Burst sparks */}
            {sparks.map(s => (
              <motion.div
                key={s.id}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent pointer-events-none"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ left: `${s.tx}%`, top: `${s.ty}%`, opacity: 0, scale: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              />
            ))}

            {/* Centre message */}
            <div className="relative z-10 text-center pointer-events-none px-6">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
                className="inline-block text-6xl mb-6"
              >
                🧠
              </motion.div>
              <motion.h2
                className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-4 leading-none"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                You found it.
              </motion.h2>
              <motion.p
                className="text-lg font-serif italic text-foreground/55 max-w-sm mx-auto mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                "The mind is not a vessel to be filled, but a fire to be kindled."
              </motion.p>
              <motion.p
                className="text-xs font-mono text-foreground/30 uppercase tracking-[0.3em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                — Plutarch · PSYNAPSE Easter Egg
              </motion.p>
              <motion.p
                className="mt-8 text-xs font-mono text-foreground/20 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                click anywhere to close
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
