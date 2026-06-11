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
