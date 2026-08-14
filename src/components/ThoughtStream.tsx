import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const thoughts = [
  { word: "Cognitive Dissonance",     insight: "The mental discomfort you feel when holding two contradictory beliefs. Your brain will go to extraordinary lengths to resolve it — even rewriting memories.", color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200" },
  { word: "The Halo Effect",          insight: "When we find someone attractive, we automatically assume they're also kind and intelligent. One trait casts a glow over everything else.", color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  { word: "Flow State",               insight: "That rare zone where a task is perfectly challenging — not too hard, not too easy. Time dissolves. Csikszentmihalyi called it 'optimal experience'.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { word: "Dunning-Kruger",           insight: "The less you know about a field, the more confident you feel. True expertise breeds humility — you start seeing how much you don't know.", color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200" },
  { word: "Intrinsic Motivation",     insight: "When you do something for the love of it. Studies show that adding external rewards can actually kill intrinsic motivation over time.", color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
  { word: "Selective Attention",      insight: "Your brain processes ~11 million bits of info per second but only consciously handles about 40. You are missing almost everything, all the time.", color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200" },
  { word: "Confirmation Bias",        insight: "We instinctively seek information that confirms what we already believe. No one is immune — not even scientists.", color: "text-teal-600",    bg: "bg-teal-50",    border: "border-teal-200" },
  { word: "Priming",                  insight: "Being briefly exposed to a word or image subtly shapes your thoughts for minutes afterward — without you ever noticing it happened.", color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200" },
  { word: "Mere Exposure Effect",     insight: "You prefer things simply because you've seen them before. The brain equates 'easy to process' with 'good'.", color: "text-pink-600",    bg: "bg-pink-50",    border: "border-pink-200" },
  { word: "Self-Fulfilling Prophecy", insight: "Your expectations alter your behaviour, which then makes the expectation come true. You create the reality you believe in.", color: "text-cyan-600",    bg: "bg-cyan-50",    border: "border-cyan-200" },
  { word: "Learned Helplessness",     insight: "After repeated failures, animals — and people — stop trying even when success becomes possible. Seligman's dogs changed psychology forever.", color: "text-lime-600",    bg: "bg-lime-50",    border: "border-lime-200" },
  { word: "Projection",               insight: "Attributing your own uncomfortable feelings to others. 'She's so angry' — are you sure it's her?", color: "text-fuchsia-600",  bg: "bg-fuchsia-50",  border: "border-fuchsia-200" },
];

/* 8 distinct CSS float paths — each bubble is assigned one */
const floatAnims = [
  { name: "float-a", kf: "@keyframes float-a { 0%,100%{transform:translate(0px,0px)} 30%{transform:translate(18px,-22px)} 60%{transform:translate(-12px,14px)} 80%{transform:translate(8px,-8px)} }" },
  { name: "float-b", kf: "@keyframes float-b { 0%,100%{transform:translate(0px,0px)} 25%{transform:translate(-20px,16px)} 55%{transform:translate(14px,-18px)} 75%{transform:translate(-6px,10px)} }" },
  { name: "float-c", kf: "@keyframes float-c { 0%,100%{transform:translate(0px,0px)} 35%{transform:translate(22px,12px)} 65%{transform:translate(-16px,-20px)} 85%{transform:translate(10px,6px)} }" },
  { name: "float-d", kf: "@keyframes float-d { 0%,100%{transform:translate(0px,0px)} 20%{transform:translate(-14px,-16px)} 50%{transform:translate(20px,8px)} 80%{transform:translate(-8px,-10px)} }" },
  { name: "float-e", kf: "@keyframes float-e { 0%,100%{transform:translate(0px,0px)} 40%{transform:translate(16px,20px)} 70%{transform:translate(-22px,-14px)} 90%{transform:translate(6px,8px)} }" },
  { name: "float-f", kf: "@keyframes float-f { 0%,100%{transform:translate(0px,0px)} 28%{transform:translate(-18px,22px)} 58%{transform:translate(12px,-16px)} 82%{transform:translate(-4px,12px)} }" },
  { name: "float-g", kf: "@keyframes float-g { 0%,100%{transform:translate(0px,0px)} 45%{transform:translate(20px,-10px)} 72%{transform:translate(-14px,18px)} 88%{transform:translate(8px,-6px)} }" },
  { name: "float-h", kf: "@keyframes float-h { 0%,100%{transform:translate(0px,0px)} 15%{transform:translate(-22px,10px)} 48%{transform:translate(16px,-22px)} 78%{transform:translate(-10px,14px)} }" },
];

/* Stable seeded positions/config per bubble (computed once, never changes) */
function seeded(i: number, max: number, salt = 0) {
  return ((i * 137 + salt * 53) % max);
}

interface BubbleConfig {
  left: number; top: number;
  animName: string; duration: number; delay: number;
}

function useBubbleConfigs(): BubbleConfig[] {
  return useMemo(() => thoughts.map((_, i) => ({
    left: 4 + seeded(i, 84, 0),
    top:  8 + seeded(i, 70, 1),
    animName: floatAnims[i % floatAnims.length].name,
    duration: 9 + seeded(i, 8, 2),
    delay: -(seeded(i, 12, 3)),   // negative delay starts mid-animation
  })), []);
}

export function ThoughtStream() {
  const [active, setActive] = useState<number | null>(null);
  const configs = useBubbleConfigs();
  const activeThought = active !== null ? thoughts[active] : null;

  return (
    <section className="py-28 bg-card border-y border-border overflow-hidden relative">
      {/* Inject keyframes once */}
      <style>{floatAnims.map(a => a.kf).join("\n")}</style>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-4">Stream of Consciousness</p>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-3">Thoughts Adrift</h3>
          <p className="text-foreground/40 font-light text-sm font-mono tracking-wide">hover to pause · click to explore</p>
        </motion.div>
      </div>

      {/* Floating canvas */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px]">
        {thoughts.map((t, i) => {
          const c = configs[i];
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="absolute group focus:outline-none"
              style={{ left: `${c.left}%`, top: `${c.top}%` }}
            >
              <div
                style={{
                  animation: `${c.animName} ${c.duration}s ${c.delay}s ease-in-out infinite`,
                  willChange: "transform",
                }}
              >
                <div
                  className={`px-4 py-2 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm shadow-sm
                    group-hover:border-foreground/30 group-hover:shadow-md group-hover:scale-110
                    transition-all duration-200 cursor-pointer whitespace-nowrap`}
                  style={{ boxShadow: "0 2px 8px hsl(25 20% 8% / .07)" }}
                >
                  <span className={`text-sm font-serif font-medium text-foreground/50 group-hover:${t.color} transition-colors duration-200`}>
                    {t.word}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Insight card overlay */}
        <AnimatePresence>
          {activeThought && (
            <motion.div
              key="insight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center z-20 px-6"
              onClick={() => setActive(null)}
            >
              <div className="absolute inset-0 bg-card/85 backdrop-blur-sm" />

              <motion.div
                initial={{ scale: 0.92, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`relative z-10 max-w-md w-full bg-background border rounded-3xl p-8 text-center ${activeThought.border}`}
                style={{ boxShadow: "0 16px 56px hsl(25 20% 8% / .18), 0 4px 14px hsl(25 20% 8% / .10)" }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-card transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <span className={`inline-block text-[10px] font-mono uppercase tracking-widest mb-5 ${activeThought.color}`}>
                  Psychology Insight
                </span>

                <h4 className={`text-2xl font-serif font-bold mb-4 ${activeThought.color}`}>
                  {activeThought.word}
                </h4>

                <div className="h-px bg-border mb-5" />

                <p className="text-base text-foreground/65 font-light leading-relaxed font-serif italic">
                  {activeThought.insight}
                </p>

                <p className="mt-6 text-[10px] font-mono text-foreground/25 tracking-widest uppercase">
                  click outside to dismiss
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
