import { useState } from "react";
import { motion } from "framer-motion";
import { Profile, ProfileLightbox, PortraitFrame } from "@/components/ProfileLightbox";

const currentTeam: Profile[] = [
  { name: "Nikhil Dev", role: "President", initial: "ND", tone: "crimson", bio: "Leading PSYNAPSE with a passion for cognitive science and community building." },
  { name: "Saanchi Yadav", role: "President", initial: "SY", tone: "indigo", bio: "Co-president driving research initiatives and inter-school psychology programs." },
  { name: "Aditi Vashisht", role: "Vice President", initial: "AV", tone: "ochre", bio: "Coordinating events, outreach, and member engagement across the club." },
];

const pastPresidents: Profile[] = [
  { name: "Priya Nair", role: "Past President", year: "2023–24", initial: "PN", tone: "sage", bio: "Established the club's core research framework and digital presence." },
  { name: "Karan Malhotra", role: "Past President", year: "2022–23", initial: "KM", tone: "plum", bio: "Founded PSYNAPSE and built its foundational community of 80+ members." },
];

export function Team() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  return (
    <>
      <section id="team" className="relative overflow-hidden bg-background py-28">
        <motion.div
          className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 rounded-full border-2 border-dashed border-foreground/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-accent">Our Leadership</p>
            <h3 className="text-4xl font-semibold text-foreground md:text-5xl">The Minds Behind PSYNAPSE</h3>
            <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-foreground/45">
              Click a portrait to meet the people shaping the club’s next chapter.
            </p>
          </motion.div>

          <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
            {currentTeam.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-foreground/25"
                style={{ boxShadow: "0 4px 16px hsl(25 20% 8% / .12), 0 1px 4px hsl(25 20% 8% / .07)" }}
              >
                <div className="flex min-h-[320px] items-center justify-center bg-background px-6 pt-8">
                  <PortraitFrame profile={member} onClick={() => setSelectedProfile(member)} />
                </div>
                <div className="p-6">
                  <span className={`mb-3 inline-block rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${
                    member.role === "President"
                      ? "border-accent/20 bg-accent/10 text-accent"
                      : "border-border bg-foreground/6 text-foreground/50"
                  }`}>{member.role}</span>
                  <h4 className="mb-2 text-xl font-semibold text-foreground">{member.name}</h4>
                  <p className="text-sm font-light leading-relaxed text-foreground/45">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto mb-8 flex max-w-2xl items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <p className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-foreground/35">Past Presidents</p>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              {pastPresidents.map((pp, idx) => (
                <motion.div
                  key={pp.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-md"
                  style={{ boxShadow: "0 2px 10px hsl(25 20% 8% / .09)" }}
                  onClick={() => setSelectedProfile(pp)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedProfile(pp);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open portrait of ${pp.name}`}
                >
                  <PortraitFrame profile={pp} compact />
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h5 className="font-semibold text-foreground/80">{pp.name}</h5>
                      <span className="font-mono text-xs text-foreground/30">{pp.year}</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-foreground/45">{pp.bio}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">View portrait</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <ProfileLightbox profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </>
  );
}