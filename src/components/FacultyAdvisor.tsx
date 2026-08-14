import { useState } from "react";
import { motion } from "framer-motion";
import { Profile, ProfileLightbox, PortraitFrame } from "@/components/ProfileLightbox";

export function FacultyAdvisor() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const advisor: Profile = {
    name: "Ms. Samdisha Alagh",
    role: "Teacher Incharge",
    initial: "SA",
    tone: "ink",
    bio: "Guiding PSYNAPSE with thoughtful mentorship, academic care, and an open invitation to stay curious about the human mind.",
  };

  return (
    <>
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="bg-background rounded-3xl border border-border overflow-hidden"
            style={{ boxShadow: "0 8px 32px hsl(25 20% 8% / .14), 0 2px 8px hsl(25 20% 8% / .08)" }}
            whileHover={{ boxShadow: "0 16px 48px hsl(25 20% 8% / .20), 0 4px 12px hsl(25 20% 8% / .10)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-[260px_1fr]">
              <div className="bg-card flex flex-col items-center justify-center py-12 px-8 border-b md:border-b-0 md:border-r border-border relative overflow-hidden">
                {/* Subtle animated circle */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-accent/10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <div className="relative z-10 mb-5">
                  <PortraitFrame profile={advisor} onClick={() => setSelectedProfile(advisor)} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2 relative z-10">Teacher Incharge</p>
                <h3 className="text-lg font-serif font-semibold text-foreground text-center relative z-10">Ms. Samdisha Alagh</h3>
                <p className="text-xs text-foreground/35 font-mono mt-1 relative z-10">Psychology Dept.</p>
              </div>

              <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
                <p className="text-foreground/30 font-mono text-[10px] uppercase tracking-widest mb-7">Faculty Note</p>
                <motion.blockquote
                  className="relative pl-5 border-l-2 border-accent/30"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p className="text-base md:text-xl lg:text-2xl font-serif font-medium text-foreground/80 leading-relaxed italic">
                    PSYNAPSE represents the ideal synthesis of rigorous academic inquiry and passionate curiosity. The minds shaping this organization are not just studying psychology — they are actively expanding its horizons.
                  </p>
                </motion.blockquote>
                <motion.div
                  className="mt-8 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-px bg-accent/40"
                    initial={{ width: 0 }}
                    whileInView={{ width: 40 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  />
                  <span className="text-sm font-serif text-foreground/45 italic">Ms. Samdisha Alagh</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    <ProfileLightbox profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </>
  );
}
