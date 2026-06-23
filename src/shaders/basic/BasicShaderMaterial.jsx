"use client";

import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

export default function BasicShaderMaterial({ texturePath = "/textures/placeholder.jpg" }) {
  const materialRef = useRef();
  const texture = useTexture(texturePath);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}
