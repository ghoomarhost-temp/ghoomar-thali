import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRUB_PARALLAX } from '../animation';

/**
 * RoyalBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed, full-viewport background layer. Sits behind ALL page content.
 *
 * Contains:
 *   1. Royal floral SVG pattern with slow scroll parallax
 *   2. Subtle radial ambient glow (maroon-gold warmth)
 *   3. 5 ambient dust motes that drift slowly
 *
 * NO background-color here — that comes from body in index.css.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const FLORAL_SVG = `<svg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <g id='petal'>
      <path d='M 200 170 Q 220 120 200 90 Q 180 120 200 170' fill='none' stroke='%23E6B95C' stroke-width='1.5'/>
    </g>
    <g id='paisley'>
      <path d='M 0 0 C 20 -20 40 0 30 20 C 20 40 -10 30 0 0' fill='none' stroke='%23E6B95C' stroke-width='1.5'/>
      <path d='M 5 2 C 15 -10 25 0 20 12 C 15 20 -2 15 5 2' fill='none' stroke='%23E6B95C' stroke-width='0.8'/>
    </g>
    <g id='diamond'>
      <polygon points='0,-8 8,0 0,8 -8,0' fill='none' stroke='%23E6B95C' stroke-width='1.2'/>
      <circle cx='0' cy='0' r='1.5' fill='%23E6B95C'/>
    </g>
  </defs>
  <g opacity='0.22'>
    <circle cx='200' cy='200' r='80' fill='none' stroke='%23E6B95C' stroke-width='1.5'/>
    <circle cx='200' cy='200' r='90' fill='none' stroke='%23E6B95C' stroke-width='0.8'/>
    <circle cx='200' cy='200' r='22' fill='none' stroke='%23E6B95C' stroke-width='1.5'/>
    <circle cx='200' cy='200' r='8'  fill='%23E6B95C' opacity='0.4'/>
    <use href='%23petal' />
    <use href='%23petal' transform='rotate(45 200 200)' />
    <use href='%23petal' transform='rotate(90 200 200)' />
    <use href='%23petal' transform='rotate(135 200 200)' />
    <use href='%23petal' transform='rotate(180 200 200)' />
    <use href='%23petal' transform='rotate(225 200 200)' />
    <use href='%23petal' transform='rotate(270 200 200)' />
    <use href='%23petal' transform='rotate(315 200 200)' />
    <use href='%23paisley' x='80'  y='80'  transform='rotate(-45 80 80) scale(1.5)' />
    <use href='%23paisley' x='320' y='80'  transform='rotate(45 320 80) scale(1.5)' />
    <use href='%23paisley' x='80'  y='320' transform='rotate(-135 80 320) scale(1.5)' />
    <use href='%23paisley' x='320' y='320' transform='rotate(135 320 320) scale(1.5)' />
    <use href='%23diamond' x='200' y='70'  />
    <use href='%23diamond' x='200' y='330' />
    <use href='%23diamond' x='70'  y='200' />
    <use href='%23diamond' x='330' y='200' />
    <use href='%23diamond' x='108' y='108' />
    <use href='%23diamond' x='292' y='108' />
    <use href='%23diamond' x='108' y='292' />
    <use href='%23diamond' x='292' y='292' />
  </g>
</svg>`;

const encodedSvg = encodeURIComponent(FLORAL_SVG);

// Ambient dust motes — very subtle floating gold particles
const DUST_MOTES = [
  { size: 3, top: '18%', left: '12%', dur: 9,  delay: 0,   opacity: 0.06 },
  { size: 2, top: '45%', left: '82%', dur: 12, delay: 3,   opacity: 0.05 },
  { size: 4, top: '72%', left: '28%', dur: 11, delay: 1.5, opacity: 0.07 },
  { size: 2, top: '30%', left: '60%', dur: 14, delay: 5,   opacity: 0.04 },
  { size: 3, top: '85%', left: '70%', dur: 10, delay: 7,   opacity: 0.06 },
];

export default function RoyalBackground() {
  const patternRef = useRef(null);

  useEffect(() => {
    // Slow parallax scroll on the floral pattern
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SCRUB_PARALLAX,
      animation: gsap.to(patternRef.current, {
        yPercent: -18,
        ease: 'none',
      }),
    });

    // Animate dust motes with slow looping drift
    const moteEls = document.querySelectorAll('.royal-dust-mote');
    moteEls.forEach((el, i) => {
      const mote = DUST_MOTES[i];
      gsap.to(el, {
        y: `-=${24 + i * 8}`,
        x: `+=${(i % 2 === 0 ? 1 : -1) * (10 + i * 4)}`,
        duration: mote.dur,
        delay: mote.delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => st.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        // z-index: 0 — sits behind everything (body bg shows, then this pattern)
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* 1. Royal floral tile pattern with scroll parallax */}
      <div
        ref={patternRef}
        style={{
          position: 'absolute',
          left: 0,
          top: '-10%',
          width: '100%',
          height: '120%',
          opacity: 0.16,
          backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          backgroundPosition: 'center top',
          willChange: 'transform',
        }}
      />

      {/* 2. Warm radial ambient glow — maroon-gold warmth at center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(142,31,60,0.14) 0%, rgba(97,14,36,0.06) 50%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Ambient dust motes — barely visible floating gold specks */}
      {DUST_MOTES.map((mote, i) => (
        <div
          key={i}
          className="royal-dust-mote"
          style={{
            position: 'absolute',
            top: mote.top,
            left: mote.left,
            width: mote.size,
            height: mote.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            opacity: mote.opacity,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
