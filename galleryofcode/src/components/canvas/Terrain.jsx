"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import vertexShader from "./terrainVertex.glsl";
import fragmentShader from "./terrainFragment.glsl";

export default function Terrain() {
  const material = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00ff66") },
      uFade: { value: 1 },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    const u = material.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    // Give the gallery corridor a clean stage: terrain bows out when it is active
    u.uFade.value = THREE.MathUtils.damp(
      u.uFade.value,
      scrollState.corridorActive ? 0 : 1,
      4,
      delta
    );
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2.4, -18]}>
      <planeGeometry args={[90, 60, 110, 70]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
