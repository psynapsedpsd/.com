import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, BrainCircuit, Database, Palette, Activity, HeartPulse, Zap, Target, Scale, Eye, ArrowUpRight } from "lucide-react";
import { Modal } from "@/components/Modal";
import { PersonalityTest } from "@/tests/PersonalityTest";
import { IQChallenge } from "@/tests/IQChallenge";
import { MemoryTest } from "@/tests/MemoryTest";
import { ColorPsychologyTest } from "@/tests/ColorPsychologyTest";
import { StressAssessment } from "@/tests/StressAssessment";
import { EmotionalIntelligence } from "@/tests/EmotionalIntelligence";
import { ReactionTimeTest } from "@/tests/ReactionTimeTest";
import { FocusTest } from "@/tests/FocusTest";
import { DecisionMaking } from "@/tests/DecisionMaking";
import { SelfAwareness } from "@/tests/SelfAwareness";

const tests = [
  { title: "Personality Test",       desc: "Discover your Myers-Briggs type",      diff: "Medium", time: "15 min", cat: "Personality",  icon: <Fingerprint className="w-5 h-5" />, component: <PersonalityTest /> },
  { title: "IQ Challenge",           desc: "Measure your cognitive abilities",      diff: "Hard",   time: "20 min", cat: "Cognitive",    icon: <BrainCircuit className="w-5 h-5" />, component: <IQChallenge /> },
  { title: "Memory Test",            desc: "Test your recall capacity",             diff: "Medium", time: "10 min", cat: "Cognitive",    icon: <Database className="w-5 h-5" />, component: <MemoryTest /> },
  { title: "Color Psychology",       desc: "What colors reveal about you",          diff: "Easy",   time: "5 min",  cat: "Behavioral",  icon: <Palette className="w-5 h-5" />, component: <ColorPsychologyTest /> },
  { title: "Stress Assessment",      desc: "Evaluate your stress levels",           diff: "Easy",   time: "8 min",  cat: "Emotional",   icon: <Activity className="w-5 h-5" />, component: <StressAssessment /> },
  { title: "Emotional Intelligence", desc: "Measure your EQ score",                diff: "Medium", time: "12 min", cat: "Emotional",   icon: <HeartPulse className="w-5 h-5" />, component: <EmotionalIntelligence /> },
  { title: "Reaction Time",          desc: "Test your neural response speed",       diff: "Easy",   time: "5 min",  cat: "Cognitive",   icon: <Zap className="w-5 h-5" />, component: <ReactionTimeTest /> },
  { title: "Focus Test",             desc: "Assess your concentration",             diff: "Medium", time: "10 min", cat: "Cognitive",   icon: <Target className="w-5 h-5" />, component: <FocusTest /> },
  { title: "Decision Making",        desc: "Analyze your choice patterns",          diff: "Hard",   time: "15 min", cat: "Behavioral",  icon: <Scale className="w-5 h-5" />, component: <DecisionMaking /> },
  { title: "Self Awareness",         desc: "Deep introspective analysis",           diff: "Hard",   time: "20 min", cat: "Personality", icon: <Eye className="w-5 h-5" />, component: <SelfAwareness /> },
];

const diffDots: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
const diffLabel: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard:   "bg-accent/12 text-accent border-accent/25",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function PsychologyTests() {
  const [active, setActive] = useState<(typeof tests)[0] | null>(null);

  return (
    <section id="tests" className="py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/3 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 text-center"
        >
          <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-4">Psychological Assessments</p>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">Explore Your Mind</h3>
          <p className="text-foreground/45 font-light max-w-md mx-auto">
            Science-backed tests to reveal hidden aspects of your cognition, personality, and emotional world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {["10 Assessments", "Science-backed", "Instant Results", "No signup needed"].map(tag => (
            <span key={tag} className="text-xs font-mono px-3 py-1.5 rounded-full bg-card border border-border text-foreground/50 shadow-sm">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {tests.map((t, idx) => (
            <motion.div
              key={t.title}
              variants={cardVariants}
              onClick={() => setActive(t)}
              whileHover={{ y: -6, boxShadow: "0 16px 40px hsl(25 20% 8% / .18), 0 4px 10px hsl(25 20% 8% / .10)" }}
               className="group relative bg-card border border-border rounded-3xl p-6 cursor-pointer hover:border-foreground/30 transition-all duration-300 overflow-hidden"
              style={{ boxShadow: "0 4px 14px hsl(25 20% 8% / .10), 0 1px 4px hsl(25 20% 8% / .06)" }}
               data-testid={`test-card-${idx}`}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-background/80 via-transparent to-accent/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <motion.div
                    className="w-11 h-11 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground/50 group-hover:text-foreground group-hover:border-foreground/30 transition-all"
                    style={{ boxShadow: "0 2px 8px hsl(25 20% 8% / .08)" }}
                    whileHover={{ rotate: 8, scale: 1.1 }}
                  >
                    {t.icon}
                  </motion.div>
                  <div className="flex gap-1 items-center pt-1">
                    {[1, 2, 3].map(d => (
                      <div key={d} className={`w-1.5 h-1.5 rounded-full ${d <= diffDots[t.diff] ? "bg-accent" : "bg-border"}`} />
                    ))}
                  </div>
                </div>

                <p className="text-[10px] font-mono text-foreground/35 uppercase tracking-wider mb-1">{t.cat}</p>
                <h4 className="text-base font-serif font-semibold text-foreground mb-1.5 leading-snug">{t.title}</h4>
                <p className="text-sm text-foreground/45 font-light leading-relaxed mb-5">{t.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${diffLabel[t.diff]}`}>{t.diff}</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground/40 group-hover:text-foreground transition-colors">
                    {t.time} <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-accent to-accent/0 w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl" />
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
