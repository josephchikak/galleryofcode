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
