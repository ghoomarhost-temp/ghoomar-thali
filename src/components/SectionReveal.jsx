import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRUB, SECTION_ENTRY } from '../animation';

/**
 * SectionReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps any section with a standardized scroll-scrubbed entry animation.
 * Replaces the old per-component "section-curtain" pattern.
 *
 * Entry: opacity 0→1, translateY 40px→0, blur 12px→0px
 * Scrubbed over the section's approach into the viewport.
 *
 * Props:
 *   as       — HTML tag to render (default: 'section')
 *   id       — section id for anchor links
 *   style    — additional inline styles (MUST NOT include background)
 *   children — section content
 *   className — optional class
 *   skipEntry — set true for sections that handle their own entry (Hero, Menu)
 */
export default function SectionReveal({
  as: Tag = 'section',
  id,
  style,
  className,
  children,
  skipEntry = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (skipEntry) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: SECTION_ENTRY.fromY,
        },
        {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: SECTION_ENTRY.start,
            end:   SECTION_ENTRY.end,
            scrub: SCRUB,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [skipEntry]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        // Sections are transparent — the global background shows through
        background: 'transparent',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
