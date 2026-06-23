"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAPABILITIES = [
  {
    title: "Design",
    text: "We incorporate design principles and art-thinking to develop solutions that improve the well-being of society",
  },
  {
    title: "Innovation",
    text: "Using cutting-edge methods and technologies, we create new innovations and pioneer solutions that push the frontiers of industries and sectors",
  },
  {
    title: "Engineering",
    text: "Our Engineering ethos empowers to build and create technologies that resolve challenges for our clients and partners",
  },
  {
    title: "Research",
    text: "Collaborating with institutional partners and Academia we focus on cutting-edge projects and activities that span a wide range of disciplines, including art, science and technology",
  },
];

export default function Capabilities() {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);

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
      <h2 className="mb-12 font-mono text-sm tracking-widest text-primary">/CAPABILITIES</h2>
      <ul>
        {CAPABILITIES.map((capability, i) => {
          const isOpen = open === i;
          return (
            <li key={capability.title} className="capability-row border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-baseline justify-between py-6 text-left"
              >
                <span
                  className={`font-heading text-2xl tracking-tight transition-colors md:text-4xl ${
                    isOpen ? "text-primary" : "group-hover:text-primary"
                  }`}
                >
                  {capability.title}
                </span>
                <span className="flex items-baseline gap-3 font-mono text-xs">
                  <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden="true"
                    className={`inline-block transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-primary" : "text-muted group-hover:text-primary"
                    }`}
                  >
                    +
                  </span>
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-8 leading-relaxed text-muted">{capability.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
