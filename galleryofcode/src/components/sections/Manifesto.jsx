"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const BLOCKS = [
  {
    index: "",
    heading: "We build what comes next.",
    text: "Gallery of Code is a research and development practice. We take questions that look like science fiction — autonomous infrastructure, post-quantum identity, ambient computing — and engineer them into working systems, years before the market asks for them.",
  },

];

export default function Manifesto() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".manifesto-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".manifesto-reveal"), {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: block,
              start: "top 70%",
            },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="about" ref={ref} className="relative">

      <h1 className="mb-12 font-mono text-sm tracking-widest text-accent">
        Transdisciplinary lab merging arts, science, technology</h1>  
      {BLOCKS.map((block) => (
        <div
          key={block.index}
          className="manifesto-block mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-24 md:px-10"
        >
          <span className="manifesto-reveal mb-6 font-mono text-sm text-accent">
            /{block.index}
          </span>
          <h2 className="manifesto-reveal font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {block.heading}
          </h2>
          <p className="manifesto-reveal mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {block.text}
          </p>
        </div>
      ))}
    </section>
  );
}
