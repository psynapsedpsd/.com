import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  "In the past month, how often have you felt upset because of something unexpected?",
  "How often have you felt unable to control the important things in your life?",
  "How often have you felt nervous and stressed?",
  "How often have you felt confident in your ability to handle personal problems?",
  "How often have you felt things were going your way?",
  "How often have you found that you could not cope with all the things you had to do?",
  "How often have you been able to control irritations in your life?",
  "How often have you felt on top of things?",
  "How often have you been angered because of things outside your control?",
  "How often have you felt difficulties were piling up so high you could not overcome them?",
];

const REVERSED = [3, 4, 6, 7];
const OPTIONS = ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"];

export function StressAssessment() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const answer = (val: number) => {
    const score = REVERSED.includes(idx) ? (4 - val) : val;
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (idx + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setIdx(i => i + 1);
    }
  };

  const total = answers.reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 4;
  const pct = Math.round((total / maxScore) * 100);

  const getLevel = () => {
    if (pct <= 25) return { label: "Low Stress", color: "#22c55e", desc: "Your perceived stress level is low. You feel mostly in control and able to manage life's demands effectively." };
    if (pct <= 50) return { label: "Moderate Stress", color: "#eab308", desc: "You experience a moderate level of stress. Some situations feel out of control, but you manage most of the time." };
    if (pct <= 75) return { label: "High Stress", color: "#f97316", desc: "You are experiencing significant stress. Consider mindfulness, exercise, or speaking to someone you trust." };
    return { label: "Very High Stress", color: "#ef4444", desc: "Your stress levels are very high. It may be beneficial to speak with a mental health professional." };
  };

  const level = getLevel();
  const reset = () => { setPhase("intro"); setIdx(0); setAnswers([]); };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="stress-assessment">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Based on the Perceived Stress Scale (PSS), this assessment measures how much you feel your life is unpredictable, uncontrollable, and overloaded.</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} questions · Think about the past month · No right answers</p>
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
            <p className="text-lg font-serif text-[#F4E8D4] mb-8 bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] leading-relaxed">{QUESTIONS[idx]}</p>
            <div className="flex flex-col gap-3">
              {OPTIONS.map((opt, i) => (
                <button key={i} onClick={() => answer(i)} className="w-full text-left px-5 py-4 bg-[#151515] border border-[#2a2a2a] rounded-xl text-[#F4E8D4] hover:border-[#A32020] hover:bg-[#A32020]/5 transition-all" data-testid={`option-${i}`}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <div className="text-5xl font-serif font-bold mb-2" style={{ color: level.color }}>{level.label}</div>
            <div className="text-[#666] font-mono text-sm mb-6">Score: {total}/{maxScore}</div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-3 mb-8">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-3 rounded-full" style={{ backgroundColor: level.color }} />
            </div>
            <p className="text-[#999] leading-relaxed mb-8 max-w-md mx-auto">{level.desc}</p>
            {pct > 50 && (
              <div className="bg-[#1a0505] border border-[#A32020]/30 rounded-xl p-5 mb-6 text-left">
                <p className="text-[#A32020] font-mono text-xs mb-3">EVIDENCE-BASED COPING STRATEGIES</p>
                <ul className="text-[#999] text-sm space-y-2">
                  <li>· Mindfulness meditation: even 10 minutes daily reduces cortisol significantly</li>
                  <li>· Physical exercise: 30 minutes of moderate activity 3x per week</li>
                  <li>· Social connection: share your experience with someone you trust</li>
                  <li>· Progressive muscle relaxation: tensing and releasing muscle groups</li>
                </ul>
              </div>
            )}
            <p className="text-[#333] text-xs mb-6">This is a screening tool, not a clinical diagnosis. If concerned, speak with a mental health professional.</p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
