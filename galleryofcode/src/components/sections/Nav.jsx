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
