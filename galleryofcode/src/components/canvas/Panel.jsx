"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import vertexShader from "./panelVertex.glsl";
import fragmentShader from "./panelFragment.glsl";

export default function Panel({ project, position, rotationY }) {
  const mesh = useRef();
  const material = useRef();
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const uniforms = useMemo(
    () => ({
      uColorA: { value: new THREE.Color(project.colors[0]) },
      uColorB: { value: new THREE.Color(project.colors[1]) },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uFade: { value: 0 },
    }),
    [project]
  );

  useFrame(({ clock }, delta) => {
    const u = material.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    // Ease hover glow and corridor fade toward their targets
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, hovered ? 1 : 0, 6, delta);
    u.uFade.value = THREE.MathUtils.damp(
      u.uFade.value,
      scrollState.corridorActive ? 1 : 0,
      4,
      delta
    );
    const targetScale = hovered ? 1.04 : 1;
    mesh.current.scale.setScalar(
      THREE.MathUtils.damp(mesh.current.scale.x, targetScale, 6, delta)
    );
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation-y={rotationY}
      onClick={() => {
        if (scrollState.corridorActive) router.push(`/projects/${project.slug}`);
      }}
      onPointerOver={() => {
        if (!scrollState.corridorActive) return;
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[4.2, 2.6]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
