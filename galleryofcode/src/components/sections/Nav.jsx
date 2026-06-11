"use client";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="#top" className="font-heading text-sm font-bold tracking-widest">
        GALLERY OF CODE<span className="text-primary">_</span>
      </a>
<div className="flex gap-6 font-mono text-xs tracking-wider">
        <a href="#projects" className="transition-colors hover:text-primary">PROJECTS</a>
        <a href="#about" className="transition-colors hover:text-primary">ABOUT</a>
        <a href="#contact" className="transition-colors hover:text-primary">CONTACT</a>
      </div>
    </nav>
  );
}
