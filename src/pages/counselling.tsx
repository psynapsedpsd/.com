import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, CircleHelp, LockKeyhole, Send, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

type CounsellingForm = {
  fullName: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  contactMethod: string;
  supportAreas: string[];
  urgency: string;
  availability: string;
  message: string;
  consent: boolean;
};

const initialForm: CounsellingForm = {
  fullName: "",
  grade: "",
  section: "",
  email: "",
  phone: "",
  contactMethod: "School email",
  supportAreas: [],
  urgency: "",
  availability: "",
  message: "",
  consent: false,
};

const supportOptions = ["Stress or overwhelm", "Friendships or conflict", "Focus and motivation", "Confidence or self-image", "Something else"];

export function Counselling() {
  const [form, setForm] = useState<CounsellingForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      setSubmitted(Boolean(localStorage.getItem("psynapse-counselling-request")));
    } catch {
      setSubmitted(false);
    }
  }, []);

  const update = <K extends keyof CounsellingForm>(key: K, value: CounsellingForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const toggleSupport = (option: string) => {
    const next = form.supportAreas.includes(option)
      ? form.supportAreas.filter((item) => item !== option)
      : [...form.supportAreas, option];
    update("supportAreas", next);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Please add your name.";
    if (!form.grade) next.grade = "Choose your grade.";
    if (!form.section.trim()) next.section = "Add your section.";
    if (!form.email.trim()) next.email = "A school email helps us reply privately.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please check the email format.";
    if (!form.supportAreas.length) next.supportAreas = "Choose at least one area.";
    if (!form.urgency) next.urgency = "Tell us how soon you would like support.";
    if (!form.availability.trim()) next.availability = "A rough time is enough.";
    if (!form.message.trim()) next.message = "Share only what feels okay to share.";
    if (!form.consent) next.consent = "Please confirm that we may contact you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      localStorage.setItem("psynapse-counselling-request", JSON.stringify({ ...form, submittedAt: new Date().toISOString() }));
    } catch {
      // The success state still matters if storage is unavailable for this browser.
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="psynapse-grain min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-counselling-home">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="PSYNAPSE logo" className="h-9 w-9 object-contain" />
            <div>
              <p className="font-serif text-lg font-bold tracking-[.2em]">PSYNAPSE</p>
              <p className="font-mono text-[9px] uppercase tracking-[.28em] text-foreground/40">DPS Dwarka</p>
            </div>
          </Link>
          <Link href="/" className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.22em] text-foreground/45 transition-colors hover:text-foreground" data-testid="link-back-home">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to the club
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:px-8 md:pb-28 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[.32em] text-accent">A quieter doorway</p>
            <h1 className="mt-5 max-w-md text-5xl font-semibold leading-[.93] md:text-7xl">You do not have to carry it alone.</h1>
            <p className="mt-7 max-w-md text-base font-light leading-relaxed text-foreground/58">
              This is a private way to ask for a conversation with a school counsellor. You can be unsure, have only a few words, or not know what you need yet.
            </p>
            <div className="mt-10 space-y-4 border-t border-border pt-6">
              <div className="flex gap-3">
                <LockKeyhole size={17} className="mt-0.5 shrink-0 text-accent" />
                <div><p className="text-sm font-medium">Kept within the school support team</p><p className="mt-1 text-xs leading-relaxed text-foreground/45">We only use these details to respond to your request.</p></div>
              </div>
              <div className="flex gap-3">
                <CircleHelp size={17} className="mt-0.5 shrink-0 text-accent" />
                <div><p className="text-sm font-medium">No perfect explanation needed</p><p className="mt-1 text-xs leading-relaxed text-foreground/45">The first conversation can help you find the words.</p></div>
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-border bg-card/65 p-5 shadow-[0_18px_50px_hsl(25_20%_8%/.08)] sm:p-8 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[520px] flex-col justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check size={25} /></div>
                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[.3em] text-accent">Request received</p>
                  <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight md:text-5xl">Thank you for making a little room for yourself.</h2>
                  <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-foreground/58">
                    Someone from the school support team will reach out using your preferred contact method. Until then, you can close this page; your request is saved on this device.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-success-home">Return to PSYNAPSE <ChevronRight size={15} /></Link>
                    <button type="button" onClick={() => { localStorage.removeItem("psynapse-counselling-request"); setSubmitted(false); setForm(initialForm); }} className="rounded-full border border-border px-5 py-3 text-sm text-foreground/65 transition-colors hover:border-foreground/35 hover:text-foreground" data-testid="button-new-request">Start another request</button>
                  </div>
                  <div className="mt-12 flex gap-3 border-t border-border pt-5 text-xs leading-relaxed text-foreground/42"><ShieldCheck size={16} className="shrink-0 text-accent" /> Your form is not sent to PSYNAPSE club members. It is a request for the school counselling team.</div>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} noValidate>
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                    <div><p className="font-mono text-[10px] uppercase tracking-[.28em] text-foreground/38">Start here</p><h2 className="mt-2 text-3xl font-semibold">A note to the counsellor</h2></div>
                    <span className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/35">Private / 01</span>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-foreground/52">Required fields are marked with <span className="text-accent">*</span>. Write as much or as little as you can today.</p>

                  <fieldset className="mt-8 space-y-5">
                    <legend className="font-mono text-[10px] uppercase tracking-[.25em] text-accent">About you</legend>
                    <div className="grid gap-5 sm:grid-cols-[1.35fr_.65fr_.65fr]">
                      <Field label="Full name" id="fullName" error={errors.fullName} required><input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="field-input" autoComplete="name" data-testid="input-full-name" /></Field>
                      <Field label="Grade" id="grade" error={errors.grade} required><select id="grade" value={form.grade} onChange={(e) => update("grade", e.target.value)} className="field-input" data-testid="select-grade"><option value="">Choose</option>{["IX", "X", "XI", "XII"].map((grade) => <option key={grade}>{grade}</option>)}</select></Field>
                      <Field label="Section" id="section" error={errors.section} required><input id="section" value={form.section} onChange={(e) => update("section", e.target.value)} className="field-input" data-testid="input-section" /></Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="School email" id="email" error={errors.email} required hint="Only used to reply to you."><input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="field-input" autoComplete="email" data-testid="input-school-email" /></Field>
                      <Field label="Phone number" id="phone" hint="Optional"><input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field-input" autoComplete="tel" data-testid="input-phone" /></Field>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">How should we reach you? <span className="text-accent">*</span></p>
                      <div className="flex flex-wrap gap-2">{["School email", "Phone call", "In person at school"].map((method) => <label key={method} className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors ${form.contactMethod === method ? "border-accent bg-accent/10 text-foreground" : "border-border text-foreground/55 hover:border-foreground/30"}`}><input type="radio" name="contactMethod" value={method} checked={form.contactMethod === method} onChange={(e) => update("contactMethod", e.target.value)} className="sr-only" data-testid={`radio-contact-${method.toLowerCase().replaceAll(" ", "-")}`} />{method}</label>)}</div>
                    </div>
                  </fieldset>

                  <fieldset className="mt-10 space-y-5 border-t border-border pt-8">
                    <legend className="font-mono text-[10px] uppercase tracking-[.25em] text-accent">What would help</legend>
                    <div><p className="mb-2 text-sm font-medium">What would you like support with? <span className="text-accent">*</span></p><div className="flex flex-wrap gap-2">{supportOptions.map((option) => <label key={option} className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors ${form.supportAreas.includes(option) ? "border-accent bg-accent/10 text-foreground" : "border-border text-foreground/55 hover:border-foreground/30"}`}><input type="checkbox" checked={form.supportAreas.includes(option)} onChange={() => toggleSupport(option)} className="sr-only" data-testid={`checkbox-support-${option.toLowerCase().replaceAll(" ", "-")}`} />{option}</label>)}</div>{errors.supportAreas && <ErrorText>{errors.supportAreas}</ErrorText>}</div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="How soon would you like support?" id="urgency" error={errors.urgency} required><select id="urgency" value={form.urgency} onChange={(e) => update("urgency", e.target.value)} className="field-input" data-testid="select-urgency"><option value="">Choose one</option><option>As soon as possible</option><option>This week</option><option>I am not sure yet</option></select></Field>
                      <Field label="When are you usually available?" id="availability" error={errors.availability} required hint="For example: lunch break or after 3:30 pm."><input id="availability" value={form.availability} onChange={(e) => update("availability", e.target.value)} className="field-input" data-testid="input-availability" /></Field>
                    </div>
                    <Field label="What would you like to share?" id="message" error={errors.message} required hint="Please do not include anything you would not want stored on this device."><textarea id="message" rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className="field-input min-h-[130px] resize-y" data-testid="textarea-message" /></Field>
                  </fieldset>

                  <div className="mt-8 border-t border-border pt-7">
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground/60"><input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-[hsl(var(--accent))]" data-testid="checkbox-consent" /><span>I am comfortable being contacted by the school counselling team about this request. <span className="text-accent">*</span></span></label>
                    {errors.consent && <ErrorText>{errors.consent}</ErrorText>}
                    <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-auto" data-testid="button-submit-counselling"><Send size={16} /> Send this request</button>
                    <p className="mt-4 flex items-center gap-2 text-xs text-foreground/38"><LockKeyhole size={13} /> Your answers stay in this browser until you submit another request.</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}

function ErrorText({ children }: { children: string }) {
  return <p className="mt-2 text-xs text-accent" role="alert">{children}</p>;
}

function Field({ label, id, error, hint, required, children }: { label: string; id: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label} {required && <span className="text-accent">*</span>}</label>
      {children}
      {hint && !error && <p className="mt-2 text-[11px] leading-relaxed text-foreground/38">{hint}</p>}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}