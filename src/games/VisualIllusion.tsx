import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ILLUSIONS = [
  {
    name: "The Müller-Lyer Lines",
    component: () => (
      <svg viewBox="0 0 300 120" className="w-full max-w-xs">
        <line x1="30" y1="40" x2="150" y2="40" stroke="#F4E8D4" strokeWidth="2" />
        <line x1="30" y1="40" x2="50" y2="20" stroke="#F4E8D4" strokeWidth="2" />
        <line x1="30" y1="40" x2="50" y2="60" stroke="#F4E8D4" strokeWidth="2" />
        <line x1="150" y1="40" x2="130" y2="20" stroke="#F4E8D4" strokeWidth="2" />
        <line x1="150" y1="40" x2="130" y2="60" stroke="#F4E8D4" strokeWidth="2" />
        <line x1="160" y1="80" x2="270" y2="80" stroke="#A32020" strokeWidth="2" />
        <line x1="160" y1="80" x2="180" y2="60" stroke="#A32020" strokeWidth="2" />
        <line x1="160" y1="80" x2="180" y2="100" stroke="#A32020" strokeWidth="2" />
        <line x1="270" y1="80" x2="250" y2="60" stroke="#A32020" strokeWidth="2" />
        <line x1="270" y1="80" x2="250" y2="100" stroke="#A32020" strokeWidth="2" />
      </svg>
    ),
    question: "Which horizontal line is longer?",
    options: ["The cream line (top)", "The red line (bottom)", "They are equal length"],
    answer: "They are equal length",
    explanation: "Both lines are identical in length! The arrowhead direction tricks your brain into perceiving depth and scaling the lines differently.",
  },
  {
    name: "The Checker Shadow",
    component: () => (
      <div className="relative w-48 h-48 mx-auto">
        <div className="grid grid-cols-6 grid-rows-6 w-full h-full rounded">
          {Array.from({ length: 36 }).map((_, i) => {
            const row = Math.floor(i / 6);
            const col = i % 6;
            const light = (row + col) % 2 === 0;
            const highlighted = (row === 2 && col === 3) || (row === 4 && col === 1);
            return (
              <div
                key={i}
                className={`transition-all ${highlighted ? "ring-2 ring-yellow-400 ring-inset z-10" : ""}`}
                style={{ backgroundColor: light ? "#d4d4d4" : "#505050" }}
              />
            );
          })}
        </div>
      </div>
    ),
    question: "Which highlighted square is lighter — row 3, col 4 or row 5, col 2?",
    options: ["Row 3 Col 4 (the top one)", "Row 5 Col 2 (the bottom one)", "They are the same shade"],
    answer: "They are the same shade",
    explanation: "Both highlighted squares are the exact same shade of gray! Surrounding contrast and context powerfully shift our color perception.",
  },
  {
    name: "Kanizsa Triangle",
    component: () => (
      <svg viewBox="0 0 200 180" className="w-full max-w-xs">
        <circle cx="100" cy="30" r="20" fill="#151515" stroke="#2a2a2a" strokeWidth="1" />
        <path d="M 88 30 L 100 10 L 112 30" fill="#F4E8D4" />
        <circle cx="40" cy="145" r="20" fill="#151515" stroke="#2a2a2a" strokeWidth="1" />
        <path d="M 40 133 L 52 153 L 28 153" fill="#F4E8D4" />
        <circle cx="160" cy="145" r="20" fill="#151515" stroke="#2a2a2a" strokeWidth="1" />
        <path d="M 160 133 L 172 153 L 148 153" fill="#F4E8D4" />
      </svg>
    ),
    question: "Do you see a white triangle in the center?",
    options: ["Yes, a clear white triangle", "No, just three Pac-Man shapes", "I see a faint triangle"],
    answer: "Yes, a clear white triangle",
    explanation: "There is no triangle drawn — your brain invents the edges! This is called 'illusory contours' — the brain completes incomplete figures.",
  },
  {
    name: "The Ebbinghaus Illusion",
    component: () => (
      <svg viewBox="0 0 280 120" className="w-full max-w-xs">
        <circle cx="70" cy="60" r="22" fill="#A32020" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle key={i} cx={70 + 40 * Math.cos((angle * Math.PI) / 180)} cy={60 + 40 * Math.sin((angle * Math.PI) / 180)} r="12" fill="#333" />
        ))}
        <circle cx="210" cy="60" r="22" fill="#A32020" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle key={i} cx={210 + 33 * Math.cos((angle * Math.PI) / 180)} cy={60 + 33 * Math.sin((angle * Math.PI) / 180)} r="7" fill="#555" />
        ))}
      </svg>
    ),
    question: "Which red circle looks bigger?",
    options: ["The left one (surrounded by large circles)", "The right one (surrounded by small circles)", "They are the same size"],
    answer: "They are the same size",
    explanation: "Both red circles are identical! Surrounding context rescales your perception — larger neighbors make something look smaller, and vice versa.",
  },
  {
    name: "Motion After-Effect",
    component: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-[#A32020] animate-spin" style={{ animationDuration: "2s" }} />
        <p className="text-[#666] text-sm max-w-xs">Stare at the spinning circle for 10 seconds, then look at the text below.</p>
        <p className="text-[#F4E8D4] font-bold text-xl mt-2">PSYNAPSE</p>
      </div>
    ),
    question: "After staring at the spinner then looking at the word, what do you experience?",
    options: ["The word appears to spin in reverse", "Nothing unusual happens", "The word appears to expand"],
    answer: "The word appears to spin in reverse",
    explanation: "This is the Motion After-Effect: neurons tuned to rotational motion tire out. When you look away, opposing neurons dominate briefly, creating illusory reverse motion.",
  },
];

export function VisualIllusion() {
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const illusion = ILLUSIONS[idx];

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === illusion.answer) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const next = () => {
    if (idx + 1 >= ILLUSIONS.length) {
      setPhase("done");
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const reset = () => { setPhase("intro"); setIdx(0); setScore(0); setSelected(null); setShowExplanation(false); };

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto" data-testid="visual-illusion-game">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[#999] mb-4 text-lg">Test how your brain interprets visual information.</p>
            <p className="text-[#666] text-sm mb-8">{ILLUSIONS.length} illusions — trust nothing your eyes tell you.</p>
            <button onClick={() => setPhase("playing")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Enter the Illusions</button>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key={`i-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{ILLUSIONS.length}</span>
              <span className="text-[#F4E8D4] font-mono text-sm">Score: {score}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#F4E8D4] mb-6">{illusion.name}</h3>
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6 flex items-center justify-center min-h-[160px]">
              <illusion.component />
            </div>
            <p className="text-[#F4E8D4] font-medium mb-4">{illusion.question}</p>
            <div className="flex flex-col gap-3 mb-4">
              {illusion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                  className={`py-3 px-4 rounded-lg border text-left text-sm transition-all ${
                    selected === opt
                      ? opt === illusion.answer ? "bg-green-500/20 border-green-500 text-green-400" : "bg-[#A32020]/20 border-[#A32020] text-[#A32020]"
                      : selected && opt === illusion.answer ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-[#151515] border-[#2a2a2a] text-[#F4E8D4] hover:border-[#A32020]"
                  }`}
                  data-testid={`option-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a0505] border border-[#A32020]/30 rounded-lg p-4 text-left mb-4">
                <p className="text-[#A32020] text-xs font-mono mb-1">EXPLANATION</p>
                <p className="text-[#999] text-sm">{illusion.explanation}</p>
              </motion.div>
            )}
            {selected && <button onClick={next} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors">{idx + 1 >= ILLUSIONS.length ? "See Results" : "Next Illusion"}</button>}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="text-7xl font-serif font-bold text-[#F4E8D4] mb-2">{score}<span className="text-3xl text-[#666]">/{ILLUSIONS.length}</span></div>
            <div className="text-[#A32020] font-mono mb-4">{Math.round((score / ILLUSIONS.length) * 100)}% correct predictions</div>
            <p className="text-[#999] mb-8 max-w-xs mx-auto">Your brain is wired to make predictions — illusions reveal just how powerfully it fills in the gaps.</p>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="play-again-btn">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
