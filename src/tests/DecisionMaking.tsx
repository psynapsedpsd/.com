import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = [
  {
    scenario: "You receive two job offers: Job A pays 20% more but requires 60+ hour weeks with constant travel. Job B pays your current salary but offers flexibility, growth, and a great team.",
    question: "Which factors should guide your decision most?",
    options: [
      { text: "Salary and financial growth trajectory", style: "Analytical" },
      { text: "Work-life balance and personal values alignment", style: "Values-Based" },
      { text: "The team culture and long-term relationships", style: "Relational" },
      { text: "Career prestige and external perception", style: "Status-Driven" },
    ],
  },
  {
    scenario: "Your startup has a critical decision: invest your last funds in a bold marketing campaign (high risk, high reward) or use it to stabilize operations (safe but slow growth).",
    question: "Your instinct says:",
    options: [
      { text: "Data first — I'd run the numbers before anything", style: "Analytical" },
      { text: "Go bold — safe plays rarely create breakthroughs", style: "Risk-Seeking" },
      { text: "Play safe — protect what we have, then grow", style: "Risk-Averse" },
      { text: "Ask the team — this decision affects everyone", style: "Collaborative" },
    ],
  },
  {
    scenario: "A close friend confesses they've been deceiving their partner. They ask you not to tell anyone. You've met the partner and consider them a friend too.",
    question: "What guides your choice here?",
    options: [
      { text: "Loyalty — I keep my friend's confidence unconditionally", style: "Loyalty-Driven" },
      { text: "I'd pressure them to come clean themselves", style: "Principled" },
      { text: "I'd distance myself from the situation entirely", style: "Avoidant" },
      { text: "Every situation has context — I need more information", style: "Contextual" },
    ],
  },
  {
    scenario: "You're offered the chance to bypass 3 years of process to achieve a major goal — but the shortcut involves some ethical ambiguity.",
    question: "How do you approach this?",
    options: [
      { text: "I evaluate the harm — if it's minimal, it may be justified", style: "Consequentialist" },
      { text: "Rules exist for reasons — I don't cross lines", style: "Principled" },
      { text: "Depends entirely on who could be affected", style: "Contextual" },
      { text: "I'd find a third path — a creative alternative", style: "Creative" },
    ],
  },
  {
    scenario: "You have an hour of unexpected free time. Your instinct is to:",
    options: [
      { text: "Use it productively — catch up on work", style: "Achievement" },
      { text: "Rest completely without guilt", style: "Restorative" },
      { text: "Connect with someone I've been neglecting", style: "Relational" },
      { text: "Create something or explore an idea", style: "Creative" },
    ],
    question: "Your immediate instinct reveals:",
  },
];

const PROFILES: Record<string, string> = {
  Analytical: "You are a systematic thinker who seeks data and logic before committing. Your decisions are thorough and rarely impulsive — though occasionally analysis becomes a form of avoidance.",
  "Values-Based": "Your choices are anchored in deeply held principles. You make decisions that align with who you are, not just what benefits you — a mark of strong personal integrity.",
  Relational: "You weigh people's experiences heavily. Your decisions factor in relationships, trust, and community impact — making you a natural collaborator and trusted leader.",
  "Status-Driven": "You are motivated by how decisions position you. Awareness of this pattern is powerful — it lets you separate ambition from ego-driven choices.",
  "Risk-Seeking": "You are biased toward bold action. You accept that some of the best decisions look reckless in the moment. Your challenge is distinguishing courage from impulse.",
  "Risk-Averse": "You value stability and sustainable progress. You protect what matters most before expanding — a sign of prudent judgment, not timidity.",
  Collaborative: "You make better decisions with input from others. You understand that shared ownership of decisions creates stronger buy-in and more resilient outcomes.",
  "Loyalty-Driven": "Relationships anchor your ethics. You weigh loyalty deeply — which builds trust, but can occasionally conflict with broader moral obligations.",
  Principled: "You follow clearly defined moral principles consistently. This gives you predictability and integrity, though rigid rules can miss important contextual nuance.",
  Avoidant: "You tend to minimize conflict and create distance from difficult choices. This self-protective instinct is natural but worth examining when it delays necessary decisions.",
  Contextual: "You resist one-size-fits-all frameworks. You seek to understand full context before acting — a sophisticated decision-making style that values nuance.",
  Consequentialist: "You judge actions by their outcomes. You're comfortable with moral ambiguity when the end result creates genuine benefit — a pragmatic and outcome-focused thinker.",
  Creative: "You rarely accept the options presented. You find third paths, reframe problems, and turn constraints into opportunities. A genuinely original decision-maker.",
  Achievement: "You are wired for productivity. Free time feels like opportunity — which drives impressive output but can make genuine rest feel like a luxury you haven't earned.",
  Restorative: "You understand the value of recovery. Rest is not laziness to you — it is the foundation of sustainable high performance.",
};

export function DecisionMaking() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [styles, setStyles] = useState<string[]>([]);

  const choose = (style: string) => {
    const newStyles = [...styles, style];
    setStyles(newStyles);
    if (idx + 1 >= SCENARIOS.length) {
      setPhase("result");
    } else {
      setIdx(i => i + 1);
    }
  };

  const topStyle = styles.length > 0
    ? Object.entries(styles.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {}))
        .sort(([, a], [, b]) => b - a)[0][0]
    : "Contextual";

  const reset = () => { setPhase("intro"); setIdx(0); setStyles([]); };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="decision-making-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Decision-making style is one of the most revealing aspects of personality. How you choose reveals what you value, fear, and trust.</p>
            <p className="text-[#666] text-sm mb-8">{SCENARIOS.length} scenarios · Choose your most authentic instinct</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Analysis</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`s-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <div className="flex justify-between mb-3">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{SCENARIOS.length}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-6">
              <div className="bg-[#A32020] h-1 rounded-full transition-all" style={{ width: `${(idx / SCENARIOS.length) * 100}%` }} />
            </div>
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 mb-5">
              <p className="text-[#999] text-sm leading-relaxed">{SCENARIOS[idx].scenario}</p>
            </div>
            <p className="text-[#F4E8D4] font-serif text-lg mb-5">{SCENARIOS[idx].question}</p>
            <div className="flex flex-col gap-3">
              {SCENARIOS[idx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => choose(opt.style)}
                  className="w-full text-left px-5 py-4 bg-[#151515] border border-[#2a2a2a] rounded-xl text-[#F4E8D4] hover:border-[#A32020] hover:bg-[#A32020]/5 transition-all text-sm"
                  data-testid={`option-${i}`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <p className="text-[#666] font-mono text-xs mb-2 tracking-widest uppercase">Your Decision Style</p>
            <div className="text-4xl font-serif font-bold text-[#A32020] mb-4">{topStyle}</div>
            <p className="text-[#999] leading-relaxed mb-8 max-w-md mx-auto">{PROFILES[topStyle]}</p>
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 mb-8 text-left">
              <p className="text-[#666] text-xs font-mono mb-3">ALL PATTERNS IDENTIFIED</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(styles)].map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-[#1e1e1e] rounded border border-[#333] text-[#F4E8D4]">{s}</span>)}
              </div>
            </div>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Analysis</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
