import Link from "next/link";
import { projects } from "@/data/projects.mjs";

export default function ProjectListFallback() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 className="mb-12 font-mono text-sm tracking-widest text-primary">
        SELECTED WORK 2019—2026
      </h2>
      <h1 className="mb-16 font-heading text-4xl leading-tight tracking-tight md:text-6xl">
        PROJECTS
      </h1>
      <ul className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block border border-line p-6 transition-colors hover:border-primary"
            >
              <div
                className="mb-5 h-40 w-full"
                style={{
                  background: `linear-gradient(120deg, ${project.colors[0]}, ${project.colors[1]})`,
                }}
              />
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-2xl font-bold tracking-tight">
                  {project.title}
                </span>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")} — {project.year}
                </span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                {project.summary}
              </p>
              <p className="mt-3 font-mono text-xs tracking-wider text-muted group-hover:text-primary">
                {project.disciplines.join(" / ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
