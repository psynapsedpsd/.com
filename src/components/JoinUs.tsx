import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

export function JoinUs() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", year: "", message: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const chips = ["Research", "Events", "Technology", "Design", "Outreach"];

  const toggle = (v: string) => setInterests(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setStatus("loading"); setTimeout(() => setStatus("success"), 1500); };

  const inp = "w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-0 outline-none transition-colors font-light";

  return (
    <section id="join" className="py-28 bg-background relative overflow-hidden">
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/4 blur-[150px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.07, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Animated ring */}
      <motion.div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full border-2 border-dashed border-foreground/5 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-center"
          >
            <p className="text-accent font-mono text-xs tracking-[0.35em] uppercase mb-5">Become a Member</p>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6 leading-tight">
              Join the<br />Collective.
            </h3>
            <p className="text-foreground/50 font-light leading-relaxed mb-12 max-w-sm">
              Whether you're a researcher, developer, or simply fascinated by cognitive science — there's a place for you here at DPS Dwarka's PSYNAPSE.
            </p>
            <div className="space-y-7">
              {[
                { n: "01", title: "Apply", desc: "Submit your details and areas of interest." },
                { n: "02", title: "Interview", desc: "A brief conversation with our core team." },
                { n: "03", title: "Onboarding", desc: "Join projects and begin your journey." },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  className="flex gap-5 items-start"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1, borderColor: "hsl(0 62% 38%)" }}
                    style={{ boxShadow: "0 2px 8px hsl(25 20% 8% / .08)" }}
                  >
                    <span className="font-mono text-xs text-foreground/35">{s.n}</span>
                  </motion.div>
                  <div>
                    <h4 className="text-base font-serif font-semibold text-foreground mb-0.5">{s.title}</h4>
                    <p className="text-sm text-foreground/45 font-light">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-12 bg-card border border-border rounded-3xl"
                  style={{ boxShadow: "0 8px 32px hsl(25 20% 8% / .14), 0 2px 8px hsl(25 20% 8% / .08)" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.15 }}
                    className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-semibold mb-3">Application Received</h3>
                  <p className="text-foreground/45 font-light text-sm">We'll be in touch soon.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-xs font-mono text-foreground/35 hover:text-foreground/60 transition-colors border-b border-dashed border-foreground/20 pb-0.5"
                  >
                    Submit another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={submit}
                  className="bg-card border border-border rounded-3xl p-8 space-y-5"
                  style={{ boxShadow: "0 8px 32px hsl(25 20% 8% / .14), 0 2px 8px hsl(25 20% 8% / .08)" }}
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-foreground/35 uppercase tracking-wider">Full Name</label>
                    <input required type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} className={inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-foreground/35 uppercase tracking-wider">Email</label>
                    <input required type="email" placeholder="you@school.edu" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} className={inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-foreground/35 uppercase tracking-wider">Grade</label>
                    <select required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                      className={`${inp} appearance-none`}>
                      <option value="" disabled>Select grade</option>
                      {["9", "10", "11", "12"].map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-foreground/35 uppercase tracking-wider">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {chips.map(c => (
                        <motion.button
                          key={c}
                          type="button"
                          onClick={() => toggle(c)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            interests.includes(c)
                              ? "bg-foreground text-background border-foreground shadow-md"
                              : "bg-background border-border text-foreground/45 hover:border-foreground/35 hover:text-foreground/70"
                          }`}
                        >{c}</motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-foreground/35 uppercase tracking-wider">Why PSYNAPSE?</label>
                    <textarea rows={3} placeholder="Tell us what excites you about psychology..." value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })} className={`${inp} resize-none`} />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 20px hsl(25 20% 8% / .22)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-foreground text-background font-semibold font-serif text-base py-3.5 rounded-2xl hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ boxShadow: "0 4px 14px hsl(25 20% 8% / .18)" }}
                  >
                    {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Application"}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
