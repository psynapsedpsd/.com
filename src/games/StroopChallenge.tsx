import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { name: "RED", hex: "#e53e3e" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "PURPLE", hex: "#a855f7" },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRound() {
  const word = randomItem(COLORS);
  let ink = randomItem(COLORS);
  while (ink.name === word.name) ink = randomItem(COLORS);
  return { word, ink };
}

export function StroopChallenge() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [round, setRound] = useState(generateRound());
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const TOTAL = 20;

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("done"); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const answer = useCallback((colorName: string) => {
    const correct = colorName === round.ink.name;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
    const next = current + 1;
    if (next >= TOTAL) {
      setTimeout(() => setPhase("done"), 400);
    } else {
      setTimeout(() => {
        setCurrent(next);
        setRound(generateRound());
        setFeedback(null);
      }, 400);
    }
  }, [round, current]);

  const start = () => {
    setPhase("playing");
    setRound(generateRound());
    setCurrent(0);
    setScore(0);
    setTimeLeft(60);
    setFeedback(null);
  };

  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div className="flex flex-col items-center gap-8 text-center" data-testid="stroop-challenge">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-2 text-lg">The word shown is a color name — but written in a <em>different</em> ink color.</p>
            <p className="text-[#F4E8D4] font-bold text-xl mb-6">Select the <span className="text-[#A32020]">INK COLOR</span>, not the word.</p>
            <div className="mb-6 p-6 bg-[#151515] rounded-xl border border-[#2a2a2a]">
              <div className="text-5xl font-black mb-4" style={{ color: "#3b82f6" }}>RED</div>
              <p className="text-sm text-[#666]">Answer: BLUE (the ink color)</p>
            </div>
            <button onClick={start} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Start Challenge</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[#666] font-mono">{current + 1} / {TOTAL}</span>
              <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? "text-[#A32020]" : "text-[#F4E8D4]"}`}>{timeLeft}s</span>
              <span className="text-[#666] font-mono">Score: {score}</span>
            </div>

            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-10">
              <div className="bg-[#A32020] h-1 rounded-full transition-all" style={{ width: `${((current) / TOTAL) * 100}%` }} />
            </div>

            <motion.div
              key={current}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-7xl font-black mb-10 py-8 rounded-xl ${feedback === "correct" ? "text-green-400" : feedback === "wrong" ? "text-red-400" : ""}`}
              style={{ color: feedback ? undefined : round.ink.hex }}
            >
              {round.word.name}
            </motion.div>

            <div className="grid grid-cols-5 gap-3">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => answer(c.name)}
                  disabled={!!feedback}
                  className="py-3 rounded-lg font-bold text-sm border border-[#2a2a2a] hover:border-[#A32020] transition-all"
                  style={{ backgroundColor: c.hex + "22", color: c.hex }}
                  data-testid={`color-btn-${c.name.toLowerCase()}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}<span className="text-[#666] text-3xl">/{TOTAL}</span></div>
            <div className="text-[#A32020] font-mono mb-6">{pct}% accuracy</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {pct >= 80 ? "Excellent cognitive control! You resisted the interference very well." :
               pct >= 60 ? "Good effort. The Stroop effect challenged your automatic responses." :
               "The Stroop effect is powerful — your brain reads words automatically. Keep practicing!"}
            </p>
            <button onClick={start} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
