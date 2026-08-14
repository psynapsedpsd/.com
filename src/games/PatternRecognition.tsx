import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  sequence: (string | number)[];
  options: (string | number)[];
  answer: string | number;
  hint: string;
}

const QUESTIONS: Question[] = [
  { sequence: [2, 4, 8, 16, "?"], options: [24, 32, 30, 28], answer: 32, hint: "Each number doubles" },
  { sequence: ["A", "C", "E", "G", "?"], options: ["H", "I", "J", "K"], answer: "I", hint: "Skip one letter each time" },
  { sequence: [1, 4, 9, 16, "?"], options: [20, 25, 21, 24], answer: 25, hint: "Perfect squares: 1², 2², 3²…" },
  { sequence: [3, 6, 12, 24, "?"], options: [36, 48, 42, 50], answer: 48, hint: "Multiply by 2 each time" },
  { sequence: ["Z", "Y", "X", "W", "?"], options: ["T", "V", "U", "S"], answer: "V", hint: "Alphabet in reverse" },
  { sequence: [1, 1, 2, 3, 5, "?"], options: [7, 8, 9, 6], answer: 8, hint: "Fibonacci sequence" },
  { sequence: [100, 90, 81, 73, "?"], options: [65, 66, 67, 64], answer: 66, hint: "Differences: -10, -9, -8, -7…" },
  { sequence: ["◆", "◆◆", "◆◆◆", "◆◆◆◆", "?"], options: ["◆◆◆◆◆◆", "◆◆◆◆◆", "◆◆◆◆◆◆◆", "◆◆◆◆◆◆◆◆"], answer: "◆◆◆◆◆", hint: "Add one shape each time" },
  { sequence: [2, 5, 11, 23, "?"], options: [45, 46, 47, 44], answer: 47, hint: "Multiply by 2 then add 1" },
  { sequence: [10, 20, 15, 30, 25, "?"], options: [45, 40, 50, 55], answer: 50, hint: "Alternate: ×2, then -5" },
];

export function PatternRecognition() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const q = QUESTIONS[idx];

  const choose = useCallback((opt: string | number) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) {
        setPhase("done");
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setShowHint(false);
      }
    }, 800);
  }, [selected, q, idx]);

  const reset = () => { setPhase("intro"); setIdx(0); setScore(0); setSelected(null); setShowHint(false); };

  const pct = Math.round((score / QUESTIONS.length) * 100);

  return (
    <div className="flex flex-col items-center gap-8 text-center" data-testid="pattern-recognition-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg">Find the missing element in each sequence.</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} patterns — use logic, not luck.</p>
            <button onClick={() => setPhase("playing")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#666] font-mono text-sm">Question {idx + 1}/{QUESTIONS.length}</span>
              <span className="text-[#F4E8D4] font-mono text-sm">Score: {score}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-8">
              <div className="bg-[#A32020] h-1 rounded-full transition-all" style={{ width: `${(idx / QUESTIONS.length) * 100}%` }} />
            </div>

            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap bg-[#151515] p-6 rounded-xl border border-[#2a2a2a]">
              {q.sequence.map((item, i) => (
                <div key={i} className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg border ${item === "?" ? "border-[#A32020] text-[#A32020] bg-[#A32020]/10 animate-pulse" : "border-[#333] text-[#F4E8D4]"}`}>
                  {item}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  disabled={selected !== null}
                  className={`py-4 rounded-xl border font-mono text-lg font-bold transition-all ${
                    selected === opt
                      ? opt === q.answer
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "bg-[#A32020]/20 border-[#A32020] text-[#A32020]"
                      : selected !== null && opt === q.answer
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-[#151515] border-[#2a2a2a] text-[#F4E8D4] hover:border-[#A32020] hover:bg-[#A32020]/10"
                  }`}
                  data-testid={`option-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button onClick={() => setShowHint(h => !h)} className="text-sm text-[#666] hover:text-[#F4E8D4] transition-colors underline">
              {showHint ? "Hide hint" : "Show hint"}
            </button>
            {showHint && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[#A32020] text-sm mt-2">
                Hint: {q.hint}
              </motion.p>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}<span className="text-3xl text-[#666]">/{QUESTIONS.length}</span></div>
            <div className="text-[#A32020] font-mono mb-4">{pct}% correct</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {pct >= 80 ? "Exceptional pattern recognition. Your analytical mind is sharp." :
               pct >= 60 ? "Good logical thinking. Patterns are becoming clearer." :
               "Pattern recognition is a trainable skill. Keep practicing!"}
            </p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
