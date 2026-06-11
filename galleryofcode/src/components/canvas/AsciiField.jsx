"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import vertexShader from "./asciiVertex.glsl";
import fragmentShader from "./asciiFragment.glsl";

// Ordered roughly by visual density — brightness maps to character weight
const CHARS = " .:-=+*xo%#@GC07";
const COLS = 90;
const CELL = 64;

function makeCharAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = CELL * CHARS.length;
  canvas.height = CELL;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${CELL * 0.8}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < CHARS.length; i += 1) {
    ctx.fillText(CHARS[i], i * CELL + CELL / 2, CELL / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export default function AsciiField() {
  const material = useRef();
  const { viewport } = useThree();

  // Lazy state initializer: runs once, allowed to touch the DOM (canvas atlas)
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uGrid: { value: new THREE.Vector2(COLS, 50) },
    uAtlas: { value: makeCharAtlas() },
    uChars: { value: CHARS.length },
    uColor: { value: new THREE.Color("#00ff66") },
    uFade: { value: 1 },
  }));

  // DOM sections cover the canvas in the hero, so track the pointer on window
  useEffect(() => {
    const onMove = (e) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [uniforms]);

  // Dispose the atlas texture on unmount
  useEffect(() => {
    const atlas = uniforms.uAtlas.value;
    return () => atlas.dispose();
  }, [uniforms]);

  useFrame(({ clock }, delta) => {
    const u = material.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uGrid.value.set(COLS, Math.max(2, Math.round((COLS * viewport.height) / viewport.width)));
    // Fade out while scrolling past the hero, and always when the corridor is on stage
    const heroFade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.8));
    const target = scrollState.corridorActive ? 0 : heroFade;
    u.uFade.value = THREE.MathUtils.damp(u.uFade.value, target, 5, delta);
  });

  return (
    <mesh position={[0, 0, 0.5]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
