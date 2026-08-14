import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "intro" | "waiting" | "ready" | "clicked" | "tooEarly" | "done";

export function ReactionTimeTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ROUNDS = 7;

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const startRound = useCallback(() => {
    setPhase("waiting");
    const delay = 2000 + Math.random() * 4000;
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
        if (next.length >= ROUNDS) setTimeout(() => setPhase("done"), 600);
        else setTimeout(() => startRound(), 1200);
        return next;
      });
      setPhase("clicked");
    }
  }, [phase, startTime, startRound]);

  useEffect(() => () => clearTimer(), []);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b) / times.length) : 0;
  const best = times.length ? Math.min(...times) : 0;

  const classify = (ms: number) => {
    if (ms < 180) return { label: "Elite Reflexes", color: "#22c55e", note: "Top 1% — comparable to professional athletes." };
    if (ms < 220) return { label: "Excellent", color: "#84cc16", note: "Your neural response speed is significantly above average." };
    if (ms < 260) return { label: "Above Average", color: "#eab308", note: "Your reactions are faster than most of the population." };
    if (ms < 320) return { label: "Average", color: "#f97316", note: "Typical human reaction time falls between 200–300ms." };
    return { label: "Below Average", color: "#ef4444", note: "Factors like fatigue, caffeine, and age affect reaction time significantly." };
  };

  const result = classify(avg);

  return (
    <div className="flex flex-col items-center gap-8 text-center min-h-[400px] justify-center" data-testid="reaction-time-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Reaction time is a fundamental measure of neural processing speed — the time between perceiving a stimulus and responding to it.</p>
            <p className="text-[#666] text-sm mb-8">Click the circle the moment it turns green. {ROUNDS} trials. Avoid anticipating.</p>
            <button onClick={startRound} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Test</button>
          </motion.div>
        )}

        {(phase === "waiting" || phase === "ready" || phase === "clicked" || phase === "tooEarly") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
            <div className="text-[#666] font-mono">Trial {Math.min(times.length + 1, ROUNDS)} of {ROUNDS}</div>
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`w-56 h-56 rounded-full font-bold text-xl border-4 cursor-pointer select-none transition-all duration-100 ${
                phase === "ready" ? "bg-green-500 border-green-400 text-white shadow-[0_0_80px_rgba(34,197,94,0.7)]" :
                phase === "tooEarly" ? "bg-[#A32020] border-[#D93A3A] text-[#F4E8D4]" :
                phase === "clicked" ? "bg-[#1e1e1e] border-[#333] text-green-400" :
                "bg-[#151515] border-[#2a2a2a] text-[#333]"
              }`}
              data-testid="reaction-target"
            >
              {phase === "waiting" && "Wait..."}
              {phase === "ready" && "NOW!"}
              {phase === "clicked" && `${lastTime}ms`}
              {phase === "tooEarly" && "Too Early!"}
            </motion.button>
            {phase === "tooEarly" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[#A32020] mb-3 text-sm">Premature response — wait for the green signal.</p>
                <button onClick={startRound} className="px-6 py-2 bg-[#1e1e1e] border border-[#333] text-[#F4E8D4] rounded hover:border-[#A32020] transition-colors">Continue</button>
              </motion.div>
            )}
            {times.length > 0 && phase !== "tooEarly" && (
              <div className="flex gap-3 flex-wrap justify-center">
                {times.map((t, i) => (
                  <div key={i} className="text-center p-2 bg-[#151515] rounded border border-[#2a2a2a] min-w-[52px]">
                    <div className="text-sm font-mono text-[#F4E8D4]">{t}</div>
                    <div className="text-xs text-[#666]">ms</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full max-w-md">
            <p className="text-[#666] font-mono text-sm mb-1">Average Reaction Time</p>
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-1">{avg}<span className="text-2xl text-[#666]">ms</span></div>
            <div className="text-xl font-serif mb-1" style={{ color: result.color }}>{result.label}</div>
            <p className="text-[#666] text-sm mb-6">{result.note}</p>
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-mono font-bold text-[#F4E8D4]">{best}ms</div>
                <div className="text-xs text-[#666]">Best</div>
              </div>
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-mono font-bold text-[#F4E8D4]">{avg}ms</div>
                <div className="text-xs text-[#666]">Average</div>
              </div>
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-3">
                <div className="text-2xl font-mono font-bold text-[#F4E8D4]">{ROUNDS}</div>
                <div className="text-xs text-[#666]">Trials</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center mb-6">
              {times.map((t, i) => (
                <div key={i} className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: t === best ? "#22c55e22" : "#151515", color: t === best ? "#22c55e" : "#666", border: `1px solid ${t === best ? "#22c55e44" : "#2a2a2a"}` }}>
                  T{i + 1}: {t}ms
                </div>
              ))}
            </div>
            <button onClick={() => { setTimes([]); setPhase("intro"); }} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
