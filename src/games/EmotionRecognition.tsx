import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROUNDS = [
  {
    scenario: "A colleague presents their project. Halfway through, their voice starts trembling. They pause and look down at their notes for longer than usual.",
    options: ["Anxiety", "Anger", "Boredom", "Contempt"],
    answer: "Anxiety",
    insight: "Voice trembling and avoidance of eye contact are classic anxiety micro-signals when under scrutiny.",
  },
  {
    scenario: "Your friend receives unexpected praise in front of a group. They smile briefly, then immediately look down and touch the back of their neck.",
    options: ["Pride", "Embarrassment", "Happiness", "Shame"],
    answer: "Embarrassment",
    insight: "Touching the back of the neck and gaze aversion after unexpected positive attention signals embarrassment — not pride.",
  },
  {
    scenario: "During a debate, a person crosses their arms, narrows their eyes slightly, and their jaw tightens. They keep nodding very slowly.",
    options: ["Agreement", "Contempt", "Suppressed Anger", "Focus"],
    answer: "Suppressed Anger",
    insight: "Jaw tightening and arm-crossing are physical manifestations of controlled aggression — the slow nod is a dominance display.",
  },
  {
    scenario: "A child opens a birthday gift. Their eyes go wide, eyebrows shoot up, mouth opens. They freeze for a split second before screaming.",
    options: ["Fear", "Surprise", "Delight", "Excitement"],
    answer: "Surprise",
    insight: "Wide eyes, raised brows, and open mouth lasting under a second is the universal micro-expression of surprise — before secondary emotions emerge.",
  },
  {
    scenario: "Someone describes losing a pet. Their lower lip tightens, they look slightly upward to the left, and their voice flattens.",
    options: ["Grief", "Nostalgia", "Regret", "Guilt"],
    answer: "Grief",
    insight: "The lower lip tightening (chin muscle contraction) combined with upward gaze and flat vocal tone indicates active suppression of grief.",
  },
  {
    scenario: "During a negotiation, a person smiles but the smile doesn't reach their eyes. They maintain intense eye contact and speak in a measured, even tone.",
    options: ["Confidence", "Deception", "Concentration", "Politeness"],
    answer: "Deception",
    insight: "A smile that only involves the mouth — not the orbicularis oculi eye muscle — is a social mask. The Duchenne smile involves both.",
  },
  {
    scenario: "A student receives their exam result. Their face is neutral, but they exhale slowly through their nose and their shoulders drop slightly.",
    options: ["Disappointment", "Relief", "Resignation", "Indifference"],
    answer: "Relief",
    insight: "A slow nasal exhale with shoulder descent is the body releasing held tension — a physiological signature of relief.",
  },
  {
    scenario: "A person reads a message on their phone. One corner of their mouth lifts very briefly — under half a second — before returning to neutral.",
    options: ["Contempt", "Amusement", "Smugness", "Satisfaction"],
    answer: "Contempt",
    insight: "A unilateral (one-sided) lip corner raise lasting under one second is the most reliable micro-expression for contempt.",
  },
];

export function EmotionRecognition() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const q = ROUNDS[idx];

  const choose = useCallback((opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= ROUNDS.length) {
        setPhase("done");
      } else {
        setIdx(i => i + 1);
        setSelected(null);
      }
    }, 1200);
  }, [selected, q, idx]);

  const reset = () => { setPhase("intro"); setIdx(0); setScore(0); setSelected(null); };
  const pct = Math.round((score / ROUNDS.length) * 100);

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto" data-testid="emotion-recognition-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[#999] mb-4 text-lg">Read each scenario carefully and identify the primary emotion being expressed.</p>
            <p className="text-[#666] text-sm mb-8">{ROUNDS.length} scenarios. Trust subtle cues, not the obvious.</p>
            <button onClick={() => setPhase("playing")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Reading</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="w-full text-left">
            <div className="flex justify-between mb-4">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{ROUNDS.length}</span>
              <span className="text-[#F4E8D4] font-mono text-sm">Score: {score}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-6">
              <div className="bg-[#A32020] h-1 rounded-full" style={{ width: `${(idx / ROUNDS.length) * 100}%` }} />
            </div>
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6 italic text-[#999] leading-relaxed">
              "{q.scenario}"
            </div>
            <p className="text-[#F4E8D4] font-medium mb-4 text-center">What is this person feeling?</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                  className={`py-4 rounded-xl border font-medium transition-all text-sm ${
                    selected === opt
                      ? opt === q.answer ? "bg-green-500/20 border-green-500 text-green-400" : "bg-[#A32020]/20 border-[#A32020] text-[#A32020]"
                      : selected && opt === q.answer ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-[#151515] border-[#2a2a2a] text-[#F4E8D4] hover:border-[#A32020]"
                  }`}
                  data-testid={`option-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a0505] border border-[#A32020]/30 rounded-lg p-4">
                <p className="text-[#A32020] text-xs font-mono mb-1">PSYCHOLOGICAL INSIGHT</p>
                <p className="text-[#999] text-sm text-left">{q.insight}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}<span className="text-3xl text-[#666]">/{ROUNDS.length}</span></div>
            <div className="text-[#A32020] font-mono mb-4">{pct}% empathic accuracy</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {pct >= 75 ? "High empathic accuracy. You read subtle emotional signals with precision — a rare and powerful social skill." :
               pct >= 50 ? "Moderate emotional literacy. You catch the obvious signals; the micro-expressions will come with practice." :
               "Emotion recognition is a learnable skill. The more you study human behavior, the sharper your reading becomes."}
            </p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
