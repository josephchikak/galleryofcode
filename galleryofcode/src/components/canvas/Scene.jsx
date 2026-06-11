"use client";

import { Canvas } from "@react-three/fiber";
import Particles from "@/components/canvas/Particles";

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ fov: 55, position: [0, 0, 6] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0a0f0a"]} />
        <fog attach="fog" args={["#0a0f0a", 8, 26]} />
        <Particles />
      </Canvas>
    </div>
  );
}
