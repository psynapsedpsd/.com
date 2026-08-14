import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRID = 5;
const TOTAL = GRID * GRID;

function shuffle(arr: number[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FocusTrainer() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [next, setNext] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lastError, setLastError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    const nums = shuffle(Array.from({ length: TOTAL }, (_, i) => i + 1));
    setNumbers(nums);
    setNext(1);
    setErrors(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase("playing");
    timerRef.current = setInterval(() => setElapsed(Date.now() - Date.now()), 100);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, startTime]);

  const click = useCallback((n: number) => {
    if (n === next) {
      setLastError(false);
      if (next === TOTAL) {
        if (timerRef.current) clearInterval(timerRef.current);
        setElapsed(Date.now() - startTime);
        setPhase("done");
      } else {
        setNext(n + 1);
      }
    } else {
      setErrors(e => e + 1);
      setLastError(true);
      setTimeout(() => setLastError(false), 400);
    }
  }, [next, startTime]);

  const fmt = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  const getRating = (ms: number) => {
    if (ms < 30000) return "Exceptional Focus";
    if (ms < 50000) return "Above Average";
    if (ms < 80000) return "Average";
    return "Keep Practicing";
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center" data-testid="focus-trainer-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg">Click numbers 1 through {TOTAL} in order, as fast as you can.</p>
            <p className="text-[#666] text-sm mb-8">Numbers are randomly placed. Stay focused — errors cost time.</p>
            <button onClick={start} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Start</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <span className="text-[#F4E8D4] font-mono">Next: <span className="text-[#A32020] font-bold text-xl">{next}</span></span>
              <span className="text-[#666] font-mono">{fmt(elapsed)}</span>
              <span className="text-[#A32020] font-mono">Errors: {errors}</span>
            </div>
            <div className={`grid gap-2 transition-all ${lastError ? "shake" : ""}`} style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
              {numbers.map((n, i) => (
                <motion.button
                  key={i}
                  onClick={() => click(n)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className={`aspect-square rounded-lg font-bold font-mono text-base border transition-all ${
                    n < next
                      ? "bg-[#A32020]/20 border-[#A32020]/30 text-[#A32020]/50 cursor-default"
                      : n === next
                      ? "bg-[#A32020] border-[#D93A3A] text-[#F4E8D4] shadow-[0_0_16px_rgba(163,32,32,0.5)] cursor-pointer"
                      : "bg-[#151515] border-[#2a2a2a] text-[#666] hover:border-[#333] cursor-pointer"
                  }`}
                  data-testid={`num-${n}`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-6xl font-serif font-bold text-[#F4E8D4] mb-2">{fmt(elapsed)}</div>
            <div className="text-[#A32020] font-mono mb-2">completed with {errors} error{errors !== 1 ? "s" : ""}</div>
            <div className="text-xl font-serif text-[#F4E8D4] mb-6">{getRating(elapsed)}</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">This test measures sustained visual attention and executive scanning — key components of working memory.</p>
            <button onClick={start} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
