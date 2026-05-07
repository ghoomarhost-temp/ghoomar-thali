import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRUB } from '../animation';

/**
 * FadeInBlock
 * ─────────────────────────────────────────────────────────────────────────────
 * Animates a content block with opacity + translateY + blur on scroll entry.
 * Use for individual elements inside sections (images, text blocks, cards).
 *
 * Props:
 *   delay      — GSAP delay in seconds (default: 0)
 *   fromY      — starting Y translate in px (default: 32)
 *   fromX      — starting X translate in px (default: 0)
 *   blur       — starting blur in px (default: 8)
 *   duration   — animation duration (default: 1.1)
 *   ease       — GSAP ease string (default: 'power3.out')
 *   threshold  — viewport % to trigger at (default: '75%')
 *   style      — additional styles
 *   className  — optional class
 *   children   — content
 */
export default function FadeInBlock({
  delay = 0,
  fromY = 32,
  fromX = 0,
  blur = 8,
  duration = 1.1,
  ease = 'power3.out',
  threshold = '75%',
  style,
  className,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: fromY,
          x: fromX,
          filter: `blur(${blur}px)`,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: ref.current,
            start: `top ${threshold}`,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, fromY, fromX, blur, duration, ease, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform, opacity, filter', ...style }}
    >
      {children}
    </div>
  );
}
