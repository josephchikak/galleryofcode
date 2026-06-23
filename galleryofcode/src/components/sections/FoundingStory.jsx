"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FoundingStory() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".story-reveal", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="story" ref={ref} className="border-y border-line">
      <div className="mx-auto max-w-5xl px-6 py-32 md:px-10">
        <p className="story-reveal mb-6 font-mono text-sm tracking-widest text-primary">/ORIGIN</p>
        <h2 className="story-reveal font-heading text-4xl leading-tight tracking-tight md:text-6xl">
          Our Founding Stories<span className="text-primary">.</span>
        </h2>
        <p className="story-reveal mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          Our adventure at Gallery of Code began with a vision and passion for creativity,
          development and problem-solving. We had a dream of changing industry, resolving a
          particular issue, and developing a unique product or service.
        </p>
      </div>
    </section>
  );
}
