"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const PARTNERS = [
  "Ars Electronica",
  "The World Bank",
  "Federal Ministry Republic of Austria — Europe, Integration and Foreign Affairs",
];

export default function Partners() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".partners-reveal", {
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
    <section id="partners" ref={ref} className="mx-auto max-w-5xl px-6 py-32 md:px-10">
      <p className="partners-reveal mb-12 font-mono text-sm tracking-widest text-primary">
        PARTNERS
      </p>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="partners-reveal font-heading text-[26vw] leading-none text-primary md:text-[12vw]">
          50+
        </h2>
        <p className="partners-reveal max-w-xs pb-4 font-mono text-xs leading-relaxed tracking-wider text-muted">
          PARTNERS AND CLIENTS WE WORK WITH
        </p>
      </div>
      <ul className="mt-16 grid grid-cols-1 gap-px bg-line md:grid-cols-3">
        {PARTNERS.map((partner, i) => (
          <li
            key={partner}
            className="partners-reveal group flex min-h-44 flex-col justify-between gap-6 bg-background p-8 transition-colors"
          >
            <span className="font-mono text-xs text-muted group-hover:text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-heading text-xl leading-snug tracking-tight md:text-2xl">
              {partner}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
