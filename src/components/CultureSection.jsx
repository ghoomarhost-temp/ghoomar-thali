import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '../utils';
import { CULTURE_SCRUB, CULTURE_PANEL_OVERLAP } from '../animation';

// Parse a string into word-wrapped char spans with staggered delay
// Delay cascades from start so each char blooms in sequence
function parseDescChars(text) {
  const words = text.split(' ');
  let idx = 0;
  return words.map((word, wIdx) => {
    const chars = word.split('').map(char => {
      const delay = idx * 0.009;
      idx++;
      return { char, delay };
    });
    idx++; // space
    return { chars, isLast: wIdx === words.length - 1 };
  });
}

// enterDir controls which side the scene sweeps in from per performance
const activities = [
  {
    id: 'kalbelia', number: '01', tag: 'Folk Dance', title: 'Kalbelia Dance',
    desc: 'The sinuous, hypnotic movements of the Kalbelia — a UNESCO-recognized folk dance of the snake charmers — weave spells of beauty in the firelit courtyard of Ghoomar Thali.',
    image: '/images/kalbelia_dance.png',
    enterDir: 'right',
  },
  {
    id: 'bhopa', number: '02', tag: 'Ritual Music', title: 'Bhopa Bards',
    desc: "The Bhopa priests-musicians narrate epic tales of Rajasthani heroes, accompanied by the haunting Ravanahatha — one of the world's oldest string instruments, played beneath open stars.",
    image: '/images/bhopa_bard.png',
    enterDir: 'left',
  },
  {
    id: 'jadugar', number: '03', tag: 'Mystic Arts', title: 'Jadugar Magic',
    desc: "Witness the ancient art of Indian street magic — Jadugar performances that have dazzled royalty and wanderers across centuries of Rajasthan's storied, mystical history.",
    image: '/images/jadugar_magic.png',
    enterDir: 'right',
  },
  {
    id: 'kathputli', number: '04', tag: 'Puppetry Theatre', title: 'Kathputli Theatre',
    desc: "Centuries-old tales of kings and warriors brought to life by wooden dolls and the virtuosic hands of the Bhatt puppeteers — Rajasthan's oldest living theatrical tradition.",
    image: '/images/kathputli_puppet.png',
    enterDir: 'left',
  },
];

export default function CultureSection() {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panelEls = stickyRef.current.querySelectorAll('.activity-panel');
      const total = activities.length;
      // ── Header bloom + exit ───────────────────────────────────────────────────
      gsap.set(headerRef.current, { opacity: 0, y: 36, filter: 'blur(12px)' });
      gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top 72%',
          end: 'top 18%',
          scrub: CULTURE_SCRUB,
          invalidateOnRefresh: true,
        },
      }).to(headerRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1 });
      // Header fades as last panel scrolls off
      gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: () => `top+=${(total * CULTURE_PANEL_OVERLAP + 0.13) * window.innerHeight} top`,
          end: () => `top+=${(total * CULTURE_PANEL_OVERLAP + 0.45) * window.innerHeight} top`,
          scrub: CULTURE_SCRUB,
          invalidateOnRefresh: true,
        },
      }).to(headerRef.current, { opacity: 0, y: -20, filter: 'blur(10px)', ease: 'power2.in', duration: 1 });

      // ── Pin ───────────────────────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: () => `+=${(total * CULTURE_PANEL_OVERLAP + 0.45) * window.innerHeight}`,
        pin: stickyRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // ── Last-slide exit: translate whole container upward ───────────────────
      // Smoothly slides the pinned container out of view naturally.
      gsap.fromTo(stickyRef.current,
        { y: 0 },
        {
          y: () => -window.innerHeight,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: outerRef.current,
            start: () => `top+=${(total * CULTURE_PANEL_OVERLAP - 0.55) * window.innerHeight} top`,
            end: () => `top+=${(total * CULTURE_PANEL_OVERLAP + 0.45) * window.innerHeight} top`,
            scrub: true,
            invalidateOnRefresh: true,
            onLeave:     () => gsap.set(stickyRef.current, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(stickyRef.current, { autoAlpha: 1 }),
          }
        }
      );

      // ── Per-panel ─────────────────────────────────────────────────────────────
      panelEls.forEach((panel, i) => {
        const bgAtmos = panel.querySelector('.activity-bg');
        const glowEl = panel.querySelector('.activity-glow');
        const numEl = panel.querySelector('.activity-number');
        const imgInner = panel.querySelector('.activity-img-inner');
        const textEl = panel.querySelector('.activity-text');
        const tagEl = panel.querySelector('.activity-tag-el');
        const h3El = panel.querySelector('h3');
        const pEl = panel.querySelector('p');
        // All char spans inside this panel's paragraph
        const pCharSpans = pEl ? Array.from(pEl.querySelectorAll('.activity-char')) : [];

        const { enterDir } = activities[i];
        // Image travels far; text block trails closer behind it
        const imgX = enterDir === 'right' ? 200 : -200;
        const txtX = enterDir === 'right' ? 75 : -75;
        // Text exits opposite to its entry direction
        const exitX = enterDir === 'right' ? -90 : 90;

        const ENTER_FRAC = 0.36;
        const EXIT_FRAC = 0.68;

        // Split words once to avoid recreating nodes and losing opacity
        let words = null;
        if (h3El) {
          words = splitWords(h3El);
        }

        // ── Initial states ────────────────────────────────────────────────────
        if (i === 0) {
          gsap.set(panel, { autoAlpha: 1 });
          gsap.set(bgAtmos, { opacity: 1 });
          gsap.set(glowEl, { opacity: 1 });
          gsap.set(numEl, { opacity: 0.05, x: 0 });
          gsap.set(imgInner, { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, y: 0 });
          // First panel: fire char animation immediately
          requestAnimationFrame(() => pCharSpans.forEach(s => s.classList.add('stroke-play')));
        } else {
          gsap.set(panel, { autoAlpha: 0 });
          gsap.set(bgAtmos, { opacity: 0 });
          gsap.set(glowEl, { opacity: 0 });
          gsap.set(numEl, { opacity: 0, x: imgX * 0.15 });
          gsap.set(imgInner, { opacity: 0, scale: 0.90, filter: 'blur(20px)', x: imgX, y: 20 });
          gsap.set(textEl, { opacity: 0, x: txtX });
          if (tagEl) gsap.set(tagEl, { opacity: 0, y: 14 });
          if (words) gsap.set(words, { yPercent: 110, opacity: 0 });
        }

        // ── Entrance (panels 1+) ──────────────────────────────────────────────
        if (i > 0) {
          const enter = gsap.timeline({
            scrollTrigger: {
              trigger: outerRef.current,
              start: () => `top+=${i * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
              end: () => `top+=${(i + ENTER_FRAC) * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
              scrub: CULTURE_SCRUB,
              invalidateOnRefresh: true,
              onEnter: () => {
                gsap.set(panel, { autoAlpha: 1 });
                // Fire royal char animation when panel fully enters
                pCharSpans.forEach(s => s.classList.remove('stroke-play'));
                requestAnimationFrame(() =>
                  requestAnimationFrame(() =>
                    pCharSpans.forEach(s => s.classList.add('stroke-play'))
                  )
                );
              },
              onLeaveBack: () => {
                gsap.set(panel, { autoAlpha: 0 });
                pCharSpans.forEach(s => s.classList.remove('stroke-play'));
              },
            },
          });

          // Atmosphere blooms first
          enter
            .to(bgAtmos, { opacity: 1, ease: 'power2.out', duration: 0.25 }, 0)
            .to(glowEl, { opacity: 1, ease: 'power2.out', duration: 0.40 }, 0.04)
            .to(numEl, { opacity: 0.05, x: 0, ease: 'expo.out', duration: 0.60 }, 0);

          // Image leads — directional sweep with scale focus-pull
          enter.fromTo(imgInner,
            { opacity: 0, scale: 0.90, filter: 'blur(20px)', x: imgX, y: 20 },
            {
              opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, y: 0,
              ease: 'expo.out', duration: 0.68
            }, 0);

          // Text block trails behind image
          enter.to(textEl, { opacity: 1, x: 0, ease: 'power4.out', duration: 0.62 }, 0.07);

          // Elements cascade up within the text block
          if (tagEl) enter.to(tagEl, { opacity: 1, y: 0, ease: 'expo.out', duration: 0.38 }, 0.20);
          if (words) {
            enter.fromTo(words,
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, stagger: 0.03, ease: 'expo.out', duration: 0.50 }, 0.30);
          }
          // p chars animate via CSS on stroke-play class toggle above — no GSAP fade needed
        }

        // ── Exit (all panels except last) ─────────────────────────────────────
        if (i < total - 1) {
          gsap.timeline({
            scrollTrigger: {
              trigger: outerRef.current,
              start: () => `top+=${(i + EXIT_FRAC) * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
              end: () => `top+=${(i + 1) * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
              scrub: CULTURE_SCRUB,
              invalidateOnRefresh: true,
              onLeave: () => gsap.set(panel, { autoAlpha: 0 }),
              onEnterBack: () => gsap.set(panel, { autoAlpha: 1 }),
            },
          })
            // Image lifts off stage upward
            .to(imgInner, { y: -60, opacity: 0, filter: 'blur(14px)', ease: 'power2.in', duration: 0.50 }, 0)
            // Text sweeps out in the opposite direction of its entry
            .to(textEl, { x: exitX, opacity: 0, ease: 'power2.in', duration: 0.44 }, 0.05)
            .to(bgAtmos, { opacity: 0, ease: 'power2.in', duration: 0.52 }, 0.10)
            .to(glowEl, { opacity: 0, ease: 'power2.in', duration: 0.40 }, 0.00)
            .to(numEl, { opacity: 0, x: exitX * 0.3, ease: 'power2.in', duration: 0.38 }, 0.05);
        }

        // ── Last panel: stays fully visible — section exit handled by container translateY above
        // autoAlpha: 0 initial + onEnter: autoAlpha: 1 is sufficient; no extra set needed

        // ── Parallax depth on performer image ─────────────────────────────────
        gsap.to(imgInner, {
          yPercent: -7, ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: () => `top+=${i * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
            end: () => `top+=${(i + 1) * CULTURE_PANEL_OVERLAP * window.innerHeight} top`,
            scrub: CULTURE_SCRUB * 1.4,
            invalidateOnRefresh: true,
          },
        });
      });

      // ── Progress bar ──────────────────────────────────────────────────────────
      const fill = stickyRef.current.querySelector('.activity-progress-fill');
      if (fill) {
        gsap.to(fill, {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top top',
            end: () => `+=${(total * CULTURE_PANEL_OVERLAP + 0.45) * window.innerHeight}`,
            scrub: CULTURE_SCRUB,
            invalidateOnRefresh: true,
          },
        });
      }
    }, outerRef);
    return () => ctx.revert();
  }, []);

  const total = activities.length;
  // Match outer div height exactly to totalScroll to avoid blank space at section end
  const TOTAL_VH = (total * CULTURE_PANEL_OVERLAP * 100) + 45;

  return (
    <div ref={outerRef} id="culture" style={{ position: 'relative', height: `${TOTAL_VH}vh` }}>
      <div
        ref={stickyRef}
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', zIndex: 10, willChange: 'transform' }}
      >
        {/* Removed Top/bottom edge vignette */}

        {/* ── Section header ──────────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            paddingTop: '120px', textAlign: 'center', zIndex: 30,
            willChange: 'transform, opacity, filter', pointerEvents: 'none',
          }}
        >
          <span className="section-tag" style={{ letterSpacing: '0.5em', marginBottom: 10, display: 'block' }}>
            Our Activities
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
            Cultural <em>Performances</em>
          </h2>
        </div>

        {/* ── Activity panels ─────────────────────────────────────────────────── */}
        {activities.map((act, i) => (
          <div key={act.id} className="activity-panel" style={{ position: 'absolute', inset: 0 }}>

            {/* Warm atmospheric color gradient */}
            <div className="activity-bg float-jellyfish" style={{
              position: 'absolute', inset: '-15%',
              background: 'radial-gradient(ellipse 72% 70% at 70% 52%, rgba(97,14,36,0.65) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 1,
            }} />

            {/* Screen-blend spotlight */}
            <div className="activity-glow float-jellyfish-reverse" style={{
              position: 'absolute', inset: '-15%',
              background: 'radial-gradient(ellipse 50% 55% at 68% 50%, rgba(142,31,60,0.35) 0%, transparent 65%)',
              mixBlendMode: 'screen',
              pointerEvents: 'none', zIndex: 2,
            }} />

            {/* Ghost typographic number — massive decorative backdrop */}
            <div
              className="activity-number"
              style={{
                position: 'absolute', left: '5vw', top: '50%',
                transform: 'translateY(-54%)',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(9rem, 18vw, 17rem)',
                fontWeight: 400, color: 'var(--ivory)',
                lineHeight: 1, opacity: 0.05,
                userSelect: 'none', pointerEvents: 'none',
                zIndex: 3, letterSpacing: '-0.03em',
                willChange: 'transform, opacity',
              }}
            >
              {act.number}
            </div>

            {/* Main content */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              paddingTop: '32vh',
              paddingLeft: '8vw', paddingRight: '6vw', paddingBottom: '4vh',
              gap: '5vw', zIndex: 10,
            }}>

              {/* Text block — slides as a unit, elements cascade within */}
              <div className="activity-text" style={{ flex: '0 0 40%', willChange: 'transform, opacity' }}>
                <span
                  className="activity-tag-el section-tag"
                  style={{ color: 'var(--gold)', display: 'block', marginBottom: 12 }}
                >
                  {act.tag}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
                  fontWeight: 400, fontStyle: 'italic',
                  color: 'var(--ivory)',
                  lineHeight: 1.02, marginBottom: 22, marginTop: 6,
                  overflow: 'hidden', paddingBottom: '0.15em',
                }}>
                  {act.title}
                </h3>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.04rem', lineHeight: 1.88,
                    color: 'var(--ivory-dim)', maxWidth: 360,
                  }}>
                  {parseDescChars(act.desc).map((wordObj, wIdx) => [
                    <span key={`w-${wIdx}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                      {wordObj.chars.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="quote-char activity-char"
                          style={{ animationDelay: `${c.delay}s` }}
                        >
                          {c.char}
                        </span>
                      ))}
                    </span>,
                    !wordObj.isLast && <span key={`s-${wIdx}`}> </span>
                  ])}
                </p>
              </div>

              {/* Performer image */}
              <div style={{
                flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                position: 'relative',
              }}>
                {/* Ambient gold haze behind performer */}
                <div style={{
                  position: 'absolute', width: '80%', height: '85%',
                  background: 'radial-gradient(ellipse at center, rgba(230,185,92,0.07) 0%, transparent 70%)',
                  filter: 'blur(45px)', zIndex: 0,
                }} />
                <div className="activity-img-inner" style={{
                  height: '54vh', width: '100%',
                  position: 'relative', zIndex: 1,
                  willChange: 'transform, opacity, filter',
                }}>
                  <img
                    src={act.image}
                    alt={act.title}
                    style={{
                      height: '100%', width: '100%', objectFit: 'contain',
                      maskImage: 'linear-gradient(to bottom, transparent, black 14%, black 84%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 14%, black 84%, transparent)',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Vertical progress bar */}
        <div style={{
          position: 'absolute', left: 36, top: '24%', bottom: '24%',
          width: 1, background: 'rgba(230,185,92,0.12)', zIndex: 20,
        }}>
          <div
            className="activity-progress-fill"
            style={{
              width: '100%', height: '100%',
              background: 'var(--gold)',
              transformOrigin: 'top', transform: 'scaleY(0)',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </div>
  );
}
