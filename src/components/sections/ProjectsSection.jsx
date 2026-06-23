"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects.mjs";
import { scrollState } from "@/lib/scrollState";

export default function ProjectsSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollState.corridor = self.progress;
          setActive(
            Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1)))
          );
        },
        onToggle: (self) => {
          scrollState.corridorActive = self.isActive;
        },
      });
    },
    { scope: ref }
  );

  const project = projects[active];

  return (
    // pointer-events-none lets hover/click reach the canvas behind this section
    <section
      id="projects"
      ref={ref}
      className="pointer-events-none relative"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between py-24">
        <div className="flex items-baseline justify-between px-6 md:px-10">
          <h2 className="font-heading text-sm font-bold tracking-widest text-muted">
            SELECTED WORK <span className="text-primary">2019—2026</span>
          </h2>
          <span className="font-mono text-xs text-muted">SCROLL ↓ / CLICK PANEL TO OPEN</span>
        </div>
        <div className="px-6 text-center md:px-10">
          <div className="font-mono text-sm text-primary">
            {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            <span className="mx-3 text-muted">—</span>
            {project.year}
          </div>
          <div className="font-heading mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </div>
          <div className="mt-3 font-mono text-xs tracking-wider text-muted">
            {project.disciplines.join(" / ")}
          </div>
        </div>
      </div>
    </section>
  );
}
