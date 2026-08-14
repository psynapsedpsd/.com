import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "intro" | "waiting" | "ready" | "clicked" | "tooEarly" | "done";

export function ReactionSpeed() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ROUNDS = 5;

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const startRound = useCallback(() => {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setPhase("ready");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "waiting") {
      clearTimer();
      setPhase("tooEarly");
    } else if (phase === "ready") {
      const t = Date.now() - startTime;
      setLastTime(t);
      setTimes(prev => {
        const next = [...prev, t];
        if (next.length >= ROUNDS) {
          setTimeout(() => setPhase("done"), 600);
        } else {
          setTimeout(() => startRound(), 1000);
        }
        return next;
      });
      setPhase("clicked");
    }
  }, [phase, startTime, startRound]);

  useEffect(() => () => clearTimer(), []);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  const getRating = (ms: number) => {
    if (ms < 200) return { label: "Exceptional", color: "#22c55e" };
    if (ms < 250) return { label: "Above Average", color: "#84cc16" };
    if (ms < 300) return { label: "Average", color: "#eab308" };
    if (ms < 400) return { label: "Below Average", color: "#f97316" };
    return { label: "Keep Practicing", color: "#ef4444" };
  };

  return (
    <div className="flex flex-col items-center gap-8 text-center min-h-[400px] justify-center" data-testid="reaction-speed-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-sm">
            <p className="text-[#999] mb-6 text-lg">When the circle turns <span className="text-green-400 font-bold">green</span>, click it as fast as you can.</p>
            <p className="text-[#666] text-sm mb-8">{ROUNDS} rounds — don't click early!</p>
            <button onClick={startRound} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Start</button>
          </motion.div>
        )}

        {(phase === "waiting" || phase === "ready" || phase === "clicked" || phase === "tooEarly") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
            <div className="text-[#666] font-mono">Round {times.length + (phase === "clicked" ? 0 : 1)} of {ROUNDS}</div>

            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-56 h-56 rounded-full text-xl font-bold transition-all duration-150 border-4 cursor-pointer select-none ${
                phase === "ready"
                  ? "bg-green-500 border-green-400 text-white shadow-[0_0_60px_rgba(34,197,94,0.6)]"
                  : phase === "tooEarly"
                  ? "bg-[#A32020] border-[#D93A3A] text-[#F4E8D4]"
                  : phase === "clicked"
                  ? "bg-[#1e1e1e] border-[#333] text-green-400"
                  : "bg-[#151515] border-[#2a2a2a] text-[#444]"
              }`}
              data-testid="reaction-circle"
            >
              {phase === "waiting" && "Wait..."}
              {phase === "ready" && "CLICK!"}
              {phase === "clicked" && `${lastTime}ms`}
              {phase === "tooEarly" && "Too Early!"}
            </motion.button>

            {phase === "tooEarly" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[#A32020] mb-4">Wait for green before clicking.</p>
                <button onClick={startRound} className="px-6 py-2 bg-[#1e1e1e] border border-[#333] text-[#F4E8D4] rounded hover:border-[#A32020] transition-colors">Try Again</button>
              </motion.div>
            )}

            {times.length > 0 && phase !== "tooEarly" && (
              <div className="flex gap-3">
                {times.map((t, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-mono text-[#F4E8D4]">{t}ms</div>
                    <div className="text-xs text-[#666]">R{i + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="text-6xl font-serif font-bold text-[#F4E8D4] mb-1">{avg}<span className="text-2xl text-[#666]">ms</span></div>
            <div className="text-sm font-mono mb-2" style={{ color: getRating(avg).color }}>Average Reaction Time</div>
            <div className="text-2xl font-serif mb-4" style={{ color: getRating(avg).color }}>{getRating(avg).label}</div>
            <p className="text-[#666] text-sm mb-6 max-w-xs mx-auto">Human average is ~250ms. Elite athletes react in under 180ms.</p>
            <div className="flex gap-3 justify-center mb-6">
              {times.map((t, i) => (
                <div key={i} className="text-center p-2 bg-[#151515] rounded border border-[#2a2a2a]">
                  <div className="text-sm font-mono text-[#F4E8D4]">{t}ms</div>
                  <div className="text-xs text-[#666]">R{i + 1}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { setTimes([]); setPhase("intro"); }} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
