import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function generateRound(level: number) {
  const bases = ["#A32020", "#1a6e3e", "#1a3a6e", "#6e1a5e", "#6e5e1a"];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const { r, g, b } = hexToRgb(base);
  const gridSize = level < 4 ? 4 : level < 7 ? 9 : 16;
  const diff = Math.max(8, 60 - level * 5);
  const oddIdx = Math.floor(Math.random() * gridSize);
  const oddR = Math.min(255, Math.max(0, r + diff));
  const oddColor = `rgb(${oddR}, ${Math.max(0, g - diff / 2)}, ${Math.min(255, b + diff / 2)})`;
  const baseColor = `rgb(${r}, ${g}, ${b})`;
  return { gridSize, oddIdx, baseColor, oddColor };
}

export function ColorPerception() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(() => generateRound(1));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (phase !== "playing" || feedback) return;
    if (timeLeft <= 0) { handleGuess(-1); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, feedback]);

  const handleGuess = useCallback((idx: number) => {
    if (feedback) return;
    const correct = idx === round.oddIdx;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore(s => s + level * 10);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) { setTimeout(() => setPhase("done"), 700); return; }
    }
    setTimeout(() => {
      const newLevel = correct ? level + 1 : Math.max(1, level - 1);
      setLevel(newLevel);
      setRound(generateRound(newLevel));
      setFeedback(null);
      setTimeLeft(Math.max(5, 12 - Math.floor(newLevel / 2)));
    }, 700);
  }, [feedback, round, level, lives]);

  const cols = round.gridSize === 4 ? 2 : round.gridSize === 9 ? 3 : 4;

  return (
    <div className="flex flex-col items-center gap-6 text-center" data-testid="color-perception-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg">Find the square that has a slightly different color.</p>
            <p className="text-[#666] text-sm mb-8">It gets harder as you level up. 3 lives.</p>
            <button onClick={() => setPhase("playing")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Start</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="flex justify-between w-full items-center">
              <span className="font-mono text-[#666]">Level {level}</span>
              <span className={`font-mono font-bold text-xl ${timeLeft <= 3 ? "text-[#A32020]" : "text-[#F4E8D4]"}`}>{timeLeft}s</span>
              <div className="flex gap-1">{[1, 2, 3].map(i => <span key={i} className={`text-lg ${i <= lives ? "text-[#A32020]" : "text-[#2a2a2a]"}`}>♥</span>)}</div>
            </div>
            <div className="font-mono text-[#A32020]">Score: {score}</div>

            <motion.div
              key={level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`grid gap-2`}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {Array.from({ length: round.gridSize }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleGuess(i)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-lg border-2 transition-all ${
                    feedback && i === round.oddIdx
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: i === round.oddIdx ? round.oddColor : round.baseColor }}
                  data-testid={`square-${i}`}
                />
              ))}
            </motion.div>

            {feedback && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-bold text-lg ${feedback === "correct" ? "text-green-400" : "text-[#A32020]"}`}>
                {feedback === "correct" ? "Correct!" : "Wrong!"}
              </motion.p>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}</div>
            <div className="text-[#A32020] font-mono mb-4">points — reached level {level}</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {level >= 8 ? "Extraordinary color discrimination. Your visual cortex is highly refined." :
               level >= 5 ? "Good perceptual sensitivity. Your brain processes subtle color differences well." :
               "Color perception is trainable. Your eyes will sharpen with practice."}
            </p>
            <button onClick={() => { setPhase("intro"); setLevel(1); setScore(0); setLives(3); setRound(generateRound(1)); }} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
