# Gallery of Code Immersive Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Gallery of Code marketing site — a canvas-first immersive home page (hero → manifesto → 3D project corridor → capabilities → contact) plus server-rendered project detail pages.

**Architecture:** One fixed full-screen R3F `<Canvas>` behind all DOM content on the home page. Lenis smooths native scroll; GSAP ScrollTrigger is the single scroll source of truth — it drives DOM reveals and writes progress into a shared mutable `scrollState` object that the Three.js scene reads each frame (camera dolly through the project corridor). Project panels are procedural shader planes (no image assets needed). Clicking a panel routes to `/projects/[slug]`, a static server-rendered detail page. Reduced-motion / small-screen / no-WebGL visitors get a flat DOM project list instead of the corridor.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, three + @react-three/fiber + @react-three/drei (installed), Tailwind 4, GSAP + @gsap/react + ScrollTrigger, Lenis. GLSL files load via existing `raw-loader`/`asset/source` config.

**Spec:** `docs/superpowers/specs/2026-06-11-galleryofcode-site-design.md`

---

## Critical conventions for this Next.js version (verified against `node_modules/next/dist/docs/`)

- **`params` is a Promise.** Server pages: `export default async function Page({ params }) { const { slug } = await params; ... }`. Same for `generateMetadata`.
- `generateStaticParams` prerenders dynamic routes at build time.
- Root layout must contain `<html>` and `<body>`. Fonts via `next/font/google` with CSS variables.
- Client components need `"use client"`; three/R3F/GSAP code is always client.
- `@/*` alias → `./src/*` (jsconfig.json).
- `.glsl` imports return source strings (configured in `next.config.mjs` for both turbopack and webpack).

## File structure

```
src/
  data/
    projects.mjs            # all project content (single source of truth)
    projects.test.mjs       # node:test data validation
  lib/
    gsap.js                 # central gsap + ScrollTrigger + useGSAP registration
    scrollState.js          # shared mutable scroll state (DOM → canvas bridge)
  components/
    SmoothScroll.jsx        # Lenis + ScrollTrigger wiring
    HomeExperience.jsx      # client composition root + fallback detection
    canvas/
      Scene.jsx             # fixed Canvas, fog, ambient particles
      Particles.jsx         # drifting green points
      Corridor.jsx          # panel group + camera dolly
      Panel.jsx             # one project plane (shader, hover, click)
      panelVertex.glsl
      panelFragment.glsl
    sections/
      Nav.jsx
      Hero.jsx
      Manifesto.jsx
      ProjectsSection.jsx   # tall scroll section + ScrollTrigger driver + DOM overlay
      ProjectListFallback.jsx
      Capabilities.jsx
      Footer.jsx
  app/
    layout.js               # fonts, metadata, grain overlay (modify)
    globals.css             # brand tokens (modify)
    page.js                 # renders HomeExperience (modify)
    projects/[slug]/page.js # detail pages (create)
```

---

### Task 1: Dependencies and brand foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.js`

- [ ] **Step 1: Install animation dependencies**

```bash
npm install gsap @gsap/react lenis
```

Expected: packages added to `package.json` dependencies without errors.

- [ ] **Step 2: Replace `src/app/globals.css` with brand tokens**

```css
@import "tailwindcss";

:root {
  --background: #0a0f0a;
  --foreground: #edf2ea;
  --accent: #00ff66;
  --accent-dim: #0d2b16;
  --muted: #7c8a7c;
  --line: rgba(237, 242, 234, 0.14);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-accent-dim: var(--accent-dim);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-space-grotesk);
}

html {
  background: var(--background);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
  overflow-x: hidden;
}

::selection {
  background: var(--accent);
  color: var(--background);
}

/* Film grain overlay — pure CSS, sits above everything, never blocks input */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

/* Marquee ticker */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 28s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

- [ ] **Step 3: Replace `src/app/layout.js` — add Space Grotesk display font and real metadata**

```jsx
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata = {
  title: "Gallery of Code — Future Systems R&D",
  description:
    "Multi-disciplinary technology innovation, research and development company at the avant-garde of future systems. We create innovative solutions at the intersection of technology, design and society.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify dev server boots with new foundation**

Run: `npm run dev` (briefly), open http://localhost:3000.
Expected: default scaffold page renders on near-black background with light text; no console errors about fonts or CSS. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/app/globals.css src/app/layout.js
git commit -m "feat: brand foundation - palette tokens, display font, gsap/lenis deps"
```

---

### Task 2: Project data with validation test

**Files:**
- Create: `src/data/projects.mjs`
- Test: `src/data/projects.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/data/projects.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "./projects.mjs";

test("there are at least 6 projects", () => {
  assert.ok(projects.length >= 6);
});

test("every project has the required fields", () => {
  for (const p of projects) {
    assert.equal(typeof p.slug, "string", `slug missing on ${p.title}`);
    assert.match(p.slug, /^[a-z0-9-]+$/, `slug not url-safe: ${p.slug}`);
    assert.equal(typeof p.title, "string");
    assert.equal(typeof p.year, "number");
    assert.ok(Array.isArray(p.disciplines) && p.disciplines.length > 0);
    assert.equal(typeof p.summary, "string");
    assert.ok(Array.isArray(p.body) && p.body.length > 0, `body paragraphs missing on ${p.slug}`);
    assert.ok(Array.isArray(p.colors) && p.colors.length === 2, `need 2 colors on ${p.slug}`);
    for (const c of p.colors) assert.match(c, /^#[0-9a-f]{6}$/i);
  }
});

test("slugs are unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("projects are sorted by year ascending (it is a timeline)", () => {
  const years = projects.map((p) => p.year);
  assert.deepEqual(years, [...years].sort((a, b) => a - b));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/data/`
Expected: FAIL — `Cannot find module ... projects.mjs`

- [ ] **Step 3: Create `src/data/projects.mjs` with 8 placeholder projects**

```js
// Single source of truth for project content.
// Swap placeholder entries with real Gallery of Code projects here — nothing else needs to change.
export const projects = [
  {
    slug: "lagos-transit-mesh",
    title: "Lagos Transit Mesh",
    year: 2019,
    disciplines: ["Data Systems", "Urban Research", "Visualization"],
    summary:
      "A live data platform mapping informal transit networks across Lagos, turning fragmented route knowledge into an open civic resource.",
    body: [
      "Lagos moves on a transit system that exists almost entirely in the heads of its drivers and passengers. Transit Mesh set out to make that invisible network legible — collecting route traces from hundreds of daily journeys and resolving them into a living map of the city's danfo and keke corridors.",
      "The platform pairs a streaming ingestion pipeline with a cartographic interface designed for low-bandwidth use. Routes are versioned like code: when the city shifts, the map shifts with it, and every change is auditable.",
      "Transit Mesh became a reference dataset for urban planners and a public demonstration that civic infrastructure can be built from the ground up, with the people who use it.",
    ],
    colors: ["#0d2b16", "#00ff66"],
  },
  {
    slug: "aether-grid",
    title: "Aether Grid",
    year: 2020,
    disciplines: ["Energy Systems", "Embedded Engineering", "R&D"],
    summary:
      "An operating layer for distributed solar microgrids — autonomous load balancing for communities the central grid forgot.",
    body: [
      "Aether Grid is a control system for community-scale solar: a mesh of metering nodes and switching hardware governed by a forecasting model that learns each community's rhythm of demand.",
      "The system negotiates energy between households autonomously, prioritizing clinics and cold storage, and degrades gracefully — every node can run isolated for days and resynchronize without operator intervention.",
      "Deployed as a pilot across three off-grid settlements, Aether Grid demonstrated that resilient energy infrastructure is a software problem as much as a hardware one.",
    ],
    colors: ["#102819", "#7dffb0"],
  },
  {
    slug: "civic-lens",
    title: "Civic Lens",
    year: 2021,
    disciplines: ["Data Visualization", "Civic Technology", "Design"],
    summary:
      "An open governance observatory rendering public budgets and procurement flows as navigable, explorable structures.",
    body: [
      "Public money leaves a paper trail that almost no member of the public can follow. Civic Lens ingests budget releases, procurement records and audit reports, links them into a single graph, and renders that graph as an explorable spatial structure.",
      "The interface treats transparency as a design problem: flows are drawn as physical channels whose width is honest about magnitude, and every node resolves down to the source document it was built from.",
      "Civic Lens has been used by journalists and civil society groups to trace allocations through three layers of government — and by two ministries to explain their own budgets.",
    ],
    colors: ["#0c2420", "#3ddc97"],
  },
  {
    slug: "helix-archive",
    title: "Helix Archive",
    year: 2022,
    disciplines: ["Digitization", "Cultural Heritage", "Full-stack Systems"],
    summary:
      "A preservation-grade digitization system for endangered cultural archives — capture, catalogue and public access in one pipeline.",
    body: [
      "Archives across the continent are decaying faster than they are being digitized. Helix is an end-to-end system built to change that arithmetic: a portable capture rig, a cataloguing schema designed with archivists, and a public access layer that respects custodial rights.",
      "Every artifact moves through the pipeline with provenance intact — capture conditions, handling history and rights metadata travel with the image, cryptographically sealed.",
      "Helix has processed over forty thousand objects to date, and its schema has been adopted by two national institutions as their internal standard.",
    ],
    colors: ["#16261a", "#b8ff6f"],
  },
  {
    slug: "murmur",
    title: "Murmur",
    year: 2023,
    disciplines: ["Interface Research", "Audio Systems", "Machine Learning"],
    summary:
      "Research into ambient language interfaces — computing you talk to the way you talk to a room, not a machine.",
    body: [
      "Murmur asks what voice computing looks like when it stops imitating a command line. The research prototypes treat conversation as ambient: the system listens for intent across natural speech, responds in context, and knows when silence is the right answer.",
      "The work produced a low-latency on-device speech stack tuned for West African English and Pidgin, and a set of interaction patterns for multi-speaker rooms that we have published openly.",
      "Murmur's findings now inform our client work on spatial and voice-first systems, and the Pidgin corpus has been downloaded by research groups on four continents.",
    ],
    colors: ["#0e2913", "#00e07a"],
  },
  {
    slug: "terraform-index",
    title: "Terraform Index",
    year: 2024,
    disciplines: ["Climate Modeling", "Data Systems", "Research"],
    summary:
      "A climate adaptation model that scores neighbourhood-level interventions — where a tree, a drain or a roof matters most.",
    body: [
      "Climate adaptation funding flows toward what can be measured. Terraform Index makes the small measurable: a model that fuses satellite imagery, hydrology and street-level surveys to score the impact of micro-interventions block by block.",
      "The index is built to be argued with — every score decomposes into its inputs, and local knowledge can override remote sensing where the ground truth says otherwise.",
      "Pilot deployments in two flood-prone districts have redirected drainage investment toward the streets the model flagged, with measured runoff improvements in the first rainy season.",
    ],
    colors: ["#13290f", "#9dff00"],
  },
  {
    slug: "synthesis-engine",
    title: "Synthesis Engine",
    year: 2025,
    disciplines: ["Generative Design", "Tooling", "Computation"],
    summary:
      "A generative design toolchain that treats constraints as material — explore the full space of what a design could be.",
    body: [
      "Synthesis Engine is a toolchain for designers who think in systems: declare the constraints — structural, material, aesthetic — and the engine explores the space of forms that satisfy them, in real time.",
      "Under the hood it pairs an evolutionary solver with a differentiable geometry kernel, so the search is both broad and steerable. Designers pull the search toward what feels right; the engine keeps it honest about what stands up.",
      "The toolchain has shaped commissioned work from pavilion structures to typeface systems, and its constraint language is the foundation of our internal design tooling.",
    ],
    colors: ["#0a2f1e", "#34f5c5"],
  },
  {
    slug: "protocol-zero",
    title: "Protocol Zero",
    year: 2026,
    disciplines: ["Cryptography", "Identity Systems", "R&D"],
    summary:
      "Post-quantum identity infrastructure research — credentials that survive the next era of computing.",
    body: [
      "Most digital identity systems are built on mathematics with an expiry date. Protocol Zero is our ongoing research programme into identity infrastructure that survives the arrival of quantum computation.",
      "The work spans lattice-based credential schemes, offline-first verification for low-connectivity contexts, and the governance question underneath it all: who should be able to issue, revoke and audit identity at national scale.",
      "Protocol Zero is developed in the open, with reference implementations and threat models published as they mature. It is the most consequential question we know how to work on.",
    ],
    colors: ["#0f2b22", "#00ffc3"],
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/data/`
Expected: PASS — 4 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.mjs src/data/projects.test.mjs
git commit -m "feat: project placeholder data with validation tests"
```

---

### Task 3: Scroll infrastructure and page shell

**Files:**
- Create: `src/lib/gsap.js`
- Create: `src/lib/scrollState.js`
- Create: `src/components/SmoothScroll.jsx`
- Create: `src/components/HomeExperience.jsx`
- Modify: `src/app/page.js`

- [ ] **Step 1: Create `src/lib/gsap.js` — single registration point**

```js
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

All other files import gsap from `@/lib/gsap`, never from `gsap` directly — guarantees plugins are registered exactly once.

- [ ] **Step 2: Create `src/lib/scrollState.js` — the DOM → canvas bridge**

```js
// Mutable singleton read by the Three.js scene every frame and written by
// ScrollTrigger. Deliberately NOT React state: scroll updates at 60+fps must
// not cause React renders.
export const scrollState = {
  corridor: 0, // 0..1 progress through the projects section
  corridorActive: false, // is the projects section currently pinned/visible
};
```

- [ ] **Step 3: Create `src/components/SmoothScroll.jsx`**

```jsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
```

- [ ] **Step 4: Create `src/components/HomeExperience.jsx` (skeleton — sections land in later tasks)**

```jsx
"use client";

import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";

function detectMode() {
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

  useEffect(() => {
    setMode(detectMode());
  }, []);

  return (
    <SmoothScroll>
      <main className="relative z-10">
        <h1 className="font-display p-8 text-4xl font-bold">GALLERY OF CODE</h1>
        <p className="p-8 font-mono text-accent">mode: {mode ?? "detecting"}</p>
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 5: Replace `src/app/page.js`**

```jsx
import HomeExperience from "@/components/HomeExperience";

export default function Home() {
  return <HomeExperience />;
}
```

- [ ] **Step 6: Verify**

Run: `npm run dev`, open http://localhost:3000.
Expected: black page, "GALLERY OF CODE" in Space Grotesk bold, `mode: full` in green mono (on a desktop). No console errors. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/lib/gsap.js src/lib/scrollState.js src/components/SmoothScroll.jsx src/components/HomeExperience.jsx src/app/page.js
git commit -m "feat: scroll infrastructure - lenis, gsap registration, scrollState bridge, page shell"
```

---

### Task 4: Canvas scene with ambient particles

**Files:**
- Create: `src/components/canvas/Scene.jsx`
- Create: `src/components/canvas/Particles.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/canvas/Particles.jsx`**

```jsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const COUNT = 350;

export default function Particles() {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
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
```

- [ ] **Step 2: Create `src/components/canvas/Scene.jsx`**

```jsx
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
```

- [ ] **Step 3: Mount the scene in `HomeExperience.jsx`**

Replace the full file:

```jsx
"use client";

import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/canvas/Scene";

function detectMode() {
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
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(detectMode());
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
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, open http://localhost:3000.
Expected: faint green particle field drifting slowly behind the heading; smooth (lenis-eased) scrolling over the 200vh spacer; no console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/Scene.jsx src/components/canvas/Particles.jsx src/components/HomeExperience.jsx
git commit -m "feat: fixed canvas scene with ambient particle field"
```

---

### Task 5: Nav and Hero

**Files:**
- Create: `src/components/sections/Nav.jsx`
- Create: `src/components/sections/Hero.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/sections/Nav.jsx`**

```jsx
"use client";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="#top" className="font-display text-sm font-bold tracking-widest">
        GALLERY OF CODE<span className="text-accent">_</span>
      </a>
      <div className="hidden font-mono text-xs tracking-wider text-muted md:block">
        ABJ — 9.0765° N, 7.3986° E
      </div>
      <div className="flex gap-6 font-mono text-xs tracking-wider">
        <a href="#projects" className="transition-colors hover:text-accent">PROJECTS</a>
        <a href="#about" className="transition-colors hover:text-accent">ABOUT</a>
        <a href="#contact" className="transition-colors hover:text-accent">CONTACT</a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Hero.jsx`**

```jsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const LINES = ["AT THE", "AVANT-GARDE", "OF FUTURE", "SYSTEMS"];
const TICKER = "TECHNOLOGY ✕ DESIGN ✕ SOCIETY ✕ RESEARCH ✕ ";

export default function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-line", {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.2,
        });
        gsap.from(".hero-meta", { opacity: 0, duration: 1, delay: 1 });
      });
    },
    { scope: ref }
  );

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen flex-col justify-end pb-10">
      <div className="px-6 md:px-10">
        <p className="hero-meta mb-6 max-w-md font-mono text-xs leading-relaxed tracking-wider text-muted">
          MULTI-DISCIPLINARY TECHNOLOGY INNOVATION, RESEARCH &amp; DEVELOPMENT —
          SOLUTIONS AT THE INTERSECTION OF TECHNOLOGY, DESIGN AND SOCIETY.
        </p>
        <h1 className="font-display font-bold leading-[0.92] tracking-tight">
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-line block text-[13vw] md:text-[9.5vw]">
                {line === "SYSTEMS" ? (
                  <>
                    SYSTEMS<span className="text-accent">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>
      </div>
      <div className="mt-10 overflow-hidden border-y border-line py-3">
        <div className="animate-marquee flex w-max whitespace-nowrap font-mono text-xs tracking-[0.3em] text-muted">
          <span>{TICKER.repeat(6)}</span>
          <span>{TICKER.repeat(6)}</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into `HomeExperience.jsx`**

Replace the `<main>` block:

```jsx
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
```

```jsx
      {mode === "full" && <Scene />}
      <Nav />
      <main className="relative z-10">
        <Hero />
        <div className="h-[100vh]" />
      </main>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, open http://localhost:3000.
Expected: fixed nav; huge bold 4-line hero anchored to the bottom of the viewport, lines slide up on load; green period after SYSTEMS; ticker scrolls horizontally between thin rules; particles visible behind. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Nav.jsx src/components/sections/Hero.jsx src/components/HomeExperience.jsx
git commit -m "feat: nav and hero with intro animation and ticker"
```

---

### Task 6: Manifesto sections

**Files:**
- Create: `src/components/sections/Manifesto.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/sections/Manifesto.jsx`**

```jsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const BLOCKS = [
  {
    index: "01",
    heading: "We build what comes next.",
    text: "Gallery of Code is a research and development practice. We take questions that look like science fiction — autonomous infrastructure, post-quantum identity, ambient computing — and engineer them into working systems, years before the market asks for them.",
  },
  {
    index: "02",
    heading: "Technology is culture.",
    text: "Every system we ship reshapes how people move, decide and belong. We design with that weight in mind — studying how a tool lands in a society before we build it, and instrumenting what it changes after.",
  },
  {
    index: "03",
    heading: "Research is practice.",
    text: "We publish our methods, open our datasets and prototype in the open. The lab and the studio are the same room: what we learn in research becomes product discipline, and what breaks in production becomes the next research question.",
  },
];

export default function Manifesto() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".manifesto-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".manifesto-reveal"), {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: block,
              start: "top 70%",
            },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="about" ref={ref} className="relative">
      {BLOCKS.map((block) => (
        <div
          key={block.index}
          className="manifesto-block mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-24 md:px-10"
        >
          <span className="manifesto-reveal mb-6 font-mono text-sm text-accent">
            /{block.index}
          </span>
          <h2 className="manifesto-reveal font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {block.heading}
          </h2>
          <p className="manifesto-reveal mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {block.text}
          </p>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Wire into `HomeExperience.jsx`** — replace the `<div className="h-[100vh]" />` spacer with `<Manifesto />` and add the import:

```jsx
import Manifesto from "@/components/sections/Manifesto";
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, scroll through the page.
Expected: three manifesto blocks, each revealing (slide up + fade) as it enters the viewport; green mono index labels; no layout shift. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Manifesto.jsx src/components/HomeExperience.jsx
git commit -m "feat: manifesto story sections with scroll reveals"
```

---

### Task 7: The 3D project corridor

This is the centerpiece. The DOM side (`ProjectsSection`) owns the ScrollTrigger and writes `scrollState`; the canvas side (`Corridor`/`Panel`) reads it every frame. They never talk through React.

**Files:**
- Create: `src/components/canvas/panelVertex.glsl`
- Create: `src/components/canvas/panelFragment.glsl`
- Create: `src/components/canvas/Panel.jsx`
- Create: `src/components/canvas/Corridor.jsx`
- Create: `src/components/sections/ProjectsSection.jsx`
- Modify: `src/components/canvas/Scene.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/canvas/panelVertex.glsl`**

```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Create `src/components/canvas/panelFragment.glsl`**

```glsl
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
uniform float uHover;
uniform float uFade;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // Slow-breathing diagonal gradient between the project's two colors
  float t = vUv.y * 0.7 + vUv.x * 0.3 + 0.12 * sin(uTime * 0.35 + vUv.x * 4.0);
  vec3 col = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));

  // Fine grid — blueprint / systems feel
  vec2 g = fract(vUv * vec2(18.0, 11.0));
  float line = step(0.965, g.x) + step(0.955, g.y);
  col += line * 0.05;

  // Animated grain
  col += hash(vUv * vec2(412.0, 123.0) + fract(uTime)) * 0.05 - 0.025;

  // Green border glow on hover
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  col = mix(col, vec3(0.0, 1.0, 0.4), uHover * smoothstep(0.05, 0.0, edge) * 0.9);

  gl_FragColor = vec4(col, uFade);
}
```

- [ ] **Step 3: Create `src/components/canvas/Panel.jsx`**

```jsx
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
```

- [ ] **Step 4: Create `src/components/canvas/Corridor.jsx`**

```jsx
"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/data/projects.mjs";
import { scrollState } from "@/lib/scrollState";
import Panel from "./Panel";

const SPACING = 5; // z-distance between panels
const CAMERA_START_Z = 6; // matches Canvas camera position

export default function Corridor() {
  useFrame(({ camera }, delta) => {
    // Dolly the camera through the corridor; rest position when not in section.
    // At progress i/(n-1) the camera sits CAMERA_START_Z in front of panel i
    // (panel i is at z = -i * SPACING), so every panel passes through the same
    // on-screen framing in turn.
    const depth = (projects.length - 1) * SPACING;
    const targetZ = scrollState.corridorActive
      ? CAMERA_START_Z - scrollState.corridor * depth
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
```

- [ ] **Step 5: Add `Corridor` to `src/components/canvas/Scene.jsx`**

```jsx
import Corridor from "@/components/canvas/Corridor";
```

Inside `<Canvas>` after `<Particles />`:

```jsx
        <Corridor />
```

- [ ] **Step 6: Create `src/components/sections/ProjectsSection.jsx` — ScrollTrigger driver + DOM overlay**

```jsx
"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects.mjs";
import { scrollState } from "@/lib/scrollState";

export default function ProjectsSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollState.corridor = self.progress;
          setActive(
            Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1)))
          );
        },
        onToggle: (self) => {
          scrollState.corridorActive = self.isActive;
        },
      });
    },
    { scope: ref }
  );

  const project = projects[active];

  return (
    // pointer-events-none lets hover/click reach the canvas behind this section
    <section
      id="projects"
      ref={ref}
      className="pointer-events-none relative"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between py-24">
        <div className="flex items-baseline justify-between px-6 md:px-10">
          <h2 className="font-display text-sm font-bold tracking-widest text-muted">
            SELECTED WORK <span className="text-accent">2019—2026</span>
          </h2>
          <span className="font-mono text-xs text-muted">SCROLL ↓ / CLICK PANEL TO OPEN</span>
        </div>
        <div className="px-6 text-center md:px-10">
          <div className="font-mono text-sm text-accent">
            {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            <span className="mx-3 text-muted">—</span>
            {project.year}
          </div>
          <div className="font-display mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </div>
          <div className="mt-3 font-mono text-xs tracking-wider text-muted">
            {project.disciplines.join(" / ")}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Wire into `HomeExperience.jsx`** — after `<Manifesto />`:

```jsx
import ProjectsSection from "@/components/sections/ProjectsSection";
```

```jsx
        <Manifesto />
        {mode !== "fallback" && <ProjectsSection />}
```

(The fallback list replaces it in Task 9.)

- [ ] **Step 8: Verify the corridor end-to-end**

Run: `npm run dev`, scroll from hero through the projects section.
Expected:
- Panels are invisible before the section, fade in as it pins.
- Scrolling dollies the camera past 8 gradient panels staggered left/right.
- The bottom-center overlay counts 01/08 → 08/08 with title and year switching in sync with the focused panel.
- Hovering a panel shows a green border glow and pointer cursor; clicking navigates to `/projects/<slug>` (404 for now — route comes in Task 10; the navigation itself proves the wiring).
- Scrolling back up to the manifesto fades panels out and lets the camera return.
Stop the server.

- [ ] **Step 9: Commit**

```bash
git add src/components/canvas/panelVertex.glsl src/components/canvas/panelFragment.glsl src/components/canvas/Panel.jsx src/components/canvas/Corridor.jsx src/components/canvas/Scene.jsx src/components/sections/ProjectsSection.jsx src/components/HomeExperience.jsx
git commit -m "feat: 3d project corridor with scroll-driven camera and dom overlay"
```

---

### Task 8: Capabilities and Footer

**Files:**
- Create: `src/components/sections/Capabilities.jsx`
- Create: `src/components/sections/Footer.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/sections/Capabilities.jsx`**

```jsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAPABILITIES = [
  "Systems Research & Development",
  "Interactive & Spatial Computing",
  "Data Systems & Intelligence",
  "Design Engineering",
  "Emerging Interface R&D",
  "Civic & Cultural Technology",
];

export default function Capabilities() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".capability-row", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-32 md:px-10">
      <h2 className="mb-12 font-mono text-sm tracking-widest text-accent">/CAPABILITIES</h2>
      <ul>
        {CAPABILITIES.map((cap, i) => (
          <li
            key={cap}
            className="capability-row group flex items-baseline justify-between border-b border-line py-6 transition-colors hover:border-accent"
          >
            <span className="font-display text-2xl font-bold tracking-tight md:text-4xl">
              {cap}
            </span>
            <span className="font-mono text-xs text-muted group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Footer.jsx`**

```jsx
"use client";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-28 md:px-10">
        <p className="font-mono text-sm tracking-widest text-accent">/CONTACT</p>
        <a
          href="mailto:hello@galleryofcode.com"
          className="font-display mt-6 block text-4xl font-bold leading-tight tracking-tight transition-colors hover:text-accent md:text-7xl"
        >
          BUILD THE FUTURE
          <br />
          WITH US<span className="text-accent">.</span>
        </a>
        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 font-mono text-xs tracking-wider text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} GALLERY OF CODE — ALL SYSTEMS FUTURE</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com" className="transition-colors hover:text-accent">IG</a>
            <a href="https://www.linkedin.com" className="transition-colors hover:text-accent">LI</a>
            <a href="https://github.com" className="transition-colors hover:text-accent">GH</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire into `HomeExperience.jsx`** — after the projects section:

```jsx
import Capabilities from "@/components/sections/Capabilities";
import Footer from "@/components/sections/Footer";
```

```jsx
        {mode !== "fallback" && <ProjectsSection />}
        <Capabilities />
        <Footer />
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, scroll to the end of the page.
Expected: capabilities rows stagger in, hover turns row border and index green; footer mailto headline enlarges page bottom; year renders correctly. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Capabilities.jsx src/components/sections/Footer.jsx src/components/HomeExperience.jsx
git commit -m "feat: capabilities strip and contact footer"
```

---

### Task 9: Fallback project list (reduced motion / mobile / no WebGL)

**Files:**
- Create: `src/components/sections/ProjectListFallback.jsx`
- Modify: `src/components/HomeExperience.jsx`

- [ ] **Step 1: Create `src/components/sections/ProjectListFallback.jsx`**

```jsx
import Link from "next/link";
import { projects } from "@/data/projects.mjs";

export default function ProjectListFallback() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 className="mb-12 font-mono text-sm tracking-widest text-accent">
        /SELECTED WORK 2019—2026
      </h2>
      <ul className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block border border-line p-6 transition-colors hover:border-accent"
            >
              <div
                className="mb-5 h-40 w-full"
                style={{
                  background: `linear-gradient(120deg, ${project.colors[0]}, ${project.colors[1]})`,
                }}
              />
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold tracking-tight">
                  {project.title}
                </span>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")} — {project.year}
                </span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                {project.summary}
              </p>
              <p className="mt-3 font-mono text-xs tracking-wider text-muted group-hover:text-accent">
                {project.disciplines.join(" / ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Switch between corridor and fallback in `HomeExperience.jsx`**

Replace the full file (final form):

```jsx
"use client";

import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Scene from "@/components/canvas/Scene";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProjectListFallback from "@/components/sections/ProjectListFallback";
import Capabilities from "@/components/sections/Capabilities";
import Footer from "@/components/sections/Footer";

function detectMode() {
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
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(detectMode());
  }, []);

  return (
    <SmoothScroll>
      {mode === "full" && <Scene />}
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        {mode === "full" && <ProjectsSection />}
        {mode === "fallback" && <ProjectListFallback />}
        <Capabilities />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Verify both modes**

Run: `npm run dev`.
- Desktop: corridor renders as before.
- DevTools → toggle device emulation (e.g. iPhone width) → reload: flat gradient-card list renders instead of the corridor; no canvas mounts.
- DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → reload on desktop width: fallback list, no Lenis easing, content all visible without animation.
Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectListFallback.jsx src/components/HomeExperience.jsx
git commit -m "feat: flat project list fallback for reduced-motion, mobile, no-webgl"
```

---

### Task 10: Project detail pages

**Files:**
- Create: `src/app/projects/[slug]/page.js`

- [ ] **Step 1: Create `src/app/projects/[slug]/page.js`**

Note the awaited `params` — required in this Next.js version.

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects.mjs";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Gallery of Code`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-sm font-bold tracking-widest">
          GALLERY OF CODE<span className="text-accent">_</span>
        </Link>
        <Link
          href="/#projects"
          className="font-mono text-xs tracking-wider transition-colors hover:text-accent"
        >
          ← ALL PROJECTS
        </Link>
      </nav>

      <header className="px-6 pt-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-accent">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            <span className="mx-3 text-muted">—</span>
            {project.year}
          </p>
          <h1 className="font-display mt-4 text-5xl font-bold leading-none tracking-tight md:text-8xl">
            {project.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 font-mono text-xs tracking-wider text-muted">
            {project.disciplines.join(" / ")}
          </p>
        </div>
      </header>

      <div
        className="mx-auto mt-14 h-[50vh] max-w-5xl md:h-[65vh]"
        style={{
          background: `linear-gradient(120deg, ${project.colors[0]}, ${project.colors[1]})`,
        }}
      />

      <article className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <p className="text-xl leading-relaxed md:text-2xl">{project.summary}</p>
        <div className="mt-12 flex flex-col gap-8 border-t border-line pt-12">
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <footer className="border-t border-line">
        <Link
          href={`/projects/${next.slug}`}
          className="group mx-auto block max-w-5xl px-6 py-20 md:px-10"
        >
          <p className="font-mono text-xs tracking-widest text-muted">NEXT PROJECT</p>
          <p className="font-display mt-3 text-4xl font-bold tracking-tight transition-colors group-hover:text-accent md:text-6xl">
            {next.title} <span className="text-accent">→</span>
          </p>
        </Link>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Verify routes**

Run: `npm run dev`.
- Open http://localhost:3000/projects/lagos-transit-mesh — full detail page: index/year, huge title, gradient hero block, summary, body paragraphs, next-project link.
- Click NEXT PROJECT — cycles to `aether-grid`; from the last project it wraps to the first.
- Open http://localhost:3000/projects/does-not-exist — 404 page.
- From the home corridor, click a panel — lands on the right detail page.
Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects
git commit -m "feat: server-rendered project detail pages with static params"
```

---

### Task 11: Final verification and polish pass

**Files:** none new — fixes only if verification finds problems.

- [ ] **Step 1: Run the data tests**

Run: `node --test src/data/`
Expected: PASS — 4 tests.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors (fix any that appear before continuing).

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: build succeeds; output lists `/` and 8 prerendered `/projects/[slug]` pages (`● /projects/[slug]` with 8 paths or equivalent static notation).

- [ ] **Step 4: Production smoke test**

Run: `npm run start`, open http://localhost:3000.
Manual checklist:
- Hero intro animation plays; ticker scrolls.
- Manifesto reveals on scroll.
- Corridor: panels fade in, camera dollies, overlay syncs, hover glows, click navigates.
- Capabilities + footer render; mailto link correct.
- Detail pages render statically with correct metadata (view page source → `<title>` contains project name).
- Mobile emulation: fallback list, all content reachable.
Stop the server.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix: final verification polish"
```

(Skip if nothing changed.)
