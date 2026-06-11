"use client";

import { Canvas } from "@react-three/fiber";
import AsciiField from "@/components/canvas/AsciiField";
import Particles from "@/components/canvas/Particles";
import Corridor from "@/components/canvas/Corridor";

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
        <AsciiField />
        <Particles />
        <Corridor />
      </Canvas>
    </div>
  );
}
