"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const COUNT = 350;

export default function Particles() {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3] = (Math.random() - 0.5) * 30;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 2] = -Math.random() * 60 + 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.03) * 0.06;
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.08) * 0.4;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff66"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}
