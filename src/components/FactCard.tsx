import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronRight, X, Sparkles } from "lucide-react";

const facts = [
  { fact: "Your brain generates about 70,000 thoughts per day — most of them are repetitions of yesterday's.", tag: "Cognition" },
  { fact: "The human brain can't actually multitask. It rapidly switches focus, losing up to 40% of productivity.", tag: "Attention" },
  { fact: "Memories are reconstructed every time you recall them — meaning each remembering slightly changes the memory.", tag: "Memory" },
  { fact: "The brain treats social rejection using the same neural pathways as physical pain.", tag: "Social" },
  { fact: "You make up to 35,000 conscious decisions every single day.", tag: "Decision-Making" },
  { fact: "Smiling, even when forced, can trick your brain into feeling happier by triggering dopamine release.", tag: "Emotion" },
  { fact: "The brain is more active during sleep than during most of your waking hours.", tag: "Sleep" },
  { fact: "Humans are the only animals known to experience 'tip-of-the-tongue' memory failure.", tag: "Language" },
  { fact: "Your brain physically shrinks slightly when you're dehydrated — even mild dehydration affects cognition.", tag: "Biology" },
  { fact: "Reading fiction increases empathy by activating the same neural regions as real-life social experiences.", tag: "Empathy" },
  { fact: "The average person's attention span has dropped from 12 seconds in 2000 to around 8 seconds today.", tag: "Attention" },
  { fact: "Gut bacteria produce over 90% of your body's serotonin — your gut is often called 'the second brain'.", tag: "Neuroscience" },
];

function getTodayFact() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % facts.length;
}

export function FactCard() {
  const [idx, setIdx] = useState(getTodayFact());
  const [flipping, setFlipping] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [peeked, setPeeked] = useState(false);

  /* auto-peek after 3s if not opened yet */
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setPeeked(true), 3000);
    return () => clearTimeout(t);
  }, [dismissed]);

  function next() {
    setFlipping(true);
    setTimeout(() => { setIdx(i => (i + 1) % facts.length); setFlipping(false); }, 380);
  }

  if (dismissed) return null;

  const f = facts[idx];

  return (
    <>
      {/* Floating pill trigger (when closed) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: peeked ? [0, -6, 0] : 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              y: peeked
                ? { duration: 1.2, times: [0, 0.5, 1], repeat: 2, repeatDelay: 4, ease: "easeInOut" }
                : { duration: 0.4 },
            }}
            onClick={() => { setOpen(true); setPeeked(false); }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-foreground text-background pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:bg-foreground/90 active:scale-95 transition-all"
            style={{ boxShadow: "0 8px 32px hsl(25 20% 8% / .35)" }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Brain className="w-4 h-4" />
            </motion.div>
            <span className="text-xs font-mono tracking-wide">Brain Fact</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full card */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.88, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 w-80"
            style={{ boxShadow: "0 16px 56px hsl(25 20% 8% / .28), 0 4px 14px hsl(25 20% 8% / .14)" }}
          >
            <div className="bg-background border border-border rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-background" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest leading-none mb-0.5">Daily</p>
                    <p className="text-sm font-serif font-semibold text-foreground leading-none">Brain Fact</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="ml-2 w-7 h-7 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-card transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fact body — flips */}
              <div className="px-5 py-5 min-h-[120px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, rotateX: -40, y: 12 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 40, y: -12 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    style={{ perspective: 600 }}
                  >
                    <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full mb-3">
                      {f.tag}
                    </span>
                    <p className="text-sm text-foreground/75 font-light leading-relaxed">
                      {f.fact}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-foreground/25 tabular-nums">
                  {idx + 1} / {facts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDismissed(true); }}
                    className="text-[10px] font-mono text-foreground/25 hover:text-foreground/50 transition-colors"
                  >
                    Hide
                  </button>
                  <motion.button
                    onClick={next}
                    disabled={flipping}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-foreground text-background text-xs font-medium px-3.5 py-2 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    style={{ boxShadow: "0 2px 10px hsl(25 20% 8% / .20)" }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Next fact
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
