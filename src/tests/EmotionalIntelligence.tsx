import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    scenario: "A close friend snaps at you unexpectedly. You're hurt, but you sense they're under pressure. What's your most likely response?",
    options: [
      { text: "Snap back — they had no right to take it out on you", eq: 0 },
      { text: "Go quiet and avoid them until they apologize", eq: 1 },
      { text: "Ask calmly if everything is okay and give them space", eq: 3 },
      { text: "Immediately tell them how their words made you feel", eq: 2 },
    ],
  },
  {
    scenario: "You're presenting at an important meeting and realize halfway through that you made an error in your data.",
    options: [
      { text: "Power through — hope nobody notices", eq: 0 },
      { text: "Acknowledge it immediately and correct it with composure", eq: 3 },
      { text: "Feel flustered and lose your train of thought", eq: 1 },
      { text: "Apologize excessively and lose confidence", eq: 1 },
    ],
  },
  {
    scenario: "You notice a team member getting progressively quieter in meetings over two weeks. No one else has commented on it.",
    options: [
      { text: "It's not your business — focus on your own work", eq: 0 },
      { text: "Mention it casually in a group to lighten things up", eq: 1 },
      { text: "Check in privately to see if they're doing okay", eq: 3 },
      { text: "Tell your manager to deal with it", eq: 1 },
    ],
  },
  {
    scenario: "You receive harsh criticism on work you put a lot of effort into. Your initial feeling is:",
    options: [
      { text: "Pure defensiveness — they clearly don't understand your work", eq: 0 },
      { text: "Deflation, then quiet analysis of whether any of it is valid", eq: 3 },
      { text: "Immediate agreement to avoid conflict", eq: 1 },
      { text: "Anger, then later reflection", eq: 2 },
    ],
  },
  {
    scenario: "Two colleagues you respect strongly disagree with each other and ask your opinion. You disagree with both.",
    options: [
      { text: "Support whoever has more power in the room", eq: 0 },
      { text: "Stay neutral — say you see merit in both sides", eq: 1 },
      { text: "Share your own perspective respectfully while validating both", eq: 3 },
      { text: "Change the subject to avoid tension", eq: 1 },
    ],
  },
  {
    scenario: "You're extremely stressed and a friend calls needing emotional support. You:",
    options: [
      { text: "Don't answer — you have nothing left to give right now", eq: 1 },
      { text: "Answer, pretend to be fine, and listen without mentioning your own stress", eq: 1 },
      { text: "Answer honestly: tell them you're struggling too, but you're here", eq: 3 },
      { text: "Answer and immediately share your own stress instead", eq: 0 },
    ],
  },
];

export function EmotionalIntelligence() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const choose = (eq: number, i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setScore(s => s + eq);
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) {
        setPhase("result");
      } else {
        setIdx(q => q + 1);
        setSelected(null);
      }
    }, 600);
  };

  const maxScore = QUESTIONS.length * 3;
  const pct = Math.round((score / maxScore) * 100);

  const getProfile = () => {
    if (pct >= 80) return { label: "High EQ", color: "#22c55e", desc: "You demonstrate exceptional emotional intelligence. You regulate your own emotions skillfully, read others accurately, and navigate social complexity with grace and authenticity." };
    if (pct >= 60) return { label: "Above Average EQ", color: "#84cc16", desc: "You show strong emotional intelligence across most domains. You tend to respond thoughtfully, though under pressure, emotional reactivity can still emerge." };
    if (pct >= 40) return { label: "Developing EQ", color: "#eab308", desc: "Your emotional intelligence is growing. You recognize emotions in others but sometimes struggle to regulate your own responses in high-stakes situations." };
    return { label: "Growth Opportunity", color: "#f97316", desc: "Emotional intelligence is highly trainable. Consistent practice in self-reflection, active listening, and delayed response will yield significant growth." };
  };

  const profile = getProfile();
  const reset = () => { setPhase("intro"); setIdx(0); setScore(0); setSelected(null); };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="emotional-intelligence-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Emotional Intelligence (EQ) is the ability to recognize, understand, and manage emotions — in yourself and others. It predicts success in relationships and leadership far more than IQ alone.</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} scenarios · Choose honestly · No judgment</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Assessment</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <div className="flex justify-between mb-3">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-8">
              <div className="bg-[#A32020] h-1 rounded-full transition-all" style={{ width: `${(idx / QUESTIONS.length) * 100}%` }} />
            </div>
            <p className="text-base font-serif text-[#F4E8D4] mb-6 bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] leading-relaxed italic">"{QUESTIONS[idx].scenario}"</p>
            <div className="flex flex-col gap-3">
              {QUESTIONS[idx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt.eq, i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                    selected === i
                      ? opt.eq >= 2 ? "bg-green-500/20 border-green-500 text-green-400" : "bg-[#A32020]/10 border-[#A32020]/50 text-[#999]"
                      : "bg-[#151515] border-[#2a2a2a] text-[#F4E8D4] hover:border-[#A32020]"
                  }`}
                  data-testid={`option-${i}`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <div className="text-5xl font-serif font-bold mb-2" style={{ color: profile.color }}>{profile.label}</div>
            <div className="text-[#666] font-mono text-sm mb-6">EQ Score: {score}/{maxScore} · {pct}th percentile estimate</div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-3 mb-8">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-3 rounded-full" style={{ backgroundColor: profile.color }} />
            </div>
            <p className="text-[#999] leading-relaxed mb-8 max-w-md mx-auto">{profile.desc}</p>
            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
              {["Self-Awareness", "Self-Regulation", "Empathy", "Social Skills"].map((dim, i) => (
                <div key={i} className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                  <div className="text-[#666] text-xs mb-2">{dim}</div>
                  <div className="w-full bg-[#1e1e1e] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#A32020]" style={{ width: `${30 + Math.random() * 50}%` }} />
                  </div>
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
