import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, Activity, Users, Lightbulb } from "lucide-react";

function Counter({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * (to - from) + from));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, from, to, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const values = [
    { icon: <BrainCircuit className="w-5 h-5" />, title: "Scientific Rigor", desc: "Methodological approach to psychological phenomena" },
    { icon: <Activity className="w-5 h-5" />, title: "Active Research", desc: "Continuous exploration and empirical studies" },
    { icon: <Users className="w-5 h-5" />, title: "Community", desc: "A network of cognitive enthusiasts" },
    { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", desc: "Applying modern tech to classic psychology" },
  ];

  return (
    <section id="about" className="py-28 bg-card border-y border-border relative overflow-hidden">
      {/* Subtle animated background element */}
      <motion.div
        className="absolute -right-32 top-1/2 w-64 h-64 rounded-full border border-foreground/5 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -left-20 bottom-10 w-40 h-40 rounded-full border border-accent/8 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-5">About PSYNAPSE</p>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-5">Deconstructing the Mind</h3>
          <p className="text-foreground/50 font-light leading-relaxed">
            Founded to bridge academic psychology with modern digital experience. A collective of researchers, students, and enthusiasts exploring human cognition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { val: <Counter from={0} to={40} suffix="+" />, label: "Active Members" },
              { val: <Counter from={0} to={10} />, label: "Psych Tests" },
              { val: <Counter from={0} to={9} />, label: "Mind Games" },
              { val: <Counter from={0} to={8} />, label: "Thought Prompts", hi: true },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`p-7 rounded-2xl border ${s.hi ? "bg-foreground/5 border-foreground/20" : "bg-background border-border"} shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="text-4xl font-serif font-bold mb-2 text-foreground">{s.val}</div>
                <div className="text-xs text-foreground/40 uppercase tracking-wider font-mono">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.08 }}
                whileHover={{ y: -4, boxShadow: "0 12px 36px hsl(25 20% 8% / .18)" }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-foreground/25 shadow-sm transition-colors group cursor-default"
              >
                <motion.div
                  className="mb-4 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground/50 group-hover:text-foreground transition-colors"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                >
                  {v.icon}
                </motion.div>
                <h4 className="text-base font-serif font-semibold text-foreground mb-1.5">{v.title}</h4>
                <p className="text-sm text-foreground/45 font-light leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
