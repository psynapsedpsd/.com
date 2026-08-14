import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROUNDS = [
  {
    question: "Which color draws you most right now?",
    colors: [
      { name: "Deep Red", hex: "#8B0000", trait: "passion" },
      { name: "Ocean Blue", hex: "#1a3a6e", trait: "calm" },
      { name: "Forest Green", hex: "#1a4a2e", trait: "growth" },
      { name: "Rich Gold", hex: "#b8860b", trait: "ambition" },
    ],
  },
  {
    question: "Which color would you paint your ideal workspace?",
    colors: [
      { name: "Slate Grey", hex: "#4a5568", trait: "focus" },
      { name: "Warm Terracotta", hex: "#8B4513", trait: "creativity" },
      { name: "Midnight Purple", hex: "#2D1B69", trait: "intuition" },
      { name: "Pale Cream", hex: "#c8b89a", trait: "clarity" },
    ],
  },
  {
    question: "Which color best represents how you feel this week?",
    colors: [
      { name: "Electric Blue", hex: "#0066CC", trait: "energy" },
      { name: "Charcoal", hex: "#2a2a2a", trait: "introspection" },
      { name: "Sage Green", hex: "#4a7c59", trait: "balance" },
      { name: "Crimson", hex: "#A32020", trait: "intensity" },
    ],
  },
  {
    question: "Which color would you most want to wear?",
    colors: [
      { name: "Pure Black", hex: "#111111", trait: "authority" },
      { name: "Ivory White", hex: "#F4E8D4", trait: "openness" },
      { name: "Teal", hex: "#006666", trait: "uniqueness" },
      { name: "Burgundy", hex: "#5c0a0a", trait: "depth" },
    ],
  },
  {
    question: "Which color makes you feel most at peace?",
    colors: [
      { name: "Sky Blue", hex: "#1a5276", trait: "tranquility" },
      { name: "Earthy Brown", hex: "#6B4423", trait: "groundedness" },
      { name: "Soft Lavender", hex: "#5e3b7a", trait: "spirituality" },
      { name: "Warm Orange", hex: "#8B4000", trait: "warmth" },
    ],
  },
];

const PROFILES: Record<string, { title: string; desc: string }> = {
  passion: { title: "The Driven Achiever", desc: "You are motivated by deep desire and intensity. Red dominance signals someone who acts first and reflects second — passionate, decisive, and unapologetically alive." },
  calm: { title: "The Thoughtful Analyst", desc: "You seek depth beneath the surface. Blue attraction indicates a preference for clarity, order, and meaning over impulse — you think before you feel." },
  growth: { title: "The Natural Nurturer", desc: "You are drawn to renewal and connection. Green resonance suggests someone who values harmony, sustainability, and the long game over short-term gain." },
  ambition: { title: "The Strategic Visionary", desc: "You see opportunity everywhere. Gold affinity marks someone who blends practicality with aspiration — you want excellence, and you plan for it." },
  focus: { title: "The Precise Professional", desc: "You value structure and mental clarity above all. Grey resonance indicates a cool, logical mind that filters noise and acts with intention." },
  creativity: { title: "The Expressive Creator", desc: "You need room to create and explore. Terracotta attraction reveals an earthy creative spirit who finds meaning in making — often with their hands and heart together." },
  intuition: { title: "The Deep Intuitive", desc: "You trust what cannot be fully explained. Purple resonance signals a highly perceptive, spiritually inclined thinker who senses what others miss." },
  clarity: { title: "The Calm Peacemaker", desc: "You bring clarity and calm wherever you go. Cream and light tones reflect a gentle, balanced inner world that values harmony and simplicity." },
  energy: { title: "The Dynamic Motivator", desc: "You radiate energy and forward momentum. Electric blue dominance marks someone who thrives in movement, new challenges, and bold environments." },
  introspection: { title: "The Reflective Observer", desc: "You process deeply before acting. Dark tone affinity signals an intensely self-aware person who needs quiet to make sense of a loud world." },
  balance: { title: "The Centered Harmonizer", desc: "You instinctively seek equilibrium. Muted green resonance marks someone who mediates, adapts, and grounds themselves and others with quiet competence." },
  intensity: { title: "The Passionate Idealist", desc: "You feel everything at full volume. Crimson attraction reveals a person of deep conviction, strong will, and an uncompromising inner compass." },
  authority: { title: "The Commanding Presence", desc: "You carry natural authority. Black resonance signals someone who values control, mystery, and the power of restraint — less is always more." },
  openness: { title: "The Open-Minded Explorer", desc: "You approach life without pretense. Light tone affinity marks a person who values honesty, transparency, and intellectual freedom above all else." },
  uniqueness: { title: "The Independent Thinker", desc: "You resist the obvious path. Teal resonance reveals a creative nonconformist who forges meaning through authenticity and original thinking." },
  depth: { title: "The Complex Soul", desc: "You live in layers. Burgundy and deep tone attraction signals emotional depth, complexity, and a rich inner life that few truly understand." },
  tranquility: { title: "The Peaceful Seeker", desc: "You are driven by a profound need for inner peace. Deep blue resonance marks someone on a lifelong search for stillness, meaning, and wisdom." },
  groundedness: { title: "The Grounded Realist", desc: "You are anchored in the real. Earth tone affinity signals a practical, reliable, deeply rooted person whose strength comes from knowing exactly who they are." },
  spirituality: { title: "The Mystical Philosopher", desc: "You seek something beyond the visible. Lavender resonance reveals an intuitive, spiritually minded thinker who questions everything — including themselves." },
  warmth: { title: "The Radiant Connector", desc: "You are warmth personified. Orange resonance marks a naturally social, optimistic person whose energy lights up every room they enter." },
};

export function ColorPsychologyTest() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [traits, setTraits] = useState<string[]>([]);

  const pick = (trait: string) => {
    const newTraits = [...traits, trait];
    setTraits(newTraits);
    if (idx + 1 >= ROUNDS.length) {
      setPhase("result");
    } else {
      setIdx(i => i + 1);
    }
  };

  const topTrait = traits.length > 0
    ? Object.entries(traits.reduce<Record<string, number>>((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {}))
        .sort(([, a], [, b]) => b - a)[0][0]
    : "calm";

  const profile = PROFILES[topTrait] || PROFILES["calm"];
  const reset = () => { setPhase("intro"); setIdx(0); setTraits([]); };

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg mx-auto" data-testid="color-psychology-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Your color preferences reveal hidden aspects of your personality, emotional state, and values. There are no correct answers.</p>
            <p className="text-[#666] text-sm mb-8">{ROUNDS.length} choices · Follow your gut · Results reveal your current psychological state</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Test</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
            <div className="flex justify-between mb-4">
              <span className="text-[#666] font-mono text-sm">{idx + 1}/{ROUNDS.length}</span>
              <div className="flex gap-1">{ROUNDS.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i < idx ? "bg-[#A32020]" : i === idx ? "bg-[#F4E8D4]" : "bg-[#2a2a2a]"}`} />)}</div>
            </div>
            <p className="text-xl font-serif text-[#F4E8D4] mb-8">{ROUNDS[idx].question}</p>
            <div className="grid grid-cols-2 gap-4">
              {ROUNDS[idx].colors.map((c, i) => (
                <motion.button
                  key={i}
                  onClick={() => pick(c.trait)}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden rounded-xl border-2 border-transparent hover:border-white/20 transition-all group"
                  style={{ backgroundColor: c.hex }}
                  data-testid={`color-${i}`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="relative py-14 px-4">
                    <span className="text-sm font-medium text-white/90 drop-shadow-md">{c.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <p className="text-[#666] font-mono text-xs mb-2 tracking-widest uppercase">Your Color Profile</p>
            <div className="text-4xl font-serif font-bold text-[#F4E8D4] mb-4">{profile.title}</div>
            <p className="text-[#999] leading-relaxed mb-8 max-w-md mx-auto">{profile.desc}</p>
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 mb-8 text-left">
              <p className="text-[#666] text-xs font-mono mb-3">YOUR SELECTIONS</p>
              <div className="flex flex-wrap gap-2">
                {traits.map((t, i) => <span key={i} className="text-xs px-2 py-1 bg-[#1e1e1e] rounded border border-[#333] text-[#F4E8D4]">{t}</span>)}
              </div>
            </div>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
