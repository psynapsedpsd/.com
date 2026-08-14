import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MemoryMatch } from "@/games/MemoryMatch";
import { StroopChallenge } from "@/games/StroopChallenge";
import { ReactionSpeed } from "@/games/ReactionSpeed";
import { PatternRecognition } from "@/games/PatternRecognition";
import { VisualIllusion } from "@/games/VisualIllusion";
import { ColorPerception } from "@/games/ColorPerception";
import { AttentionChallenge } from "@/games/AttentionChallenge";
import { EmotionRecognition } from "@/games/EmotionRecognition";
import { FocusTrainer } from "@/games/FocusTrainer";
import { MindMaze } from "@/games/MindMaze";

const games = [
  { title: "Memory Match",        desc: "Flip and match cards to train recall",         diff: "Medium", time: "5 min",  size: "large",  emoji: "🧩", component: <MemoryMatch /> },
  { title: "Stroop Challenge",    desc: "Test your cognitive flexibility & inhibition",  diff: "Hard",   time: "3 min",  size: "small",  emoji: "🎨", component: <StroopChallenge /> },
  { title: "Reaction Speed",      desc: "How fast is your neural response?",             diff: "Easy",   time: "2 min",  size: "small",  emoji: "⚡", component: <ReactionSpeed /> },
  { title: "Pattern Recognition", desc: "Identify hidden sequences and rules",           diff: "Hard",   time: "8 min",  size: "medium", emoji: "🔷", component: <PatternRecognition /> },
  { title: "Visual Illusion",     desc: "Can your brain be tricked by perception?",      diff: "Easy",   time: "5 min",  size: "medium", emoji: "👁", component: <VisualIllusion /> },
  { title: "Color Perception",    desc: "Distinguish subtle chromatic differences",      diff: "Medium", time: "4 min",  size: "small",  emoji: "🎭", component: <ColorPerception /> },
  { title: "Attention Challenge", desc: "Track multiple targets simultaneously",         diff: "Hard",   time: "6 min",  size: "small",  emoji: "🎯", component: <AttentionChallenge /> },
  { title: "Emotion Recognition", desc: "Read and interpret micro-expressions",          diff: "Medium", time: "5 min",  size: "medium", emoji: "😊", component: <EmotionRecognition /> },
  { title: "Focus Trainer",       desc: "Build laser-sharp concentration",               diff: "Medium", time: "7 min",  size: "small",  emoji: "🧘", component: <FocusTrainer /> },
  { title: "Mind Maze",           desc: "Navigate complex psychological puzzles",        diff: "Hard",   time: "10 min", size: "large",  emoji: "🌀", component: <MindMaze /> },
];

const diffStyle: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard:   "bg-accent/12 text-accent border-accent/25",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function PsychologyGames() {
  const [active, setActive] = useState<(typeof games)[0] | null>(null);

  return (
    <section id="games" className="py-28 bg-card border-y border-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/4 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 text-center"
        >
          <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-4">Interactive Experiments</p>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">Mind Games</h3>
          <p className="text-foreground/45 font-light max-w-md mx-auto">
            Gamified cognitive experiments rooted in real psychology research. Play, compete, and learn about your mind.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {["10 Games", "Real-time Scoring", "Cognitive Science", "Free to Play"].map(tag => (
            <span key={tag} className="text-xs font-mono px-3 py-1.5 rounded-full bg-background border border-border text-foreground/50 shadow-sm">{tag}</span>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 auto-rows-[200px] md:auto-rows-[230px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {games.map((g, idx) => (
            <motion.div
              key={g.title}
              variants={cardVariants}
              onClick={() => setActive(g)}
              whileHover={{ y: -6, boxShadow: "0 20px 50px hsl(25 20% 8% / .22), 0 6px 14px hsl(25 20% 8% / .12)" }}
               className={`group relative overflow-hidden rounded-3xl border border-border bg-background cursor-pointer hover:border-foreground/30 transition-all duration-300 ${
                g.size === "large"  ? "md:col-span-2 md:row-span-2" :
                g.size === "medium" ? "md:col-span-2" : ""
              }`}
              style={{ boxShadow: "0 4px 16px hsl(25 20% 8% / .12), 0 1px 4px hsl(25 20% 8% / .07)" }}
               data-testid={`game-card-${idx}`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 via-transparent to-foreground/3 pointer-events-none" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="text-2xl leading-none"
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >{g.emoji}</motion.span>
                    <span className="text-xs font-mono text-foreground/35 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/60">
                      {g.time}
                    </span>
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${diffStyle[g.diff]}`}>
                    {g.diff}
                  </span>
                </div>

                <div>
                  <h4 className={`font-serif font-semibold text-foreground mb-1.5 group-hover:text-foreground transition-colors ${
                    g.size === "large" ? "text-2xl md:text-3xl" : "text-lg"
                  }`}>
                    {g.title}
                  </h4>
                  <p className="text-sm text-foreground/45 mb-5 font-light line-clamp-2">{g.desc}</p>

                  <motion.button
                    className="flex items-center gap-2.5 bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-2xl hover:bg-foreground/90 transition-colors"
                    style={{ boxShadow: "0 2px 10px hsl(25 20% 8% / .20)" }}
                    whileHover={{ scale: 1.04, boxShadow: "0 4px 16px hsl(25 20% 8% / .28)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play Now
                  </motion.button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-accent to-accent/0 w-0 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Modal isOpen={active !== null} onClose={() => setActive(null)} title={active?.title ?? ""}>
        {active?.component}
      </Modal>
    </section>
  );
}
