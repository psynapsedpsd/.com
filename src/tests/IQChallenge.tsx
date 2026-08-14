import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  { q: "If all Bloops are Razzles, and all Razzles are Lazzles, then all Bloops are:", options: ["Not Lazzles", "Lazzles", "Razzles only", "Uncertain"], answer: "Lazzles" },
  { q: "What number comes next: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "38"], answer: "42" },
  { q: "A car travels 60 km in 45 minutes. What is its speed in km/h?", options: ["80 km/h", "75 km/h", "90 km/h", "70 km/h"], answer: "80 km/h" },
  { q: "Which shape completes the pattern? △ ○ △ ○ △ ?", options: ["△", "○", "□", "◇"], answer: "○" },
  { q: "If you rearrange the letters 'CIFAIPC', you get the name of a:", options: ["Country", "Animal", "Ocean", "City"], answer: "Ocean" },
  { q: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "22.5°"], answer: "7.5°" },
  { q: "Which number is the odd one out: 3, 5, 7, 9, 11, 13?", options: ["3", "5", "9", "13"], answer: "9" },
  { q: "If 5 workers can build a wall in 10 days, how many days for 10 workers?", options: ["10", "20", "2", "5"], answer: "5" },
  { q: "Complete the analogy: Book is to Author as Painting is to:", options: ["Museum", "Canvas", "Artist", "Color"], answer: "Artist" },
  { q: "What is the next term: 1, 8, 27, 64, 125, ?", options: ["196", "216", "200", "225"], answer: "216" },
  { q: "In a group of 30 students, 18 play chess and 16 play tennis. What is the minimum who play both?", options: ["2", "4", "6", "8"], answer: "4" },
  { q: "Mirror image question: which figure is the exact mirror of the letter 'R'?", options: ["Я", "P", "R", "ᴚ"], answer: "Я" },
];

export function IQChallenge() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (timeLeft <= 0) { handleNext(null); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, idx]);

  const handleNext = useCallback((sel: string | null) => {
    const correct = sel === QUESTIONS[idx].answer;
    setAnswers(prev => [...prev, correct]);
    if (sel) setScore(s => s + (correct ? 1 : 0));
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) {
        setPhase("result");
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setTimeLeft(30);
      }
    }, 600);
  }, [idx]);

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    handleNext(opt);
  };

  const reset = () => { setPhase("intro"); setIdx(0); setScore(0); setSelected(null); setTimeLeft(30); setAnswers([]); };
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const estimatedIQ = 85 + Math.round((score / QUESTIONS.length) * 45);

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="iq-challenge">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">A series of logic, spatial, numerical, and verbal reasoning challenges to estimate your cognitive range.</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} questions · 30 seconds each · No calculator needed</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Challenge</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{QUESTIONS.length}</span>
              <span className={`font-mono font-bold text-xl ${timeLeft <= 10 ? "text-[#A32020]" : "text-[#F4E8D4]"}`}>{timeLeft}s</span>
              <span className="text-[#F4E8D4] font-mono text-sm">Score: {score}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-8 overflow-hidden">
              <motion.div className={`h-1 rounded-full transition-all ${timeLeft <= 10 ? "bg-[#A32020]" : "bg-[#A32020]"}`} style={{ width: `${(timeLeft / 30) * 100}%` }} />
            </div>
            <p className="text-lg font-serif text-[#F4E8D4] mb-8 bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] leading-relaxed">{QUESTIONS[idx].q}</p>
            <div className="grid grid-cols-2 gap-3">
              {QUESTIONS[idx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                  className={`py-4 px-3 rounded-xl border font-mono text-sm transition-all ${
                    selected === opt
                      ? opt === QUESTIONS[idx].answer ? "bg-green-500/20 border-green-500 text-green-400" : "bg-[#A32020]/20 border-[#A32020] text-[#A32020]"
                      : selected && opt === QUESTIONS[idx].answer ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-[#151515] border-[#2a2a2a] text-[#F4E8D4] hover:border-[#A32020]"
                  }`}
                  data-testid={`option-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <p className="text-[#666] font-mono text-sm mb-1">Estimated IQ Range</p>
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{estimatedIQ}</div>
            <div className="text-[#A32020] font-mono mb-6">{score}/{QUESTIONS.length} correct · {pct}%</div>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {answers.map((correct, i) => (
                <div key={i} className={`h-2 rounded-full ${correct ? "bg-green-500" : "bg-[#A32020]"}`} />
              ))}
            </div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto text-sm">
              {pct >= 80 ? "Outstanding cognitive performance. You demonstrate strong logical and analytical reasoning." :
               pct >= 60 ? "Above-average performance across multiple cognitive domains." :
               "This test measures specific reasoning skills. IQ is multidimensional — keep challenging your mind."}
            </p>
            <p className="text-[#444] text-xs mb-6">Note: This is an estimation for educational purposes only.</p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
