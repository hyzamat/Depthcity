/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Img from "./ui/Img";
import { Reveal, SplitWords } from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";
import { site } from "@/content/site";

const SOCIAL: { key: keyof typeof site.links; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "discord", label: "Discord" },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "X" },
];

  export default function Footer() {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      
      const formData = new FormData(e.currentTarget);
      
      try {
        await fetch(
          "https://docs.google.com/forms/d/e/1FAIpQLSdqe8GnI5g8G4VTFBVdMn0s4oAbuYD-b7ReOu4nt8Z4tQsvMA/formResponse",
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
      <footer id="follow" className="relative overflow-hidden bg-bg">
        {/* closing image */}
        <div className="relative h-[70svh] min-h-[480px]">
          <Img name="hero-skyline-night" alt="Depth City at night" className="h-full w-full object-cover object-[50%_45%]" portrait sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/30 to-bg" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-2xl">
              <Reveal as="p" className="eyebrow mb-4">
                Coming soon
              </Reveal>
              <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] text-white">
                <SplitWords text="Be there when the first road is laid." />
              </h2>
              <Reveal as="p" className="lede mx-auto mt-6 max-w-lg !text-white/75" delay={2}>
                Leave your email and you’ll hear about the beta, the store pages and the launch — nothing else.
              </Reveal>
  
              <Reveal className="mx-auto mt-8 max-w-md" delay={3}>
                <form
                  className="glass flex items-center gap-2 rounded-full p-1.5 pl-5"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    name="entry.472267812"
                    required
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                    aria-label="Email address"
                  />
                  <Magnetic>
                    <button type="submit" className="btn btn-primary !px-5 !py-2.5" disabled={sent || loading}>
                      {sent ? "Saved ✓" : loading ? "Saving..." : "Notify me"}
                    </button>
                  </Magnetic>
                </form>
                {sent && <p className="mt-3 text-xs text-white/60">Thanks for subscribing! We'll be in touch.</p>}
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 border-t border-white/8 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/brand/mark-192.png" alt="" className="h-10 w-10" />
            <img src="/brand/wordmark-1200.png" alt={site.name} className="h-5" />
          </div>

          <ul className="flex flex-wrap gap-2">
            {SOCIAL.map((s) => {
              const href = site.links[s.key];
              return (
                <li key={s.key}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="glass rounded-full px-4 py-2 text-xs text-white/80 transition hover:text-white">
                      {s.label}
                    </a>
                  ) : (
                    <span className="glass cursor-default rounded-full px-4 py-2 text-xs text-white/40" title="Coming soon">
                      {s.label} · soon
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-8 flex flex-col gap-2 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. Made with passion by {site.creator.name}.</span>
          <span>Built in Unity. All screenshots are real, captured in-engine.</span>
        </div>
      </div>
    </footer>
  );
}
