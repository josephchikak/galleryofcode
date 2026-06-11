"use client";

import { useEffect, useRef, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/canvas/Scene";

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
      <main className="relative z-10">
        <h1 className="font-display p-8 text-4xl font-bold">GALLERY OF CODE</h1>
        <div className="h-[200vh]" />
      </main>
    </SmoothScroll>
  );
}
