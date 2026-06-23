"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const BLOCKS = [
  {
    index: "",
    heading: "Artificial Intelligence Lab",
    text: "We are building advanced AI systems for Predictive Policing and Crime Forecasting while exploring use of Artificial Intelligence in addressing Food security in Africa.",
  },
   {
    index: "",
    heading: "Data Science Lab",
    text: "Our data engineering lab applies data analytics to address challenges on a national scale such as the World Bank funded Tracer Study Software to trace outcomes of Technical and Vocational Education and Training (TVET) graduates.",
  },
   {
    index: "",
    heading: "Internet of Things Lab",
    text: "Our Internet of Things (IoT) lab is a specialized knowledge workspace for all experimentation, research and development related to IoT technologies.",
  },
   {
    index: "",
    heading: "Design Research Lab",
    text: "Our creative space is dedicated for design and innovation. Our design capabilities range from hardware product design and prototyping to User Interface and User Experience development.",
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

      <h1 className="mb-12 font-heading text-xl tracking-widest text-primary">
        Transdisciplinary lab merging arts, science, technology</h1>  
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-muted md:text-xl">
          Gallery of Code was started as a partnership with Ars Electronica FutureLab; a research and innovation laboratory in Linz Austria and part of the larger Ars Electronica Center, which is an institution dedicated to exploring the intersection of art, technology, and society. The partnership was supported in 2018 from the Austrian ministry of Foreign Affairs.
        </p>
      {BLOCKS.map((block) => (
        <div
          key={block.index}
          className="manifesto-block mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-24 md:px-10"
        >
          <span className="manifesto-reveal mb-6 font-mono text-sm text-primary">
            /{block.index}
          </span>
          <h2 className="manifesto-reveal font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
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
