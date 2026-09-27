"use client";

import { useState } from "react";
import { Reveal, SplitWords } from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScdQDaStuxZjXzP8IJfbmKAAxeHFbUCS5g4_vUtYuvpSF8LKw/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      );
      setSent(true);
    } catch (err) {
      console.error("Form submission error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative bg-bg py-24 md:py-36 scroll-mt-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,139,253,0.1),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow mb-4 !text-sky">
            Get in touch
          </Reveal>
          <h2 className="h-display text-[clamp(2.2rem,5vw,4.6rem)] text-gradient-sky">
            <SplitWords text="We'd love your suggestions." />
          </h2>
          <Reveal as="p" className="lede mx-auto mt-6 max-w-lg !text-white/75" delay={1}>
            Have an idea for a new landmark? Found a bug? Or just want to say hi? Reach out to us.
            <br />
            Or email us directly at <a href="mailto:shainal@hizarc.com" className="text-white hover:underline transition hover:text-sky">shainal@hizarc.com</a>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-14 max-w-xl" delay={2} amount={0.2}>
          <form
            className="card relative flex flex-col gap-5 p-6 backdrop-blur-xl md:p-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60" htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="entry.1213460570"
                  type="text"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-sky/50 focus:bg-white/10"
                  placeholder="Your name"
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60" htmlFor="email">Email (Optional)</label>
                <input
                  id="email"
                  name="entry.936892380"
                  type="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-sky/50 focus:bg-white/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60" htmlFor="phone">Contact Number (Optional)</label>
              <input
                id="phone"
                name="entry.804075490"
                type="tel"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-sky/50 focus:bg-white/10"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60" htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="entry.701802949"
                required
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-sky/50 focus:bg-white/10"
                placeholder="What's on your mind?"
              />
            </div>

            <div className="mt-4 text-center">
              <Magnetic>
                <button type="submit" className="btn btn-primary w-full justify-center !py-3.5 sm:w-auto active:scale-95 touch-manipulation" disabled={sent || loading}>
                  {sent ? "Message Sent ✓" : loading ? "Sending..." : "Send Message"}
                </button>
              </Magnetic>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
