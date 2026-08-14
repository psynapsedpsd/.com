import { motion } from "framer-motion";

const minds = [
  {
    name: "Sigmund Freud",
    years: "1856–1939",
    field: "Psychoanalysis",
    contrib: "Unconscious mind & dream interpretation",
    initial: "SF",
    color: "from-violet-100 to-violet-50",
    accent: "text-violet-700",
    border: "border-violet-200",
  },
  {
    name: "Carl Jung",
    years: "1875–1961",
    field: "Analytical Psychology",
    contrib: "Archetypes, collective unconscious",
    initial: "CJ",
    color: "from-blue-100 to-blue-50",
    accent: "text-blue-700",
    border: "border-blue-200",
  },
  {
    name: "B.F. Skinner",
    years: "1904–1990",
    field: "Behaviorism",
    contrib: "Operant conditioning & reinforcement",
    initial: "BFS",
    color: "from-amber-100 to-amber-50",
    accent: "text-amber-700",
    border: "border-amber-200",
  },
  {
    name: "Ivan Pavlov",
    years: "1849–1936",
    field: "Classical Conditioning",
    contrib: "Conditioned reflexes in behavior",
    initial: "IP",
    color: "from-emerald-100 to-emerald-50",
    accent: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    name: "Abraham Maslow",
    years: "1908–1970",
    field: "Humanistic Psychology",
    contrib: "Hierarchy of needs & self-actualization",
    initial: "AM",
    color: "from-rose-100 to-rose-50",
    accent: "text-rose-700",
    border: "border-rose-200",
  },
  {
    name: "William James",
    years: "1842–1910",
    field: "Functionalism",
    contrib: "Stream of consciousness theory",
    initial: "WJ",
    color: "from-cyan-100 to-cyan-50",
    accent: "text-cyan-700",
    border: "border-cyan-200",
  },
  {
    name: "Jean Piaget",
    years: "1896–1980",
    field: "Developmental Psychology",
    contrib: "Cognitive development stages in children",
    initial: "JP",
    color: "from-teal-100 to-teal-50",
    accent: "text-teal-700",
    border: "border-teal-200",
  },
  {
    name: "Lev Vygotsky",
    years: "1896–1934",
    field: "Social Development",
    contrib: "Zone of proximal development",
    initial: "LV",
    color: "from-indigo-100 to-indigo-50",
    accent: "text-indigo-700",
    border: "border-indigo-200",
  },
];

/* Duplicate for seamless loop */
const all = [...minds, ...minds];

function MindCard({ m }: { m: typeof minds[0] }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`shrink-0 w-64 rounded-3xl border ${m.border} bg-gradient-to-b ${m.color} p-6 mx-3 cursor-default`}
      style={{ boxShadow: "0 4px 18px hsl(25 20% 8% / .10), 0 1px 4px hsl(25 20% 8% / .06)" }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-2xl border ${m.border} flex items-center justify-center shrink-0 bg-white/70`}
          style={{ boxShadow: "0 2px 8px hsl(25 20% 8% / .08)" }}>
          <span className={`text-xs font-mono font-bold ${m.accent}`}>{m.initial}</span>
        </div>
        <div>
          <h4 className="text-base font-serif font-semibold text-foreground leading-snug">{m.name}</h4>
          <p className="text-[10px] font-mono text-foreground/35 mt-0.5">{m.years}</p>
        </div>
      </div>
      <span className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${m.border} ${m.accent} bg-white/60 mb-3`}>
        {m.field}
      </span>
      <p className="text-sm text-foreground/60 font-light leading-relaxed">{m.contrib}</p>
    </motion.div>
  );
}

function InfiniteTrack({ speed, dir = 1 }: { speed: number; dir?: 1 | -1 }) {
  return (
    <div className="overflow-hidden">
      <div
        className={`minds-track ${dir === 1 ? "minds-track-forward" : "minds-track-reverse"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {all.map((m, i) => <MindCard key={i} m={m} />)}
      </div>
    </div>
  );
}

export function GreatMinds() {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-accent/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-4">Hall of Fame</p>
          <h3 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
            Minds That Changed<br className="hidden md:block" /> Everything
          </h3>
          <p className="text-foreground/45 font-light max-w-md mx-auto">
            The pioneers who built the science of the human mind — their ideas still shape how we think about thinking.
          </p>
        </motion.div>
      </div>

      {/* Fade masks on left/right */}
      <div className="relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="space-y-5 py-2">
          <InfiniteTrack speed={28} dir={1} />
          <InfiniteTrack speed={20} dir={-1} />
        </div>
      </div>
    </section>
  );
}
