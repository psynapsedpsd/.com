import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRID_SIZE = 7;
const DURATION = 45;

function makeGrid(target: number) {
  const cells: number[] = [];
  const used = new Set<number>();
  used.add(target);
  cells[target] = 1;
  let distractor = 0;
  while (distractor < GRID_SIZE * GRID_SIZE) {
    if (!used.has(distractor)) cells[distractor] = 0;
    distractor++;
  }
  return cells;
}

export function FocusTest() {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [targetPos, setTargetPos] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const moveInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (moveInterval.current) clearInterval(moveInterval.current);
    if (timerInterval.current) clearInterval(timerInterval.current);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setMisses(0);
    setTimeLeft(DURATION);
    setFlash(null);
    const initialPos = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
    setTargetPos(initialPos);
    setPhase("playing");

    const speed = 1200;
    moveInterval.current = setInterval(() => {
      setTargetPos(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    }, speed);

    timerInterval.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stop();
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  const clickCell = useCallback((idx: number) => {
    if (idx === targetPos) {
      setScore(s => s + 1);
      setFlash("hit");
      setTargetPos(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    } else {
      setMisses(m => m + 1);
      setFlash("miss");
    }
    setTimeout(() => setFlash(null), 200);
  }, [targetPos]);

  const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6 text-center" data-testid="focus-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">A single target appears among empty cells. Click it as quickly as possible. It moves to a new position every 1.2 seconds.</p>
            <p className="text-[#666] text-sm mb-8">{DURATION} seconds · Avoid clicking empty cells · Score = hits</p>
            <button onClick={start} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Test</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 w-full">
            <div className="flex justify-between w-full max-w-sm">
              <span className="text-green-400 font-mono">Hits: {score}</span>
              <span className={`font-mono font-bold text-xl ${timeLeft <= 10 ? "text-[#A32020]" : "text-[#F4E8D4]"}`}>{timeLeft}s</span>
              <span className="text-[#A32020] font-mono">Miss: {misses}</span>
            </div>
            <div className={`grid gap-1.5 rounded-xl p-3 border transition-colors ${flash === "hit" ? "border-green-500/50 bg-green-500/5" : flash === "miss" ? "border-[#A32020]/50 bg-[#A32020]/5" : "border-[#2a2a2a] bg-[#0d0d0d]"}`}
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => clickCell(i)}
                  className={`w-10 h-10 rounded-md border transition-all ${
                    i === targetPos
                      ? "bg-[#A32020] border-[#D93A3A] shadow-[0_0_12px_rgba(163,32,32,0.6)] cursor-pointer"
                      : "bg-[#151515] border-[#222] hover:bg-[#1e1e1e] cursor-pointer"
                  }`}
                  data-testid={i === targetPos ? "target-cell" : `cell-${i}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full max-w-md py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}</div>
            <div className="text-[#A32020] font-mono mb-2">targets hit · {accuracy}% accuracy</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {score >= 25 ? "Outstanding sustained attention. Your focus system is highly responsive." :
               score >= 15 ? "Good attentional control. You tracked and responded to the target well." :
               "Sustained focus is trainable. Brief daily practice yields measurable improvement within weeks."}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-bold text-[#F4E8D4]">{score}</div>
                <div className="text-xs text-[#666]">Hits</div>
              </div>
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-bold text-[#F4E8D4]">{misses}</div>
                <div className="text-xs text-[#666]">Misses</div>
              </div>
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-bold text-[#F4E8D4]">{accuracy}%</div>
                <div className="text-xs text-[#666]">Accuracy</div>
              </div>
            </div>
            <button onClick={start} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
