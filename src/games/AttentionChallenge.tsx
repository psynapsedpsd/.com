import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Target {
  id: number;
  x: number;
  y: number;
  alive: boolean;
}

export function AttentionChallenge() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const idRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnTarget = useCallback(() => {
    const id = idRef.current++;
    const x = 5 + Math.random() * 85;
    const y = 5 + Math.random() * 85;
    setTargets(prev => [...prev, { id, x, y, alive: true }]);
    setTimeout(() => {
      setTargets(prev => {
        const t = prev.find(t => t.id === id);
        if (t && t.alive) setMissed(m => m + 1);
        return prev.filter(t => t.id !== id);
      });
    }, 1800);
  }, []);

  const start = useCallback(() => {
    setPhase("playing");
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setTargets([]);
    idRef.current = 0;
    intervalRef.current = setInterval(spawnTarget, 600);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [spawnTarget]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const click = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(s => s + 1);
  };

  const accuracy = score + missed > 0 ? Math.round((score / (score + missed)) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6 text-center" data-testid="attention-challenge-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg">Click the red circles as fast as they appear. Miss too many and your score suffers.</p>
            <p className="text-[#666] text-sm mb-8">30 seconds. Tap as many targets as you can.</p>
            <button onClick={start} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Start</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <div className="flex justify-between mb-4 font-mono">
              <span className="text-green-400">Hit: {score}</span>
              <span className={`font-bold text-xl ${timeLeft <= 5 ? "text-[#A32020]" : "text-[#F4E8D4]"}`}>{timeLeft}s</span>
              <span className="text-[#A32020]">Miss: {missed}</span>
            </div>
            <div className="relative w-full bg-[#0d0d0d] rounded-xl border border-[#2a2a2a] overflow-hidden" style={{ height: 340 }}>
              {targets.map(t => (
                <motion.button
                  key={t.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => click(t.id)}
                  className="absolute w-10 h-10 rounded-full bg-[#A32020] hover:bg-[#D93A3A] border-2 border-[#D93A3A] shadow-[0_0_20px_rgba(163,32,32,0.6)] cursor-pointer"
                  style={{ left: `${t.x}%`, top: `${t.y}%`, transform: "translate(-50%, -50%)" }}
                  data-testid={`target-${t.id}`}
                />
              ))}
              {targets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[#333] font-mono text-sm">Waiting for targets...</div>
              )}
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}</div>
            <div className="text-[#A32020] font-mono mb-2">targets hit</div>
            <div className="text-[#F4E8D4] mb-4">{accuracy}% accuracy ({missed} missed)</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {accuracy >= 85 ? "Outstanding focus. Your attentional system operates with precision." :
               accuracy >= 65 ? "Good selective attention. You tracked most targets effectively." :
               "Sustained attention is trainable. Try again to improve your focus tracking."}
            </p>
            <button onClick={() => { setPhase("intro"); }} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
