import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Lavanya Rathore',
    title: 'Travel & Lifestyle Curator',
    location: 'Gurugram',
    quote: 'They greet you with marigold and rose water, seat you like royalty, and feed you like you are family returning home. The most authentic royal experience I have ever encountered.',
    stars: 5,
  },
  {
    id: 2,
    name: 'Meher Kapoor',
    title: 'Food Writer',
    location: 'New Delhi',
    quote: 'Walking into Ghoomar is like stepping into a living miniature painting. The air is thick with saffron, and every dish arrives as if it were a royal decree.',
    stars: 5,
  },
  {
    id: 3,
    name: 'Arjun Singhania',
    title: 'Entrepreneur',
    location: 'Mumbai',
    quote: 'There is a reverence in how they cook here — every ingredient handled as if it were an heirloom. Ghoomar does not serve food. It serves legacy.',
    stars: 5,
  },
  {
    id: 4,
    name: 'Priya Mathur',
    title: 'Heritage Architect',
    location: 'Jaipur',
    quote: 'The Laal Maas alone justifies an entire journey. This is our cuisine at its most refined, most honest, most royal. A masterful tribute to Rajputana.',
    stars: 5,
  },
  {
    id: 5,
    name: 'Dr. Vikram Nair',
    title: 'Culinary Historian',
    location: 'Bengaluru',
    quote: 'The atmosphere of a 16th-century Rajput haveli combined with service so warm it feels like family. The ghevar is the most faithful interpretation outside Jaipur.',
    stars: 5,
  },
  {
    id: 6,
    name: 'Kabir Shekhawat',
    title: 'Art Director',
    location: 'Udaipur',
    quote: 'The level of detail is staggering. It feels less like a restaurant and more like being invited to a private banquet by the Maharaja himself. Truly extraordinary.',
    stars: 5,
  },
  {
    id: 7,
    name: 'Ananya Desai',
    title: 'Food Critic',
    location: 'Pune',
    quote: 'I have tasted Rajasthani food all over the country, but Ghoomar captures its soul. The Dal Baati Churma is elevated to high art here.',
    stars: 5,
  },
  {
    id: 8,
    name: 'Rohan Bhatia',
    title: 'Photographer',
    location: 'Jodhpur',
    quote: 'Visually stunning and gastronomically brilliant. The ambiance, the music, and the flavors all weave a tapestry of pure luxury.',
    stars: 5,
  },
];

// Fixed alternating card themes — baked-in, never changes
const CARD_THEMES = {
  beige: {
    bg: 'linear-gradient(145deg, #F5E6CF 0%, #EDD9B8 40%, #E8D0A8 100%)',
    innerGlow: 'inset 0 0 50px rgba(212, 170, 100, 0.35), inset 0 0 20px rgba(240, 200, 130, 0.2)',
    outerShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 30px rgba(200, 160, 90, 0.3)',
    border: 'rgba(180, 135, 60, 0.7)',
    ornate: 'rgba(150, 105, 40, 0.6)',
    diamond: '#8B6220',
    textColor: '#3D1A08',
    tagColor: '#7A4A10',
    starColor: '#8B6220',
  },
  pink: {
    bg: 'linear-gradient(145deg, #6B1030 0%, #8E1F3C 40%, #7A1428 100%)',
    innerGlow: 'inset 0 0 50px rgba(180, 60, 90, 0.3), inset 0 0 20px rgba(220, 80, 110, 0.15)',
    outerShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 30px rgba(142, 31, 60, 0.4)',
    border: 'rgba(230, 185, 92, 0.55)',
    ornate: 'rgba(230, 185, 92, 0.3)',
    diamond: '#E6B95C',
    textColor: '#FDFBF7',
    tagColor: '#E6B95C',
    starColor: '#E6B95C',
  },
};

const getTheme = (id) => (id % 2 !== 0 ? CARD_THEMES.beige : CARD_THEMES.pink);

export default function TestimonialsSection() {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const leftRef = useRef(null);
  const stackContainerRef = useRef(null);

  const cardRefs = useRef([]);
  const cardWrapRefs = useRef([]);
  const textRefs = useRef([]);
  const dotRefs = useRef([]);

  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalCards = TESTIMONIALS.length;
      const SCROLL_DIST = 500;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: `+=${SCROLL_DIST}%`,
          scrub: 1.2,
          pin: stickyRef.current,
          pinSpacing: true,
          onUpdate: (self) => {
            const HOLD_DURATION = 1.5;
            const totalDuration = (totalCards - 1) + HOLD_DURATION;
            const currentTime = self.progress * totalDuration;
            setActiveDot(Math.min(totalCards - 1, Math.round(currentTime)));
          },
        },
      });

      const Z_DEPTH = 55;   // z-distance per card in the stack
      const Y_OFFSET = -14; // upward nudge per card in the stack

      TESTIMONIALS.forEach((item, i) => {
        const wrap = cardWrapRefs.current[i];
        const text = textRefs.current[i];
        const theme = getTheme(item.id);

        if (!wrap) return;

        const pos = i;
        const isActive = pos === 0;

        // Set geometry
        gsap.set(wrap, {
          x: 0,
          y: pos * Y_OFFSET,
          z: -pos * Z_DEPTH,
          rotateY: 0,
          rotateZ: 0,
          scale: Math.max(0.72, 1 - pos * 0.1),
          zIndex: totalCards - pos,
        });

        // Active card: full opacity text; inactive: dim
        gsap.set(text, {
          opacity: isActive ? 1 : 0.6,
        });

        // Build step-by-step scrub
        for (let step = 0; step < totalCards - 1; step++) {
          let nextPos = i - (step + 1);
          if (nextPos < 0) nextPos += totalCards;
          const isNextActive = nextPos === 0;

          let prevPos = i - step;
          if (prevPos < 0) prevPos += totalCards;

          if (prevPos === 0 && nextPos === totalCards - 1) {
            // ── Flip-to-back: swing right then tuck deep ──────────────────
            // Phase 1: swing card out to the right, clear all stacked cards
            // Phase 2: fly it far into Z-space and return to x:0 at back of deck
            tl.to(wrap, {
              keyframes: [
                {
                  x: 380,
                  y: -25,
                  z: 80,          // briefly comes FORWARD to clear the stack visually
                  rotateY: -35,
                  rotateZ: 8,
                  scale: 0.85,
                  zIndex: totalCards + 10,
                  duration: 0.45,
                  ease: 'power2.in',
                },
                {
                  x: 0,
                  y: nextPos * Y_OFFSET,
                  z: -nextPos * Z_DEPTH,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: Math.max(0.72, 1 - nextPos * 0.1),
                  zIndex: totalCards - nextPos,
                  duration: 0.55,
                  ease: 'power2.out',
                },
              ],
              ease: 'none',
              duration: 1,
            }, step);

            tl.to(text, { opacity: 0.6, ease: 'none', duration: 0.5 }, step);

          } else {
            // ── Standard advance: slide forward in deck ────────────────────
            tl.to(wrap, {
              x: 0,
              y: nextPos * Y_OFFSET,
              z: -nextPos * Z_DEPTH,
              rotateY: 0,
              rotateZ: 0,
              scale: Math.max(0.72, 1 - nextPos * 0.1),
              zIndex: totalCards - nextPos,
              ease: 'none',
              duration: 1,
            }, step);

            tl.to(text, {
              opacity: isNextActive ? 1 : 0.6,
              ease: 'none',
              duration: 1,
            }, step);
          }
        }
      });

      // Buffer: hold last card for extra scroll
      tl.to({}, { duration: 1.5 });

      // ── Entry fade-in ────────────────────────────────────────────────────
      gsap.fromTo(leftRef.current,
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out',
          scrollTrigger: { trigger: outerRef.current, start: 'top 70%' } }
      );
      gsap.fromTo(stackContainerRef.current,
        { opacity: 0, x: 100, filter: 'blur(20px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 2, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: outerRef.current, start: 'top 70%' } }
      );
    }, outerRef);

    return () => ctx.revert();
  }, []);

  const handleDotClick = (idx) => {
    const st = ScrollTrigger.getAll().find(t => t.pin === stickyRef.current);
    if (st) {
      const progress = idx / (TESTIMONIALS.length - 1);
      const scrollPos = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <section ref={outerRef} id="testimonials" style={{ position: 'relative' }}>
      <div
        ref={stickyRef}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          isolation: 'isolate',
        }}
      >
        {/* Ambient glow background */}
        <div style={{
          position: 'absolute', inset: '-10%', zIndex: -1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(97, 14, 36, 0.12) 0%, transparent 60%)',
        }} />

        <div style={{
          width: '100%', maxWidth: '1600px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '4fr 6fr',
          gap: '6vw', padding: '0 clamp(40px, 8vw, 120px)',
          alignItems: 'center',
        }}>

          {/* ── Left: Poetic Text ── */}
          <div ref={leftRef} style={{ willChange: 'transform, opacity, filter' }}>
            <span className="section-tag" style={{ letterSpacing: '0.5em', display: 'block', marginBottom: 16 }}>
              Royal Resonance
            </span>

            <h2 className="section-title" style={{ fontSize: 'clamp(2.8rem, 4vw, 4.5rem)', marginBottom: 32 }}>
              Where Every Guest<br />
              Becomes <em>Royalty</em>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
              color: 'var(--ivory-dim)', lineHeight: 1.9, fontWeight: 300, maxWidth: '440px',
            }}>
              <em style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2em', color: 'var(--sand)' }}>
                "Padharo Mhare Desh"
              </em>
              <br /><br />
              In Rajasthan, hospitality is a sacred vow. We don't just serve food; we welcome you with honor, warmth, and a heartfelt devotion that transforms a meal into a majestic memory.
            </p>

            {/* Navigation Dots */}
            <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  ref={el => { dotRefs.current[i] = el; }}
                  onClick={() => handleDotClick(i)}
                  style={{
                    width: i === activeDot ? 32 : 8,
                    height: 8,
                    borderRadius: 8,
                    background: i === activeDot ? 'var(--gold)' : 'rgba(230,185,92,0.2)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.4s ease',
                  }}
                  aria-label={`Jump to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: 3D Deck Stack ── */}
          <div
            ref={stackContainerRef}
            style={{
              position: 'relative',
              height: '500px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1200px',
              willChange: 'transform, opacity, filter',
            }}
          >
            {/* Centering anchor */}
            <div style={{ position: 'relative', width: '400px', height: '100%', transformStyle: 'preserve-3d', marginTop: '40px' }}>
              {TESTIMONIALS.map((item, i) => {
                const theme = getTheme(item.id);
                return (
                  <div
                    key={item.id}
                    ref={el => { cardWrapRefs.current[i] = el; }}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: '24px',
                      // Fully opaque alternating card background — baked in, never swapped
                      background: theme.bg,
                      border: `1.5px solid ${theme.border}`,
                      boxShadow: `${theme.outerShadow}, ${theme.innerGlow}`,
                      willChange: 'transform, z-index',
                      transformStyle: 'preserve-3d',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Royal inner ambient gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                      background: item.id % 2 !== 0
                        ? 'radial-gradient(ellipse at 20% 15%, rgba(255, 235, 170, 0.5) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(200, 155, 80, 0.3) 0%, transparent 50%)'
                        : 'radial-gradient(ellipse at 20% 15%, rgba(200, 60, 90, 0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(230, 185, 92, 0.1) 0%, transparent 50%)',
                    }} />

                    {/* Subtle vignette edge blur */}
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                      boxShadow: item.id % 2 !== 0
                        ? 'inset 0 0 60px rgba(120, 80, 20, 0.2), inset 0 0 120px rgba(90, 55, 10, 0.1)'
                        : 'inset 0 0 60px rgba(80, 0, 20, 0.35), inset 0 0 120px rgba(60, 0, 15, 0.2)',
                      borderRadius: '24px',
                    }} />

                    {/* Ornate inner border */}
                    <div style={{
                      position: 'absolute', inset: '12px',
                      border: `1px solid ${theme.ornate}`,
                      borderRadius: '16px',
                      pointerEvents: 'none', zIndex: 2,
                    }}>
                      {/* Corner diamonds */}
                      {[
                        { top: -3, left: -3 },
                        { top: -3, right: -3 },
                        { bottom: -3, left: -3 },
                        { bottom: -3, right: -3 },
                      ].map((pos, di) => (
                        <div key={di} style={{
                          position: 'absolute', ...pos,
                          width: 6, height: 6,
                          background: theme.diamond,
                          transform: 'rotate(45deg)',
                        }} />
                      ))}
                    </div>

                    {/* ── Card Content ── */}
                    <div
                      ref={el => { textRefs.current[i] = el; }}
                      style={{
                        position: 'relative', zIndex: 10,
                        padding: '48px',
                        height: '100%',
                        display: 'flex', flexDirection: 'column',
                        willChange: 'opacity',
                        color: theme.textColor,
                      }}
                    >
                      {/* Stars */}
                      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                        {Array.from({ length: 5 }).map((_, si) => (
                          <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill={theme.starColor}>
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>

                      <p style={{
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                        fontSize: 'clamp(1.05rem, 1.3vw, 1.35rem)',
                        lineHeight: 1.7, flex: 1,
                      }}>
                        "{item.quote}"
                      </p>

                      <div style={{ marginTop: 24 }}>
                        <div style={{
                          fontFamily: 'var(--font-royal)', fontSize: '0.75rem',
                          letterSpacing: '0.15em', textTransform: 'uppercase',
                          fontWeight: 600, marginBottom: 4,
                          color: theme.tagColor,
                        }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                          opacity: 0.7, letterSpacing: '0.05em',
                        }}>
                          {item.title} • {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
