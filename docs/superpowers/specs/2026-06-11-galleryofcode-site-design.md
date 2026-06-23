# Gallery of Code — Website Design Spec

**Date:** 2026-06-11
**Status:** Approved (Approach A — canvas-first immersive page)

## Overview

A futuristic marketing site for **Gallery of Code**, a multi-disciplinary technology innovation, research and development company "at the avant-garde of future systems." The site prioritizes storytelling: who the company is, what it builds, and how technology, design and society intersect in its work.

Visual references: bunsenstudio.com, ArtPill (floating-panel 3D gallery). Branding: green and black.

## Architecture (Approach A: canvas-first immersive page)

One fixed full-screen React Three Fiber `<Canvas>` sits behind all DOM content on the home page. The page scrolls natively, smoothed by Lenis. **GSAP ScrollTrigger is the single source of scroll truth**: it drives DOM reveal animations and writes scroll progress into the Three.js scene (camera position through the project corridor). drei `ScrollControls` is NOT used.

- DOM carries all text (hero, manifesto, labels) — crisp, accessible, SEO-friendly.
- The canvas carries the 3D project corridor and ambient background.
- Clicking a project panel routes to its detail page.

### Site structure (Hybrid)

- `/` — immersive story page:
  1. **Hero** — huge bold display text ("AT THE AVANT-GARDE OF FUTURE SYSTEMS" treatment), top nav, small monospace metadata accents.
  2. **Manifesto/Story** — 2–3 scroll-revealed sections narrating the company: technology × design × society.
  3. **Projects corridor** — the 3D gallery/timeline (~8 placeholder projects with year markers). Active project's title/index/year shown as DOM text synced to camera position.
  4. **Capabilities** strip — disciplines/services list.
  5. **Contact/Footer** — mailto link, socials, copyright.
- `/projects/[slug]` — project detail pages: large hero visual, year, discipline tags, description paragraphs, next-project link. Server-rendered.

### Data

All project content lives in a single file `src/data/projects.js` (slug, title, year, disciplines, summary, body, accent color, texture path). Placeholder content: ~8 invented Gallery of Code projects. Swapping in real content later is a one-file change.

## Brand & visual language

- **Palette:** near-black base `#0A0F0A`; off-white text `#EDF2EA`; acid green accent `#00FF66` family; deep muted green for surfaces. Green used sparingly (accents, markers, glows).
- **Type:** bold display grotesque (Space Grotesk or Archivo Expanded via `next/font`) at very large sizes for hero/headings; clean grotesque for body. **No italic body text.** Monospace for indices, years, coordinates.
- **Texture:** subtle grain/scanline overlay, thin 1px rules, generous black space.

## Components

- `app/layout.js` — fonts, metadata, global chrome.
- `app/page.js` — home page composition (server component shell, client sections).
- `app/projects/[slug]/page.js` — project detail route, `generateStaticParams` from data file.
- `components/canvas/Scene.jsx` — fixed Canvas root, ambient background, corridor.
- `components/canvas/Corridor.jsx` — project planes staggered in Z, camera dolly driven by scroll progress, hover tilt/glow, click → route.
- `components/sections/` — Hero, Manifesto, ProjectsOverlay (DOM text synced to corridor), Capabilities, Footer.
- `components/SmoothScroll.jsx` — Lenis + ScrollTrigger integration (client).
- Reuse/extend existing `src/shaders/` for panel and grain effects.

## Tech

- Existing: Next.js 16.2.7, React 19, three, @react-three/fiber, @react-three/drei, Tailwind 4.
- Add: `gsap`, `@gsap/react`, `lenis`.
- **Constraint:** AGENTS.md — this Next.js version has breaking changes; read `node_modules/next/dist/docs/` before writing route/config code.

## Error handling & fallbacks

- `prefers-reduced-motion` and small screens: corridor degrades to a flat scrollable project list using the same data; Lenis disabled under reduced motion.
- WebGL unavailable: render the fallback list (detect via try/catch around canvas mount).
- Placeholder textures are generated locally (styled gradient/shader planes) so no missing-asset states.

## Testing / verification

- `npm run build` passes (static generation of all project pages).
- Manual: scroll-sync between DOM overlay and corridor; hover/click on panels; reduced-motion fallback; mobile layout.

## Out of scope (YAGNI)

CMS integration, i18n (EN/FR), blog/insights section, contact form backend (mailto only), analytics.
