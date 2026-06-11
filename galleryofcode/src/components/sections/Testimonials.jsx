"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const TESTIMONIALS = [
  {
    quote:
      "I depend on GalleryofCode as a business owner for all of my IT service requirements. They set the bar for consistency, professionalism, and attention to detail. It gives me comfort to know that GalleryofCode is working with me to keep my business running properly.",
    name: "Mr Bozimo Isaiah",
    role: "Attorney General, Delta State Government",
  },
];

export default function Testimonials() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".testimonial-reveal", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="testimonials" ref={ref} className="mx-auto max-w-5xl px-6 py-32 md:px-10">
      <p className="testimonial-reveal mb-6 font-mono text-sm tracking-widest text-primary">
        /TESTIMONIALS
      </p>
      <h2 className="testimonial-reveal font-heading max-w-3xl text-4xl leading-tight tracking-tight md:text-6xl">
        What Our Clients And Partners Are Saying
      </h2>
      <p className="testimonial-reveal mt-6 max-w-xl text-muted">
        We are trusted by numerous companies from different businesses to meet their needs.
      </p>
      <div className="mt-16 flex flex-col gap-12">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="testimonial-reveal border-l-2 border-primary pl-8 md:pl-12"
          >
            <blockquote className="max-w-3xl text-xl leading-relaxed md:text-2xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8">
              <div className="font-heading text-lg text-primary">{testimonial.name}</div>
              <div className="mt-1 font-mono text-xs tracking-wider text-muted">
                {testimonial.role}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
