import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  { text: "At a party, you tend to:", a: "Talk to many different people", b: "Stay close to a few friends", dim: "EI" },
  { text: "You prefer to:", a: "Focus on the big picture", b: "Pay attention to details", dim: "SN" },
  { text: "When making decisions, you rely more on:", a: "Logic and analysis", b: "Feelings and values", dim: "TF" },
  { text: "You prefer your life to be:", a: "Planned and structured", b: "Spontaneous and flexible", dim: "JP" },
  { text: "After a long social event, you feel:", a: "Energized and ready for more", b: "Drained and needing solitude", dim: "EI" },
  { text: "You trust more:", a: "Your direct experience", b: "Your gut instincts and hunches", dim: "SN" },
  { text: "When someone is upset, you first:", a: "Help them think through the issue", b: "Acknowledge their feelings", dim: "TF" },
  { text: "You find it more satisfying to:", a: "Complete a project", b: "Leave options open", dim: "JP" },
  { text: "In groups, you are usually:", a: "The one who initiates conversation", b: "A good listener who waits to speak", dim: "EI" },
  { text: "You are more drawn to:", a: "What is practical and concrete", b: "What is possible and abstract", dim: "SN" },
  { text: "People who know you well would say you are:", a: "Logical and fair-minded", b: "Warm and empathetic", dim: "TF" },
  { text: "You prefer to:", a: "Follow a schedule", b: "Go with the flow", dim: "JP" },
];

type Dim = "EI" | "SN" | "TF" | "JP";

const TYPES: Record<string, { name: string; desc: string; color: string }> = {
  INTJ: { name: "The Architect", desc: "Strategic, independent thinkers who see the world in terms of systems and plans. Rare and driven by insight.", color: "#6366f1" },
  INTP: { name: "The Logician", desc: "Innovative problem-solvers who love abstract thinking and truth above all else.", color: "#8b5cf6" },
  ENTJ: { name: "The Commander", desc: "Bold, decisive natural leaders who see inefficiency and fix it. Driven by achievement.", color: "#a32020" },
  ENTP: { name: "The Debater", desc: "Quick-witted challengers who enjoy sparring over ideas and seeing multiple angles.", color: "#d97706" },
  INFJ: { name: "The Advocate", desc: "Rare idealists with clear moral vision. Deeply insightful about people and driven by purpose.", color: "#059669" },
  INFP: { name: "The Mediator", desc: "Dreamy idealists guided by personal values. Empathetic, creative, and quietly passionate.", color: "#0891b2" },
  ENFJ: { name: "The Protagonist", desc: "Charismatic and inspiring leaders who radiate warmth and draw people toward a shared vision.", color: "#7c3aed" },
  ENFP: { name: "The Campaigner", desc: "Enthusiastic free spirits who see life as full of exciting possibilities and human connections.", color: "#db2777" },
  ISTJ: { name: "The Logistician", desc: "Reliable, precise, and deeply responsible. Upholds traditions and keeps systems running.", color: "#2563eb" },
  ISFJ: { name: "The Defender", desc: "Caring protectors who work quietly to support others and uphold what matters most.", color: "#0284c7" },
  ESTJ: { name: "The Executive", desc: "Organized, decisive administrators who value order, rules, and getting things done.", color: "#b45309" },
  ESFJ: { name: "The Consul", desc: "Warmhearted, sociable, and eager to help — natural community builders.", color: "#be185d" },
  ISTP: { name: "The Virtuoso", desc: "Quiet, observational craftspeople who understand how things work through direct experience.", color: "#374151" },
  ISFP: { name: "The Adventurer", desc: "Gentle artists who live in the present and act with spontaneous authenticity.", color: "#065f46" },
  ESTP: { name: "The Entrepreneur", desc: "Energetic risk-takers who live in the moment and turn theory into action.", color: "#9a3412" },
  ESFP: { name: "The Entertainer", desc: "Spontaneous, energetic, and enthusiastic people-lovers who make everywhere a party.", color: "#be123c" },
};

export function PersonalityTest() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<Record<Dim, number>>({ EI: 0, SN: 0, TF: 0, JP: 0 });
  const [result, setResult] = useState("");

  const answer = (choice: "a" | "b") => {
    const q = QUESTIONS[idx];
    const dim = q.dim as Dim;
    const newScores = { ...scores, [dim]: scores[dim] + (choice === "a" ? 1 : -1) };
    setScores(newScores);
    if (idx + 1 >= QUESTIONS.length) {
      const type = [
        newScores.EI >= 0 ? "E" : "I",
        newScores.SN >= 0 ? "S" : "N",
        newScores.TF >= 0 ? "T" : "F",
        newScores.JP >= 0 ? "J" : "P",
      ].join("");
      setResult(type);
      setPhase("result");
    } else {
      setIdx(i => i + 1);
    }
  };

  const reset = () => { setPhase("intro"); setIdx(0); setScores({ EI: 0, SN: 0, TF: 0, JP: 0 }); setResult(""); };
  const typeInfo = TYPES[result] || { name: "", desc: "", color: "#A32020" };
  const progress = (idx / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto" data-testid="personality-test">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="text-[#999] mb-4 text-lg leading-relaxed">Discover your Myers-Briggs personality type — one of psychology's most influential frameworks for understanding how you perceive the world and make decisions.</p>
            <p className="text-[#666] text-sm mb-8">{QUESTIONS.length} questions · No right or wrong answers · Be honest</p>
            <button onClick={() => setPhase("quiz")} className="px-10 py-4 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium text-lg hover:bg-[#D93A3A] transition-colors" data-testid="start-btn">Begin Test</button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <div className="flex justify-between mb-3">
              <span className="text-[#666] font-mono text-sm">{idx + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-1 mb-8">
              <motion.div className="bg-[#A32020] h-1 rounded-full" animate={{ width: `${progress}%` }} />
            </div>
            <p className="text-xl font-serif text-[#F4E8D4] mb-8 leading-relaxed">{QUESTIONS[idx].text}</p>
            <div className="flex flex-col gap-4">
              {["a", "b"].map((choice) => (
                <button
                  key={choice}
                  onClick={() => answer(choice as "a" | "b")}
                  className="w-full text-left p-5 bg-[#151515] border border-[#2a2a2a] rounded-xl text-[#F4E8D4] hover:border-[#A32020] hover:bg-[#A32020]/5 transition-all text-base"
                  data-testid={`choice-${choice}`}
                >
                  {QUESTIONS[idx][choice as "a" | "b"]}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <p className="text-[#666] font-mono text-sm mb-2">Your personality type is</p>
            <div className="text-7xl font-serif font-bold mb-2" style={{ color: typeInfo.color }}>{result}</div>
            <div className="text-2xl font-serif text-[#F4E8D4] mb-6">{typeInfo.name}</div>
            <p className="text-[#999] mb-8 leading-relaxed max-w-md mx-auto">{typeInfo.desc}</p>
            <div className="grid grid-cols-2 gap-3 mb-8 text-sm text-left">
              {(Object.entries({ EI: "Extraversion / Introversion", SN: "Sensing / Intuition", TF: "Thinking / Feeling", JP: "Judging / Perceiving" }) as [Dim, string][]).map(([dim, label]) => (
                <div key={dim} className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="text-[#666] text-xs mb-2">{label}</div>
                  <div className="w-full bg-[#1e1e1e] rounded-full h-1.5">
                    <div className="bg-[#A32020] h-1.5 rounded-full transition-all" style={{ width: `${50 + (scores[dim] / (QUESTIONS.filter(q => q.dim === dim).length)) * 50}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={reset} className="px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded-lg font-medium hover:bg-[#D93A3A] transition-colors" data-testid="retake-btn">Retake Test</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
