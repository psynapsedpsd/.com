import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

export type ProfileTone = "crimson" | "indigo" | "ochre" | "sage" | "plum" | "ink";

export type Profile = {
  name: string;
  role: string;
  bio: string;
  initial: string;
  year?: string;
  tone?: ProfileTone;
};

const toneStyles: Record<ProfileTone, { background: string; accent: string; line: string }> = {
  crimson: {
    background: "linear-gradient(145deg, #9c2d2d 0%, #d27c60 46%, #f0c7a1 100%)",
    accent: "#f7e6c8",
    line: "rgba(247,230,200,.48)",
  },
  indigo: {
    background: "linear-gradient(145deg, #222b59 0%, #59659a 48%, #c2bad1 100%)",
    accent: "#eee5d4",
    line: "rgba(238,229,212,.45)",
  },
  ochre: {
    background: "linear-gradient(145deg, #9b641e 0%, #d89c47 48%, #f2dfb0 100%)",
    accent: "#fff4da",
    line: "rgba(255,244,218,.5)",
  },
  sage: {
    background: "linear-gradient(145deg, #344d43 0%, #708d73 50%, #d0d2aa 100%)",
    accent: "#f4efd9",
    line: "rgba(244,239,217,.48)",
  },
  plum: {
    background: "linear-gradient(145deg, #542a48 0%, #976078 52%, #e1b5a5 100%)",
    accent: "#fff0dc",
    line: "rgba(255,240,220,.48)",
  },
  ink: {
    background: "linear-gradient(145deg, #181719 0%, #5d4b4b 50%, #c58b6d 100%)",
    accent: "#f5ede0",
    line: "rgba(245,237,224,.45)",
  },
};

export function PortraitFrame({
  profile,
  large = false,
  compact = false,
  onClick,
}: {
  profile: Profile;
  large?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  const tone = toneStyles[profile.tone ?? "crimson"];
  const frame = (
    <div
      className={`relative overflow-hidden border-[7px] border-background bg-[#cab79d] shadow-[0_12px_30px_rgba(28,20,16,.22)] ${
        large
          ? "h-[360px] w-[290px] sm:h-[430px] sm:w-[340px]"
          : compact
            ? "h-44 w-44 sm:h-48 sm:w-44"
            : "h-56 w-44 sm:h-64 sm:w-48"
      }`}
      style={{ background: tone.background }}
    >
      <div className="absolute inset-3 border border-white/30" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20" />
      <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border border-white/20" />
      <div className="absolute left-5 top-5 font-mono text-[9px] tracking-[0.3em] text-white/65">PSY / ARCHIVE</div>
      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black/35 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`flex items-center justify-center rounded-full border ${large ? "h-36 w-36" : "h-28 w-28"} border-white/45 bg-black/10 backdrop-blur-[2px]`}>
          <span
            className={`font-serif font-medium tracking-[-0.08em] text-white/90 ${large ? "text-6xl" : "text-5xl"}`}
            style={{ textShadow: "0 2px 14px rgba(0,0,0,.2)" }}
          >
            {profile.initial}
          </span>
        </div>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/65">{profile.role}</div>
          <div className={`mt-1 font-serif text-white ${large ? "text-xl" : "text-base"}`}>{profile.name}</div>
        </div>
        <span className="font-mono text-[9px] text-white/60">{profile.year ?? "PSY 01"}</span>
      </div>
    </div>
  );

  if (!onClick) return frame;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Open portrait of ${profile.name}`}
    >
      {frame}
      <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight size={15} />
      </span>
    </button>
  );
}

export function ProfileLightbox({
  profile,
  onClose,
}: {
  profile: Profile | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!profile) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [profile, onClose]);

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/75 p-5 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${profile.name} profile`}
            className="relative grid max-h-[90dvh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/15 bg-background p-4 shadow-2xl sm:grid-cols-[minmax(230px,340px)_1fr] sm:gap-8 sm:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Close profile"
            >
              <X size={17} />
            </button>
            <div className="flex justify-center pb-4 pt-8 sm:py-2">
              <PortraitFrame profile={profile} large />
            </div>
            <div className="flex flex-col justify-center px-2 pb-5 sm:py-8">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-accent">{profile.role}</p>
              <h3 className="max-w-sm text-4xl font-semibold leading-[.98] text-foreground sm:text-5xl">{profile.name}</h3>
              {profile.year && <p className="mt-4 font-mono text-xs tracking-[0.18em] text-foreground/35">{profile.year}</p>}
              <div className="my-7 h-px w-16 bg-accent/50" />
              <p className="max-w-md text-base font-light leading-relaxed text-foreground/60">{profile.bio}</p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/30">PSYNAPSE / people archive</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}