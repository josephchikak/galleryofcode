"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/canvas/Scene";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProjectListFallback from "@/components/sections/ProjectListFallback";
import Capabilities from "@/components/sections/Capabilities";
import Partners from "@/components/sections/Partners";
import FoundingStory from "@/components/sections/FoundingStory";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/sections/Footer";

function detectMode() {
  if (typeof window === "undefined") {
    return null;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return reduced || small || !webgl ? "fallback" : "full";
}

export default function HomeExperience() {
  // null until mounted: SSR/static HTML carries the DOM content either way,
  // the canvas only mounts after we know the device can handle it.
  const [mode, setMode] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setMode(detectMode());
    }
  }, []);

  // The projects section (corridor or fallback list) mounts only after mode
  // detection, shifting every section below it down by thousands of pixels.
  // ScrollTrigger measured the page before that, so recalculate positions —
  // otherwise the scroll reveals fire at the wrong spots (or never).
  useEffect(() => {
    if (!mode) return undefined;
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      // If the browser restored a scroll position beyond a reveal trigger,
      // its animation never plays — fast-forward those so content is visible.
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.animation && trigger.end < window.scrollY) {
          trigger.animation.progress(1);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <SmoothScroll>
      {mode === "full" && <Scene />}
      <Nav />
      <main className="relative z-10">
        <Hero />
        {/* <Manifesto /> */}
        {mode === "full" && <ProjectsSection />}
        {mode === "fallback" && <ProjectListFallback />}
        <Capabilities />
        <Partners />
        <FoundingStory />
        <Testimonials />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
