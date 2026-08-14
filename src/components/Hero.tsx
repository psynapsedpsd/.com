import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const num = Math.min(90, Math.floor((w * h) / 12000));
    const pts: { x: number; y: number; vx: number; vy: number; r: number }[] = Array.from({ length: num }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.2 + 0.8,
    }));
    let mx = w / 2, my = h / 2;
    const onM = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onR = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("mousemove", onM);
    window.addEventListener("resize", onR);
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) { p.x -= dx * 0.009; p.y -= dy * 0.009; }
        /* BLACK particles — clearly visible on cream */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 6, 4, 0.62)";
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], qx = p.x - q.x, qy = p.y - q.y, qd = Math.sqrt(qx * qx + qy * qy);
          if (qd < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(10, 6, 4, ${0.22 - (qd / 130) * 0.22})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.removeEventListener("mousemove", onM);
      window.removeEventListener("resize", onR);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function MagBtn({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 200, damping: 20 });
  const ys = useSpring(y, { stiffness: 200, damping: 20 });
  const onMv = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  return (
    <motion.a ref={ref} href={href} onMouseMove={onMv} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: xs, y: ys }} className={`inline-flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
      {children}
    </motion.a>
  );
}

function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, 100]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0.32]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background" id="hero">
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10 pointer-events-none" />

      {/* Warm red glows */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/8 blur-[200px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating decorative orbs */}
      <FloatingOrb className="top-24 left-[8%] w-16 h-16 border border-foreground/10 bg-foreground/3" delay={0} />
      <FloatingOrb className="top-40 right-[10%] w-10 h-10 border border-accent/20 bg-accent/5" delay={1.5} />
      <FloatingOrb className="bottom-32 left-[12%] w-8 h-8 bg-foreground/5 border border-foreground/8" delay={2.5} />
      <FloatingOrb className="bottom-20 right-[15%] w-14 h-14 border border-foreground/8 bg-transparent" delay={0.8} />

      <ParticleCanvas />

      <motion.div
        className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* DPS Dwarka badge */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-foreground/6 border border-border px-4 py-1.5 rounded-full mb-8 shadow-sm"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-foreground/55">DPS Dwarka</span>
          </motion.div>

          {/* Main title — slide up entrance */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              className="text-[2.6rem] sm:text-[4.5rem] md:text-[10rem] font-serif font-bold text-foreground tracking-tight leading-none"
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              PSYNAPSE
            </motion.h1>
          </div>

          <motion.p
            className="text-lg md:text-2xl font-serif italic text-foreground/45 mb-4 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Psychology Club
          </motion.p>

          {/* Animated expanding line */}
          <motion.div
            className="h-px bg-accent/50 mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          />

          <motion.p
            className="text-base md:text-lg text-foreground/50 max-w-lg mx-auto mb-12 font-light leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            Where cognitive exploration, research, and human understanding converge.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <MagBtn href="#tests"
            className="bg-foreground text-background px-8 py-3.5 rounded-2xl font-medium text-sm tracking-wide shadow-lg hover:shadow-xl transition-shadow">
            Explore Tests <ArrowRight className="ml-2 w-4 h-4" />
          </MagBtn>
          <MagBtn href="#games"
            className="bg-accent text-accent-foreground px-8 py-3.5 rounded-2xl font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition-shadow">
            Play Games
          </MagBtn>
          <MagBtn href="#join"
            className="bg-transparent border border-border text-foreground/60 hover:text-foreground hover:border-foreground/40 px-8 py-3.5 rounded-2xl font-medium text-sm tracking-wide transition-colors shadow-sm">
            Join Us
          </MagBtn>
        </motion.div>


      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.7 }}
      >
        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-foreground/60 to-transparent"
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
