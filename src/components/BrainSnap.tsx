import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, ArrowRight } from "lucide-react";

const questions = [
  {
    q: "When solving a problem, you prefer…",
    options: [
      { label: "Gut feeling — trust your instincts", type: "I" },
      { label: "Logic first — analyze every angle", type: "A" },
      { label: "Talk it out with someone", type: "S" },
      { label: "Find a creative workaround", type: "C" },
    ],
  },
  {
    q: "Your brain feels most alive at…",
    options: [
      { label: "3 AM, thinking about the universe", type: "I" },
      { label: "Solving a tough puzzle or riddle", type: "A" },
      { label: "A deep conversation with a friend", type: "S" },
      { label: "Building or making something new", type: "C" },
    ],
  },
  {
    q: "Your first reaction to stress is…",
    options: [
      { label: "Zone out and daydream", type: "I" },
      { label: "Make a list and plan it out", type: "A" },
      { label: "Reach out to someone you trust", type: "S" },
      { label: "Channel it into something creative", type: "C" },
    ],
  },
];

const results: Record<string, { title: string; subtitle: string; desc: string; color: string; bg: string; icon: string }> = {
  I: {
    title: "The Intuitive",
    subtitle: "Deep Thinker",
    desc: "You process the world through feeling and pattern. Your mind makes leaps others can't follow — you see connections before the logic arrives. Jung called this 'introverted intuition'. You're rare.",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: "✦",
  },
  A: {
    title: "The Analyst",
    subtitle: "Systematic Mind",
    desc: "Your brain craves structure and truth. You dissect before you decide, and that precision is your superpower. Research links this style to higher working memory capacity and fluid intelligence.",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: "◈",
  },
  S: {
    title: "The Empath",
    subtitle: "Social Intelligence",
    desc: "You read rooms, not just people. Your emotional radar is finely tuned — you pick up on things most brains filter out. Mirror neurons fire harder in minds like yours. That's a cognitive gift.",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: "◎",
  },
  C: {
    title: "The Creator",
    subtitle: "Divergent Thinker",
    desc: "Your default mode network never really stops. You make connections across unrelated domains — the hallmark of high creative cognition. Studies link this to greater neuroplasticity.",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: "◇",
  },
};

function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color} pointer-events-none`}
      style={{ left: "50%", top: "50%" }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: x, y: y, opacity: 0, scale: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

type Burst = { id: number; particles: { x: number; y: number; color: string }[] };

export function BrainSnap() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [burstCount, setBurstCount] = useState(0);

  const burstColors = ["bg-accent", "bg-violet-400", "bg-amber-400", "bg-emerald-400", "bg-blue-400"];

  function triggerBurst() {
    const newBurst: Burst = {
      id: burstCount,
      particles: Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * 2 * Math.PI;
        const dist = 60 + Math.random() * 80;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
        };
      }),
    };
    setBursts(prev => [...prev, newBurst]);
    setBurstCount(c => c + 1);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== newBurst.id)), 1400);
  }

  function pick(optType: string, idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => {
      const next = [...answers, optType];
      setAnswers(next);
      setSelected(null);
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        // tally
        const counts: Record<string, number> = { I: 0, A: 0, S: 0, C: 0 };
        next.forEach(t => counts[t]++);
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        setResult(winner);
        triggerBurst();
      }
    }, 420);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
  }

  const progress = ((step + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <section className="py-28 bg-card border-y border-border relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-72 h-72 bg-foreground/4 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase">60-Second Brain Snap</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
            What Kind of Mind<br className="hidden md:block" /> Do You Have?
          </h3>
          <p className="text-foreground/45 font-light max-w-md mx-auto">
            3 questions. No signup. Instant cognitive profile based on real psychology research.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="bg-background rounded-3xl border border-border overflow-hidden relative"
            style={{ boxShadow: "0 8px 40px hsl(25 20% 8% / .14), 0 2px 8px hsl(25 20% 8% / .08)" }}
          >
            {/* Burst particles */}
            {bursts.map(burst =>
              burst.particles.map((p, i) => (
                <Particle key={`${burst.id}-${i}`} x={p.x} y={p.y} color={p.color} />
              ))
            )}

            {/* Progress bar */}
            <div className="h-1 bg-border">
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{ width: result ? "100%" : `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <div className="p-5 md:p-10">
              <AnimatePresence mode="wait">
                {result ? (
                  /* ── RESULT ── */
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl border-2 mb-6 ${results[result].bg}`}
                    >
                      {results[result].icon}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <p className={`text-xs font-mono uppercase tracking-[0.3em] mb-2 ${results[result].color}`}>
                        {results[result].subtitle}
                      </p>
                      <h4 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-5">
                        {results[result].title}
                      </h4>
                    </motion.div>

                    <motion.p
                      className="text-foreground/60 font-light leading-relaxed max-w-md mx-auto mb-8 text-base"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {results[result].desc}
                    </motion.p>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-3 justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      <a
                        href="#tests"
                        className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-2xl text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
                        style={{ boxShadow: "0 4px 14px hsl(25 20% 8% / .18)" }}
                      >
                        Explore Full Tests <ArrowRight className="w-4 h-4" />
                      </a>
                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 bg-card border border-border text-foreground/60 px-6 py-3 rounded-2xl text-sm font-medium hover:border-foreground/30 hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Try Again
                      </button>
                    </motion.div>

                    {/* Type legend */}
                    <motion.div
                      className="mt-10 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {Object.entries(results).map(([key, r]) => (
                        <div
                          key={key}
                          className={`rounded-2xl p-3 border text-center transition-all ${
                            key === result
                              ? `${r.bg} shadow-md`
                              : "bg-card border-border opacity-50"
                          }`}
                        >
                          <div className={`text-lg mb-1 ${key === result ? r.color : "text-foreground/40"}`}>{r.icon}</div>
                          <div className={`text-xs font-serif font-semibold ${key === result ? r.color : "text-foreground/40"}`}>{r.title}</div>
                          <div className="text-[10px] font-mono text-foreground/30 uppercase tracking-wider mt-0.5">{r.subtitle}</div>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  /* ── QUESTION ── */
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                      {questions.map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "bg-accent" : "bg-border"}`}
                          animate={{ width: i < step ? 32 : i === step ? 48 : 24 }}
                        />
                      ))}
                      <span className="ml-2 text-xs font-mono text-foreground/30">
                        {step + 1}/{questions.length}
                      </span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-8 leading-snug">
                      {questions[step].q}
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {questions[step].options.map((opt, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => pick(opt.type, idx)}
                          disabled={selected !== null}
                          whileHover={selected === null ? { y: -3, boxShadow: "0 8px 24px hsl(25 20% 8% / .14)" } : {}}
                          whileTap={selected === null ? { scale: 0.97 } : {}}
                          animate={
                            selected === idx
                              ? { scale: 0.97, backgroundColor: "hsl(25 20% 8%)", color: "hsl(36 55% 93%)" }
                              : selected !== null && selected !== idx
                              ? { opacity: 0.35 }
                              : {}
                          }
                          className="relative text-left p-4 bg-card border border-border rounded-2xl text-sm text-foreground/70 font-light leading-relaxed hover:border-foreground/30 hover:text-foreground transition-colors group overflow-hidden"
                          style={{ boxShadow: "0 2px 8px hsl(25 20% 8% / .07)" }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <span className="relative z-10">{opt.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    <p className="text-xs font-mono text-foreground/25 mt-6 text-center tracking-wide">
                      No right or wrong answers · Based on Jungian cognitive types
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
