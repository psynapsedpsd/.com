import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = ["🧠", "⚡", "🌙", "◆", "★", "▲", "●", "■", "♦", "✦", "⬟", "⬡"];

function getSequence(length: number) {
  return Array.from({ length }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)]);
}

export function MemoryTest() {
  const [phase, setPhase] = useState<"intro" | "memorize" | "recall" | "result">("intro");
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [showIdx, setShowIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const MAX_ROUNDS = 6;

  const startRound = useCallback((r: number) => {
    const seq = getSequence(r + 2);
    setSequence(seq);
    setShowIdx(0);
    setPhase("memorize");
  }, []);

  useEffect(() => {
    if (phase !== "memorize") return;
    if (showIdx >= sequence.length) {
      setTimeout(() => {
        setUserInput([]);
        setPhase("recall");
      }, 500);
      return;
    }
    const t = setTimeout(() => setShowIdx(i => i + 1), 800);
    return () => clearTimeout(t);
  }, [phase, showIdx, sequence.length]);

  const pick = useCallback((item: string) => {
    const next = [...userInput, item];
    setUserInput(next);
    if (next.length === sequence.length) {
      const correct = next.every((v, i) => v === sequence[i]);
      setFeedback(correct ? "correct" : "wrong");
      if (correct) {
        setScore(s => s + round * 10);
        setTimeout(() => {
          setFeedback(null);
          if (round >= MAX_ROUNDS) { setPhase("result"); } else { setRound(r => r + 1); startRound(round); }
        }, 800);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) { setTimeout(() => setPhase("result"), 800); }
        else {
          setTimeout(() => {
            setFeedback(null);
            setUserInput([]);
            startRound(round - 1);
          }, 1000);
        }
      }
    }
  }, [userInput, sequence, round, lives, startRound]);

  const reset = () => { setPhase("intro"); setRound(1); setScore(0); setLives(3); setSequence([]); setUserInput([]); setFeedback(null); };

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg mx-auto" data-testid="memory-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[#999] mb-4 text-lg leading-relaxed">A series of symbols will flash on screen. Memorize the sequence, then reproduce it in order.</p>
            <p className="text-[#666] text-sm mb-8">{MAX_ROUNDS} rounds · Sequences grow longer · 3 lives</p>
            <button onClick={() => startRound(1)} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Test</button>
          </motion.div>
        )}

        {phase === "memorize" && (
          <motion.div key="memorize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
            <p className="text-[#666] font-mono text-sm">Round {round} · Memorize this sequence</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {sequence.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: i < showIdx ? 1 : 0, scale: i < showIdx ? 1 : 0.5 }} className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${i < showIdx ? "border-[#A32020] bg-[#A32020]/10" : "border-[#2a2a2a] bg-[#151515]"}`}>
                  {i < showIdx ? item : ""}
                </motion.div>
              ))}
            </div>
            <p className="text-[#444] text-sm font-mono">Showing {showIdx}/{sequence.length}...</p>
          </motion.div>
        )}

        {phase === "recall" && (
          <motion.div key="recall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-6">
            <div className="flex justify-between w-full">
              <span className="text-[#666] font-mono text-sm">Round {round}/{MAX_ROUNDS}</span>
              <div className="flex gap-1">{[1,2,3].map(i => <span key={i} className={`${i <= lives ? "text-[#A32020]" : "text-[#2a2a2a]"}`}>♥</span>)}</div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center min-h-[72px] items-center">
              {userInput.length > 0 ? userInput.map((item, i) => (
                <div key={i} className={`w-14 h-14 rounded-lg border flex items-center justify-center text-2xl ${feedback === "correct" ? "border-green-500 bg-green-500/10" : feedback === "wrong" ? "border-[#A32020] bg-[#A32020]/10" : "border-[#333] bg-[#151515]"}`}>{item}</div>
              )) : <p className="text-[#444] font-mono text-sm">Select {sequence.length} items in order</p>}
            </div>
            <div className="grid grid-cols-6 gap-2 w-full max-w-xs">
              {ITEMS.map((item, i) => (
                <button key={i} onClick={() => pick(item)} disabled={!!feedback || userInput.length >= sequence.length} className="w-12 h-12 rounded-lg bg-[#151515] border border-[#2a2a2a] text-2xl hover:border-[#A32020] hover:bg-[#A32020]/10 transition-all active:scale-95" data-testid={`item-${i}`}>{item}</button>
              ))}
            </div>
            {feedback && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-bold ${feedback === "correct" ? "text-green-400" : "text-[#A32020]"}`}>{feedback === "correct" ? "Correct! Well remembered." : "Incorrect. Try again."}</motion.p>}
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}</div>
            <div className="text-[#A32020] font-mono mb-4">memory points · reached round {round}</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">
              {round >= 5 ? "Exceptional working memory. You can hold and manipulate complex sequences — a key cognitive asset." :
               round >= 3 ? "Good short-term memory. Your working memory capacity is healthy." :
               "Memory, like muscle, grows stronger with practice. Keep training."}
            </p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
