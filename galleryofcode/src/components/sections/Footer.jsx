"use client";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-28 md:px-10">
        <p className="font-mono text-sm tracking-widest text-primary">/CONTACT</p>
        <a
          href="mailto:hello@galleryofcode.com"
          className="font-heading mt-6 block text-4xl font-bold leading-tight tracking-tight transition-colors hover:text-primary md:text-7xl"
        >
          BUILD THE FUTURE
          <br />
          WITH US<span className="text-primary">.</span>
        </a>
        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 font-mono text-xs tracking-wider text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} GALLERY OF CODE — ALL SYSTEMS FUTURE</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com" className="transition-colors hover:text-primary">IG</a>
            <a href="https://www.linkedin.com" className="transition-colors hover:text-primary">LI</a>
            <a href="https://github.com" className="transition-colors hover:text-primary">GH</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
