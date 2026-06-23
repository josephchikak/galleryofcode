"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/data/projects.mjs";
import { scrollState } from "@/lib/scrollState";
import Panel from "./Panel";

const SPACING = 5; // z-distance between panels
const CAMERA_START_Z = 6; // matches Canvas camera position
const CORRIDOR_DEPTH = (projects.length - 1) * SPACING; // total camera travel

export default function Corridor() {
  useFrame(({ camera }, delta) => {
    // Dolly the camera through the corridor; rest position when not in section.
    // At progress i/(n-1) the camera sits CAMERA_START_Z in front of panel i
    // (panel i is at z = -i * SPACING), so every panel passes through the same
    // on-screen framing in turn.
    const targetZ = scrollState.corridorActive
      ? CAMERA_START_Z - scrollState.corridor * CORRIDOR_DEPTH
      : CAMERA_START_Z;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
  });

  return (
    <group>
      {projects.map((project, i) => (
        <Panel
          key={project.slug}
          project={project}
          position={[i % 2 === 0 ? -1.2 : 1.2, 0, -i * SPACING]}
          rotationY={i % 2 === 0 ? 0.12 : -0.12}
        />
      ))}
    </group>
  );
}
