"use client";

import { useEffect, useRef, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/canvas/Scene";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";

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

  return (
    <SmoothScroll>
      {mode === "full" && <Scene />}
      <Nav />
      <main className="relative z-10">
        <Hero />
        <div className="h-[100vh]" />
      </main>
    </SmoothScroll>
  );
}
