import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Camera, ChevronDown, Clock3, Pause, Play, X } from "lucide-react";
import { Link } from "wouter";

type Slide = {
  caption: string;
  detail: string;
  palette: string;
  accent: string;
  style: "orbit" | "table" | "window" | "portrait" | "wall" | "circle";
};

type GalleryEvent = {
  id: string;
  event: string;
  title: string;
  date: string;
  description: string;
  tag: string;
  slides: Slide[];
};

const galleryEvents: GalleryEvent[] = [
  {
    id: "mind-maze",
    event: "Mind Maze",
    title: "The room where every answer moved",
    date: "October 18, 2025",
    description: "A playful afternoon of perception puzzles, memory loops, and the small surprises hiding inside an ordinary choice.",
    tag: "Interactive lab",
    slides: [
      { caption: "The first clue was already in the room.", detail: "A warm-up in noticing what we usually walk past.", palette: "linear-gradient(135deg,#241b34,#5b3e73 50%,#c57b70)", accent: "#edbaa8", style: "orbit" },
      { caption: "A table full of almost-answers.", detail: "Teams compared what they saw before checking what was true.", palette: "linear-gradient(135deg,#3f2848,#b2666d 55%,#edc39f)", accent: "#fff0d6", style: "table" },
      { caption: "Perspective is a team sport.", detail: "The same image, four different stories, one very loud discussion.", palette: "linear-gradient(135deg,#17213b,#526b91 55%,#c3a8a0)", accent: "#f6e2c5", style: "window" },
    ],
  },
  {
    id: "stress-lab",
    event: "Stress Lab",
    title: "Making space to pause",
    date: "September 26, 2025",
    description: "A guided exploration of attention, breath, and the everyday signals that tell us to slow down and notice.",
    tag: "Wellbeing session",
    slides: [
      { caption: "A pause is something you can practise.", detail: "The room settled into a slower rhythm, one breath at a time.", palette: "linear-gradient(135deg,#173936,#51786f 46%,#d5bd91)", accent: "#e4d3a9", style: "circle" },
      { caption: "We mapped the shape of a busy day.", detail: "Noticing became the first step towards choosing what comes next.", palette: "linear-gradient(135deg,#213d45,#759991 55%,#dfd0ad)", accent: "#f7e9c5", style: "wall" },
      { caption: "Nothing to perform here.", detail: "Just a quiet corner, a glass of water, and a little more room.", palette: "linear-gradient(135deg,#344d49,#9ab19a 52%,#e8d7b4)", accent: "#fff3d1", style: "window" },
    ],
  },
  {
    id: "color-cognition",
    event: "Colour & Cognition",
    title: "A palette for the way we think",
    date: "August 30, 2025",
    description: "A visual study of association, emotion, and how a single shade can change the story we tell ourselves.",
    tag: "Studio experiment",
    slides: [
      { caption: "Before the explanation, there was a colour.", detail: "A wall of swatches became a map of instant associations.", palette: "linear-gradient(135deg,#8a2f29,#d07d46 48%,#f0d59b)", accent: "#fff0c7", style: "wall" },
      { caption: "Same shade. Different memory.", detail: "We traded stories without trying to agree on the feeling.", palette: "linear-gradient(135deg,#4d202c,#a84c42 50%,#e5b36f)", accent: "#ffe0a6", style: "portrait" },
      { caption: "The final palette belonged to everyone.", detail: "A shared study in how context changes what we see.", palette: "linear-gradient(135deg,#613b30,#cb8250 52%,#f2d8a7)", accent: "#fff4d6", style: "table" },
    ],
  },
  {
    id: "club-induction",
    event: "Club Induction",
    title: "The first question of the year",
    date: "July 12, 2025",
    description: "New faces, old curiosities, and a wall covered in questions we want to keep asking together.",
    tag: "Community",
    slides: [
      { caption: "Start with a question, not a title.", detail: "The new cohort met around a prompt wall in the library.", palette: "linear-gradient(135deg,#202a4a,#52658b 50%,#b4c7c0)", accent: "#e8eee0", style: "wall" },
      { caption: "Small groups, large ideas.", detail: "A first conversation can make a room feel like yours.", palette: "linear-gradient(135deg,#253958,#6d849c 50%,#d2b999)", accent: "#f4e8cc", style: "table" },
      { caption: "A little evidence that we were here.", detail: "Names, questions, and the promise to keep looking closer.", palette: "linear-gradient(135deg,#263147,#536477 46%,#bd9f85)", accent: "#ffe0b4", style: "portrait" },
    ],
  },
  {
    id: "psychology-week",
    event: "Psychology Week",
    title: "A week of looking closer",
    date: "April 24, 2025",
    description: "A series of small provocations across campus: optical illusions, thought prompts, and conversations that stayed after the bell.",
    tag: "Campus series",
    slides: [
      { caption: "The corridor became a question.", detail: "Students stopped between classes to test what their eyes believed.", palette: "linear-gradient(135deg,#432827,#9b4d45 45%,#dbb069)", accent: "#f7ddab", style: "orbit" },
      { caption: "Look twice.", detail: "A tiny installation made the familiar feel briefly strange.", palette: "linear-gradient(135deg,#442a25,#b35b42 55%,#e8bf7e)", accent: "#ffe8b7", style: "window" },
      { caption: "Curiosity travelled further than the noticeboard.", detail: "The best conversations kept going long after the activity ended.", palette: "linear-gradient(135deg,#51322c,#9a6250 55%,#d3b17c)", accent: "#f8e6bd", style: "circle" },
    ],
  },
  {
    id: "open-circle",
    event: "Open Circle",
    title: "Curiosity has a seat here",
    date: "March 15, 2025",
    description: "An informal club circle about self-awareness, listening well, and the psychology behind the stories we carry.",
    tag: "Open conversation",
    slides: [
      { caption: "No podium. No right answer.", detail: "Just a circle and the invitation to listen before replying.", palette: "linear-gradient(135deg,#292824,#6d6654 48%,#c8aa7b)", accent: "#f2dfb3", style: "circle" },
      { caption: "A story sounds different when it is held gently.", detail: "We practised asking better questions of one another.", palette: "linear-gradient(135deg,#302f2a,#82785e 54%,#d6bb91)", accent: "#faeaca", style: "portrait" },
      { caption: "Leave with a thought, not a verdict.", detail: "The circle closed with one idea each person wanted to keep.", palette: "linear-gradient(135deg,#3b3930,#827661 48%,#d3b37e)", accent: "#f9e7be", style: "window" },
    ],
  },
];

function AlbumVisual({ item, slide, compact = false, cinematic = false }: { item: GalleryEvent; slide: Slide; compact?: boolean; cinematic?: boolean }) {
  return (
    <div className={`album-film relative ${cinematic ? "h-[340px] sm:h-[500px]" : compact ? "h-60 sm:h-72" : "h-[300px] sm:h-[440px]"} rounded-[1.35rem]`} style={{ background: slide.palette }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {slide.style === "orbit" && <><motion.div className="absolute left-[16%] top-[13%] h-40 w-40 rounded-full border border-white/35" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} /><motion.div className="absolute left-[30%] top-[27%] h-44 w-44 rounded-full border border-white/25" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} /><div className="absolute left-[48%] top-[43%] h-5 w-5 rounded-full bg-white/80 shadow-[0_0_35px_rgba(255,255,255,.6)]" /></>}
      {slide.style === "table" && <><div className="absolute bottom-[17%] left-[10%] h-[28%] w-[80%] rotate-[-4deg] rounded-[45%] bg-black/20" /><div className="absolute bottom-[30%] left-[22%] h-16 w-16 rounded-full border-8 border-white/35" /><div className="absolute bottom-[23%] right-[24%] h-12 w-24 rotate-12 rounded-full border border-white/40" /><div className="absolute bottom-[42%] left-[47%] h-20 w-12 -rotate-12 border border-white/30" /></>}
      {slide.style === "window" && <><div className="absolute right-[13%] top-[12%] h-[72%] w-[48%] border-[10px] border-white/20"><div className="h-1/2 border-b-[8px] border-white/15" /><div className="absolute inset-y-0 left-1/2 border-l-[8px] border-white/15" /></div><div className="absolute bottom-[10%] left-[16%] h-28 w-24 rounded-t-full bg-black/20" /></>}
      {slide.style === "portrait" && <><div className="absolute bottom-[8%] left-[28%] h-[67%] w-[36%] rounded-t-[46%] bg-black/20" /><div className="absolute bottom-[45%] left-[38%] h-20 w-20 rounded-full border-4 border-white/30" /><div className="absolute left-[16%] top-[20%] h-2 w-24 bg-white/35" /><div className="absolute left-[18%] top-[25%] h-2 w-14 bg-white/25" /></>}
      {slide.style === "wall" && <><div className="absolute left-[12%] top-[17%] h-[58%] w-[76%] rotate-2 border-[10px] border-white/20" /><div className="absolute left-[23%] top-[31%] h-20 w-16 -rotate-6 border border-white/55" /><div className="absolute left-[49%] top-[25%] h-28 w-24 rotate-6 border border-white/35" /><div className="absolute right-[19%] top-[37%] h-16 w-20 -rotate-3 border border-white/45" /></>}
      {slide.style === "circle" && <><div className="absolute left-[23%] top-[18%] h-52 w-52 rounded-full border-[20px] border-white/15" /><div className="absolute -bottom-10 -right-6 h-64 w-64 rounded-full border border-white/45" /><div className="absolute bottom-[23%] left-[25%] h-3 w-3 rounded-full bg-white/80" /></>}
      <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4 text-white"><span className="font-mono text-[10px] uppercase tracking-[.28em] text-white/70">{item.event}</span><span className="font-mono text-[10px] text-white/60">FRAME / {String(item.slides.indexOf(slide) + 1).padStart(2, "0")}</span></div>
    </div>
  );
}

function MotionReel({ onOpen }: { onOpen: (item: GalleryEvent, slideIndex: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState({ eventIndex: 0, slideIndex: 0 });
  const item = galleryEvents[position.eventIndex];
  const slide = item.slides[position.slideIndex];
  const totalFrames = galleryEvents.reduce((total, event) => total + event.slides.length, 0);
  const frameNumber = galleryEvents
    .slice(0, position.eventIndex)
    .reduce((total, event) => total + event.slides.length, 0) + position.slideIndex + 1;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setPosition((current) => {
        const currentEvent = galleryEvents[current.eventIndex];
        if (current.slideIndex < currentEvent.slides.length - 1) {
          return { ...current, slideIndex: current.slideIndex + 1 };
        }
        return { eventIndex: (current.eventIndex + 1) % galleryEvents.length, slideIndex: 0 };
      });
    }, 4200);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const move = (direction: number) => {
    setPosition((current) => {
      const currentEvent = galleryEvents[current.eventIndex];
      if (direction > 0) {
        if (current.slideIndex < currentEvent.slides.length - 1) {
          return { ...current, slideIndex: current.slideIndex + 1 };
        }
        return { eventIndex: (current.eventIndex + 1) % galleryEvents.length, slideIndex: 0 };
      }
      if (current.slideIndex > 0) {
        return { ...current, slideIndex: current.slideIndex - 1 };
      }
      const previousEventIndex = (current.eventIndex - 1 + galleryEvents.length) % galleryEvents.length;
      return { eventIndex: previousEventIndex, slideIndex: galleryEvents[previousEventIndex].slides.length - 1 };
    });
  };

  return (
    <section className="motion-reel relative mb-20 overflow-hidden rounded-[2rem] bg-foreground text-background shadow-2xl">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 78% 18%, rgba(205,139,111,.42), transparent 28%), radial-gradient(circle at 10% 90%, rgba(119,138,126,.35), transparent 32%)" }} />
      <div className="relative p-4 sm:p-7 md:p-9">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-background/15 pb-5">
          <div className="flex items-center gap-3">
            <span className="motion-reel-flicker flex h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_hsl(var(--accent))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-background/60">Motion picture / live archive</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-background/70 transition-colors hover:border-background/50 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={isPlaying ? "Pause motion reel" : "Play motion reel"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isPlaying ? "Pause reel" : "Play reel"}
          </button>
        </div>

        <div className="grid gap-7 md:grid-cols-[1.25fr_.75fr] md:items-center md:gap-10">
          <div className="relative overflow-hidden rounded-[1.45rem] border border-background/15 bg-black/20 p-2">
            <div className="relative overflow-hidden rounded-[1.1rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${item.id}-${position.slideIndex}`}
                  className="relative"
                  initial={{ opacity: 0, scale: 1.04, x: 18 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: .98, x: -18 }}
                  transition={{ duration: .55, ease: [.22, 1, .36, 1] }}
                >
                  <AlbumVisual item={item} slide={slide} cinematic />
                </motion.div>
              </AnimatePresence>
              <motion.div
                className="motion-reel-scan pointer-events-none absolute left-0 right-0 z-10 h-px bg-white/65 shadow-[0_0_16px_rgba(255,255,255,.7)]"
                animate={{ top: ["16%", "86%", "16%"] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="pointer-events-none absolute inset-4 border border-white/25" />
              <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.24em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                REC / {String(frameNumber).padStart(2, "0")}
              </div>
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between font-mono text-[9px] uppercase tracking-[.18em] text-white/65">
                <span>PSY / moving archive</span>
                <span>{String(totalFrames).padStart(2, "0")} frames</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 pb-1 pt-3">
              <button type="button" onClick={() => move(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-background/20 text-background/60 transition-colors hover:border-background/50 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Previous moment">
                <ArrowLeft size={14} />
              </button>
              <div className="h-px flex-1 overflow-hidden bg-background/15">
                <motion.div className="h-full bg-accent" animate={{ width: `${(frameNumber / totalFrames) * 100}%` }} transition={{ duration: .5 }} />
              </div>
              <button type="button" onClick={() => move(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-background/20 text-background/60 transition-colors hover:border-background/50 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Next moment">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="px-2 pb-3 md:px-0 md:py-4">
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-accent">A living archive</p>
            <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-[.95] text-background sm:text-5xl">Some memories refuse to stay still.</h2>
            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-background/55">{item.title} — {slide.caption}</p>
            <button type="button" onClick={() => onOpen(item, position.slideIndex)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Open this album <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-background/15 px-4 py-4 sm:px-9 sm:py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[.22em] text-background/35">Jump to a chapter</span>
          {galleryEvents.map((event, index) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setPosition({ eventIndex: index, slideIndex: 0 })}
              className={`rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${index === position.eventIndex ? "border-accent/60 bg-accent/20 text-background" : "border-background/15 text-background/45 hover:border-background/35 hover:text-background/75"}`}
              aria-label={`Play ${event.event} chapter`}
            >
              {event.event}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  const [activeEvent, setActiveEvent] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryEvent | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const filters = useMemo(() => ["All", ...Array.from(new Set(galleryEvents.map((item) => item.event)))], []);
  const visibleItems = activeEvent === "All" ? galleryEvents : galleryEvents.filter((item) => item.event === activeEvent);
  const activeSlide = selectedItem?.slides[slideIndex];

  const openAlbumAt = (item: GalleryEvent, nextSlide = 0) => { setSelectedItem(item); setSlideIndex(nextSlide); };
  const openAlbum = (item: GalleryEvent) => openAlbumAt(item);
  const moveSlide = (direction: number) => {
    if (!selectedItem) return;
    setSlideIndex((current) => (current + direction + selectedItem.slides.length) % selectedItem.slides.length);
  };

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItem(null);
      if (event.key === "ArrowLeft") moveSlide(-1);
      if (event.key === "ArrowRight") moveSlide(1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedItem]);

  return (
    <div className="psynapse-grain min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <header className="relative border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-7 md:pb-28 md:pt-10">
          <Link href="/" className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.28em] text-foreground/45 transition-colors hover:text-foreground" data-testid="link-gallery-home"><ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to PSYNAPSE</Link>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }} className="mt-20 max-w-3xl">
             <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"><Camera size={17} /></span><p className="font-mono text-xs uppercase tracking-[.35em] text-accent">The PSYNAPSE archive</p></div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[.95] text-foreground md:text-8xl">Curiosity, in motion.</h1>
            <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-foreground/55 md:text-lg">Albums from the questions, experiments, and gatherings that make our psychology club feel like a place to belong.</p>
          </motion.div>
          <motion.div className="pointer-events-none absolute -right-24 bottom-[-120px] hidden h-80 w-80 rounded-full border border-accent/20 md:block" animate={{ rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <MotionReel onOpen={openAlbumAt} />
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-border pb-5 md:flex-row md:items-end">
          <div><p className="font-mono text-[10px] uppercase tracking-[.3em] text-foreground/35">Browse the albums</p><p className="mt-2 text-sm font-light text-foreground/45">Each chapter holds three frames, a date, and the feeling of being there.</p></div>
          <div className="relative"><select value={activeEvent} onChange={(event) => setActiveEvent(event.target.value)} className="appearance-none rounded-full border border-border bg-card py-3 pl-4 pr-10 font-mono text-[10px] uppercase tracking-[.18em] text-foreground/65 outline-none transition-colors focus:border-accent" aria-label="Filter gallery by event" data-testid="select-gallery-event">{filters.map((filter) => <option key={filter}>{filter}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45" /></div>
        </div>
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
               <motion.button key={item.id} type="button" layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .45, delay: index * .05 }} onClick={() => openAlbum(item)} className={`group text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`} data-testid={`button-album-${item.id}`}>
                <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card p-2 shadow-sm transition-shadow duration-500 group-hover:shadow-xl"><div className="relative"><AlbumVisual item={item} slide={item.slides[0]} compact={index !== 0} /><span className="absolute right-5 top-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span><span className="absolute bottom-5 right-5 rounded-full bg-foreground/65 px-3 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-background">{item.slides.length} frames</span></div><div className="px-3 pb-4 pt-5"><div className="mb-3 flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">{item.tag}</span><span className="flex items-center gap-1 font-mono text-[10px] text-foreground/35"><CalendarDays size={12} /> {item.date}</span></div><h2 className="max-w-md text-2xl font-semibold leading-tight">{item.title}</h2><p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-foreground/45">{item.description}</p></div></div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="mt-20 flex flex-col justify-between gap-6 rounded-[1.8rem] border border-accent/25 bg-accent/10 p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-accent">A quieter kind of support</p><h2 className="mt-2 text-2xl font-semibold">Want to ask for a conversation?</h2><p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-foreground/55">You can reach the school counselling team through a private, low-pressure request.</p></div><Link href="/counselling" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-gallery-counselling">Open the quiet doorway <ArrowRight size={15} /></Link></div>
      </main>

      <footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-8 text-xs font-mono text-foreground/35 md:flex-row md:items-center"><span>PSYNAPSE / DPS Dwarka</span><Link href="/" className="text-foreground/45 transition-colors hover:text-foreground" data-testid="link-gallery-footer-home">Return to the main experience</Link></div></footer>

      <AnimatePresence>
        {selectedItem && activeSlide && <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/75 p-4 backdrop-blur-md sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedItem(null); }}>
          <motion.div role="dialog" aria-modal="true" aria-label={`${selectedItem.event} photo album`} className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-auto rounded-[2rem] border border-white/15 bg-background p-3 shadow-2xl sm:grid-cols-[1.1fr_.9fr] sm:gap-8 sm:p-6" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .97 }}>
            <button type="button" onClick={() => setSelectedItem(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Close photo album" data-testid="button-close-album"><X size={17} /></button>
            <div className="relative" onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) moveSlide(distance > 0 ? -1 : 1); setTouchStart(null); }}><AnimatePresence mode="wait"><motion.div key={`${selectedItem.id}-${slideIndex}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .25 }}><AlbumVisual item={selectedItem} slide={activeSlide} /></motion.div></AnimatePresence><button type="button" onClick={() => moveSlide(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Previous photo" data-testid="button-previous-photo"><ArrowLeft size={17} /></button><button type="button" onClick={() => moveSlide(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Next photo" data-testid="button-next-photo"><ArrowRight size={17} /></button></div>
            <div className="flex flex-col justify-center px-2 pb-3 pt-6 sm:px-4 sm:py-8"><div className="flex items-center justify-between pr-10"><p className="font-mono text-[10px] uppercase tracking-[.28em] text-accent">{selectedItem.event}</p><span className="font-mono text-[10px] text-foreground/35">{String(slideIndex + 1).padStart(2, "0")} / {String(selectedItem.slides.length).padStart(2, "0")}</span></div><h3 className="mt-5 text-4xl font-semibold leading-[.98]">{activeSlide.caption}</h3><div className="my-7 h-px w-14 bg-accent/50" /><p className="text-base font-light leading-relaxed text-foreground/60">{activeSlide.detail}</p><div className="mt-8 flex items-center gap-2 font-mono text-xs text-foreground/35"><CalendarDays size={14} /> {selectedItem.date }</div><div className="mt-10 flex items-center gap-2" aria-label="Choose photo"><span className="mr-2 font-mono text-[10px] uppercase tracking-[.2em] text-foreground/35">Frames</span>{selectedItem.slides.map((slide, index) => <button type="button" key={slide.caption} onClick={() => setSlideIndex(index)} className={`h-2 rounded-full transition-all ${index === slideIndex ? "w-8 bg-accent" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`} aria-label={`Show frame ${index + 1}`} data-testid={`button-frame-${index + 1}`} />)}</div><p className="mt-7 flex items-center gap-2 text-[11px] text-foreground/35"><Clock3 size={13} /> Use your arrow keys or swipe the frame</p></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}