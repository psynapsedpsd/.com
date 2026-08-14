import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  { text: "I can clearly articulate what my core values are.", dim: "Values" },
  { text: "I regularly notice when my emotions are influencing my thinking.", dim: "Emotional" },
  { text: "I know what situations tend to bring out my worst behavior.", dim: "Shadow" },
  { text: "I can distinguish between what I want and what others expect of me.", dim: "Autonomy" },
  { text: "I am aware of the patterns I repeat in relationships.", dim: "Relational" },
  { text: "I know what gives me genuine energy versus what drains me.", dim: "Values" },
  { text: "I can recognize when I am rationalizing instead of reasoning.", dim: "Cognitive" },
  { text: "I understand why I react strongly to certain people or situations.", dim: "Shadow" },
  { text: "I have a clear sense of my long-term direction and purpose.", dim: "Autonomy" },
  { text: "I notice when I am performing a version of myself rather than being authentic.", dim: "Relational" },
  { text: "I can sit with uncertainty without needing to immediately resolve it.", dim: "Cognitive" },
  { text: "I know which of my beliefs were inherited versus consciously chosen.", dim: "Emotional" },
];

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

export function SelfAwareness() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const answer = (val: number) => {
    const next = [...answers, val];
    setAnswers(next);
    if (idx + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setIdx(i => i + 1);
    }
  };

  const total = answers.reduce((a, b) => a + b, 0);
  const max = QUESTIONS.length * 4;
  const pct = Math.round((total / max) * 100);

  const dimScores: Record<string, { score: number; max: number }> = {};
  QUESTIONS.forEach((q, i) => {
    if (!dimScores[q.dim]) dimScores[q.dim] = { score: 0, max: 0 };
    dimScores[q.dim].max += 4;
    dimScores[q.dim].score += answers[i] || 0;
  });

  const getProfile = () => {
    if (pct >= 80) return { label: "Deeply Self-Aware", color: "#22c55e", desc: "You possess a rare and profound capacity for honest self-examination. You know your patterns, values, shadows, and purpose — and you act from that clarity. This level of self-knowledge is the foundation of genuine wisdom." };
    if (pct >= 60) return { label: "Reflectively Aware", color: "#84cc16", desc: "You engage in consistent self-reflection and have developed meaningful insight into your inner world. Gaps remain in some areas, but your awareness is a genuine strength that serves your relationships and decisions." };
    if (pct >= 40) return { label: "Growing Awareness", color: "#eab308", desc: "You have begun the inner journey and show real curiosity about yourself. Some dimensions are clearer than others. Continued reflection, journaling, and honest dialogue will deepen your self-knowledge significantly." };
    if (pct >= 20) return { label: "Emerging Awareness", color: "#f97316", desc: "You are at the beginning of what can be a profoundly transformative process. The fact that you are here reflects courage. Most people never look inward this honestly. The path forward starts with curiosity." };
    return { label: "Unconscious Living", color: "#ef4444", desc: "You tend to operate on autopilot, driven by habit, conditioning, and external pressures more than conscious choice. This is the most common human condition — not a verdict, but a starting point." };
  };

  const profile = getProfile();
  const reset = () => { setPhase("intro"); setIdx(0); setAnswers([]); };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="self-awareness-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Self-awareness is the foundation of all psychological growth — the ability to see yourself clearly, including the parts you'd rather not acknowledge.</p>
            <p className="text-[#F4E8D4] font-serif italic mb-6">"The unexamined life is not worth living." — Socrates</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} questions · Be ruthlessly honest · No one else sees your answers</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Deep Reflection</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <div className="flex justify-between mb-3">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{QUESTIONS.length}</span>
              <span className="text-[#333] font-mono text-xs">{QUESTIONS[idx].dim}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-8">
              <div className="bg-[#A32020] h-1 rounded-full transition-all" style={{ width: `${(idx / QUESTIONS.length) * 100}%` }} />
            </div>
            <p className="text-xl font-serif text-[#F4E8D4] mb-8 bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] leading-relaxed">{QUESTIONS[idx].text}</p>
            <div className="flex flex-col gap-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answer(opt.value)}
                  className="w-full text-left px-5 py-4 bg-[#151515] border border-[#2a2a2a] rounded-xl text-[#F4E8D4] hover:border-[#A32020] hover:bg-[#A32020]/5 transition-all"
                  data-testid={`option-${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <div className="text-5xl font-serif font-bold mb-2" style={{ color: profile.color }}>{profile.label}</div>
            <div className="text-[#666] font-mono text-sm mb-6">{total}/{max} · {pct}th percentile</div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-3 mb-6">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-3 rounded-full" style={{ backgroundColor: profile.color }} />
            </div>
            <p className="text-[#999] leading-relaxed mb-8 max-w-md mx-auto">{profile.desc}</p>
            <div className="grid grid-cols-2 gap-3 mb-8 text-left text-sm">
              {Object.entries(dimScores).map(([dim, { score, max: dmax }]) => (
                <div key={dim} className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                  <div className="text-[#666] text-xs mb-2">{dim}</div>
                  <div className="w-full bg-[#1e1e1e] rounded-full h-1.5 mb-1">
                    <div className="h-1.5 rounded-full bg-[#A32020] transition-all" style={{ width: `${(score / dmax) * 100}%` }} />
                  </div>
                  <div className="text-[#444] text-xs">{Math.round((score / dmax) * 100)}%</div>
                </div>
              ))}
            </div>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
