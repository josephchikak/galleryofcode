"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const LINES = ["AT THE", "AVANT-GARDE", "OF FUTURE", "SYSTEMS"];
const TICKER = "TECHNOLOGY ✕ DESIGN ✕ SOCIETY ✕ RESEARCH ✕ ";

export default function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-line", {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.2,
        });
        gsap.from(".hero-meta", { opacity: 0, duration: 1, delay: 1 });
      });
    },
    { scope: ref }
  );

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen flex-col justify-end pb-10">
      <div className="px-6 md:px-10">
        <p className="hero-meta mb-6 max-w-md font-mono text-xs leading-relaxed tracking-wider text-muted">
          MULTI-DISCIPLINARY TECHNOLOGY INNOVATION, RESEARCH &amp; DEVELOPMENT —
          SOLUTIONS AT THE INTERSECTION OF TECHNOLOGY, DESIGN AND SOCIETY.
        </p>
        <h1 className="font-display font-bold leading-[0.92] tracking-tight">
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-line block text-[13vw] md:text-[9.5vw]">
                {line === "SYSTEMS" ? (
                  <>
                    SYSTEMS<span className="text-accent">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>
      </div>
      <div className="mt-10 overflow-hidden border-y border-line py-3">
        <div className="animate-marquee flex w-max whitespace-nowrap font-mono text-xs tracking-[0.3em] text-muted">
          <span>{TICKER.repeat(6)}</span>
          <span>{TICKER.repeat(6)}</span>
        </div>
      </div>
    </section>
  );
}
