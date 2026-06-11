"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAPABILITIES = [
  "Systems Research & Development",
  "Interactive & Spatial Computing",
  "Data Systems & Intelligence",
  "Design Engineering",
  "Emerging Interface R&D",
  "Civic & Cultural Technology",
];

export default function Capabilities() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".capability-row", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-32 md:px-10">
      <h2 className="mb-12 font-mono text-sm tracking-widest text-accent">/CAPABILITIES</h2>
      <ul>
        {CAPABILITIES.map((cap, i) => (
          <li
            key={cap}
            className="capability-row group flex items-baseline justify-between border-b border-line py-6 transition-colors hover:border-accent"
          >
            <span className="font-display text-2xl font-bold tracking-tight md:text-4xl">
              {cap}
            </span>
            <span className="font-mono text-xs text-muted group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
