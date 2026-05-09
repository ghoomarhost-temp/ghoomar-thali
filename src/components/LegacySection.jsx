import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRUB } from '../animation';

const PEEK_H     = 64;   // visible strip of a buried card
const CARD_GAP   = 14;   // breathing gap between stacked peek strips
const NUM_CARDS  = 4;
const TOTAL_SEGS = 6;    // 1 title + 4 card enters + 1 buffer/slide-out

const CARDS = [
  {
    numeral: 'I',
    tag: 'Ghoomar Traditional Thali',
    title: 'The Infinite Thali',
    sub: 'Unlimited · Pure Vegetarian · Rajasthani',
    body: 'Unlimited pure-vegetarian Rajasthani thali, crafted with ancestral recipes and the warmth of royal kitchens — served across three proud cities.',
    detail: 'Delhi  ·  Patna  ·  Guwahati',
    image: '/images/legacy_thali.png',
    accentColor: '#E6B95C',
    coming: false,
  },
  {
    numeral: 'II',
    tag: 'Ghoomar Village',
    title: 'A Living Kingdom',
    sub: '25,000 sq. ft. of Rajasthani Soul',
    body: 'An entire world of unlimited food, vibrant folk performances and family celebration — curated as a complete royal cultural immersion.',
    detail: 'Gurugram',
    image: '/images/legacy_village.png',
    accentColor: '#C2765A',
    coming: false,
  },
  {
    numeral: 'III',
    tag: 'Vedanta by Ghoomar',
    title: 'Refined Sanctum',
    sub: 'Pure Veg Fine Dining · Varanasi',
    body: "Multicuisine culinary artistry in the eternal city, where every plate carries the soulful precision of Ghoomar's royal heritage.",
    detail: 'Varanasi',
    image: '/images/legacy_vedanta.png',
    accentColor: '#D4BFA9',
    coming: false,
  },
  {
    numeral: 'IV',
    tag: 'Ghoomar Yatra',
    title: 'The Sacred Journey',
    sub: 'Rajasthani Travel & Pilgrimage',
    body: 'Curated travel and pilgrimage experiences where every mile is steeped in royal lore, ancient devotion, and the spirit of discovery.',
    detail: 'India & Beyond',
    image: '/images/legacy_yatra.png',
    accentColor: '#E6B95C',
    coming: true,
  },
];

// Royal Corner Brackets — pure SVG, no DOM cost
function CornerBrackets({ color }) {
  const len = 28, th = 1;
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="20" width={len} height={th} fill={color} />
      <rect x="20" y="20" width={th} height={len} fill={color} />
      <rect x={`calc(100% - ${20 + len}px)`} y="20" width={len} height={th} fill={color} />
      <rect x={`calc(100% - 21px)`} y="20" width={th} height={len} fill={color} />
      <rect x="20" y={`calc(100% - 21px)`} width={len} height={th} fill={color} />
      <rect x="20" y={`calc(100% - ${20 + len}px)`} width={th} height={len} fill={color} />
      <rect x={`calc(100% - ${20 + len}px)`} y={`calc(100% - 21px)`} width={len} height={th} fill={color} />
      <rect x={`calc(100% - 21px)`} y={`calc(100% - ${20 + len}px)`} width={th} height={len} fill={color} />
    </svg>
  );
}

export default function LegacySection() {
  const outerRef     = useRef(null);
  const containerRef = useRef(null);
  const titleRef     = useRef(null);
  const closingRef   = useRef(null);
  const cardRefs     = useRef([]);

  const [headerH, setHeaderH] = useState(180);

  useEffect(() => {
    const updateHeaderH = () => {
      if (!titleRef.current) return;
      // Get exact height of the title container naturally sizing itself, plus exact 5px gap
      const calcH = titleRef.current.getBoundingClientRect().height + 5;
      if (Math.abs(headerH - calcH) > 1) {
        setHeaderH(calcH);
      }
    };
    updateHeaderH();
    window.addEventListener('resize', updateHeaderH);
    return () => window.removeEventListener('resize', updateHeaderH);
  }, [headerH]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const HEADER_H = headerH;
      const outer  = outerRef.current;
      const vh     = window.innerHeight;

      // Full height a card occupies (from HEADER_H baseline to bottom of viewport)
      const cardH = vh - HEADER_H;

      // ── Compute the "upshift" amount needed when card[i] is fully revealed ──
      // Card[i] natural top = HEADER_H + i*(PEEK_H + CARD_GAP)
      // Card[i] natural bottom = naturalTop + cardH
      // If bottom > vh → we must shift the container up by (bottom - vh)
      const containerYForCard = (i) => {
        const naturalTop    = HEADER_H + i * (PEEK_H + CARD_GAP);
        const naturalBottom = naturalTop + cardH;
        return -Math.max(0, naturalBottom - vh);
      };

      // ── Master Pin ──────────────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger:       outer,
        start:         'top top',
        end:           () => `+=${TOTAL_SEGS * window.innerHeight}`,
        pin:           containerRef.current,
        anticipatePin: 1,
        pinSpacing:    false,
        invalidateOnRefresh: true,
      });

      // ── Title bloom ─────────────────────────────────────────────────────────
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
      gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start:   'top 65%',
          end:     () => `top+=${0.65 * window.innerHeight} top`,
          scrub:   SCRUB,
          invalidateOnRefresh: true,
        },
      }).to(titleRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 1 });

      // ── Promise Text Bloom (closingRef) ─────────────────────────────────────
      gsap.set(closingRef.current, { opacity: 0, y: 30 });
      gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start:   'top top',
          end:     () => `+=${0.8 * window.innerHeight}`,
          scrub:   SCRUB,
          invalidateOnRefresh: true,
        },
      }).to(closingRef.current, { opacity: 1, y: 0, ease: 'power3.out', duration: 1 });

      // ── Cards: initial state — all off-screen below ──────────────────────────
      const cards = cardRefs.current.filter(Boolean);

      // Scale for a card buried at `depth` levels below the top active card
      const depthScale = (depth) => Math.max(0.91, 1 - depth * 0.03);

      // Container starts at y:0 (no shift)
      gsap.set(containerRef.current, { y: 0 });

      cards.forEach((card, i) => {
        // Start each card below the viewport
        gsap.set(card, { y: cardH + 80, scale: 1, transformOrigin: 'top center' });

        // ── Target container Y for this card's reveal ─────────────────────────
        const prevContainerY = i === 0 ? 0 : containerYForCard(i - 1);
        const nextContainerY = containerYForCard(i);

        // Helper: snap all cards' scales to the resting state AFTER card[i] is revealed
        const snapScalesToCardI = (revealedUpTo) => {
          for (let j = 0; j <= revealedUpTo; j++) {
            const depth = revealedUpTo - j;
            gsap.set(cards[j], { scale: depthScale(depth) });
          }
        };

        gsap.timeline({
          scrollTrigger: {
            trigger: outer,
            start:   () => `top+=${(1 + i) * window.innerHeight} top`,
            end:     () => `top+=${(2 + i) * window.innerHeight} top`,
            scrub:   SCRUB,
            invalidateOnRefresh: true,
            // ── Boundary snaps prevent stale transforms on fast reverse scroll ──
            // When this segment is fully entered (forward), snap to its end state.
            onLeave() {
              gsap.set(containerRef.current, { y: nextContainerY });
              snapScalesToCardI(i);
            },
            // When reverse-scrolling back into this segment from below,
            // snap to the end state so GSAP can scrub backward correctly.
            onEnterBack() {
              gsap.set(containerRef.current, { y: nextContainerY });
              snapScalesToCardI(i);
            },
            // When reverse-scrolling OUT of this segment (back to start),
            // snap container to the prev resting y and restore card scales.
            onLeaveBack() {
              gsap.set(containerRef.current, { y: prevContainerY });
              // Cards j<i should be at their depth from the previous segment
              for (let j = 0; j < i; j++) {
                const depth = (i - 1) - j;
                gsap.set(cards[j], { scale: depthScale(depth) });
              }
              // Card i itself should be fully off-screen below again
              gsap.set(card, { y: cardH + 80 });
            },
            onUpdate(self) {
              const p = self.progress;

              // ── Progressive container upshift ───────────────────────────────
              gsap.set(containerRef.current, {
                y: prevContainerY + (nextContainerY - prevContainerY) * p,
              });

              // ── Update depth scale of all already-revealed cards ────────────
              for (let j = 0; j < i; j++) {
                const depthNow  = i - j;
                const scaleTo   = depthScale(depthNow);
                const scaleFrom = depthScale(depthNow - 1);
                gsap.set(cards[j], { scale: scaleFrom + (scaleTo - scaleFrom) * p });
              }
            },
          },
        })
          // Card rises from below into its resting position
          .fromTo(card,
            { y: cardH + 80 },
            { y: 0, ease: 'power2.out', duration: 1 }
          );
      });

      // ── Container slides out when section below enters ───────────────────────
      const finalContainerY = containerYForCard(NUM_CARDS - 1);

      gsap.fromTo(containerRef.current,
        { y: finalContainerY },
        {
          y: () => finalContainerY - window.innerHeight,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: outer,
            start:   () => `top+=${(TOTAL_SEGS - 1) * window.innerHeight} top`,
            end:     () => `top+=${TOTAL_SEGS * window.innerHeight} top`,
            scrub:   true,
            invalidateOnRefresh: true,
            onLeave:     () => gsap.set(containerRef.current, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(containerRef.current, { autoAlpha: 1 }),
          }
        }
      );

    }, outerRef);
    return () => ctx.revert();
  }, [headerH]);

  return (
    <div
      ref={outerRef}
      id="legacy"
      style={{ position: 'relative', height: `${TOTAL_SEGS * 100}vh` }}
    >
      {/* ── Pinned viewport container ─────────────────────────────────────── */}
      {/* NO perspective here — it forces expensive stacking contexts on all children */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '100vh',
          // overflow: visible — cards must be able to travel below this boundary
          // as they animate up from off-screen. The browser viewport clips naturally.
          overflow: 'visible',
          zIndex: 20,
          willChange: 'transform',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(142,31,60,0.14) 0%, transparent 65%)',
        }} />

        {/* Top edge feather — softens the entry without creating a hard black bar */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(26,10,19,0.9) 0%, rgba(26,10,19,0.45) 6%, rgba(26,10,19,0.1) 13%, transparent 22%)',
        }} />

        {/* ── Section Title ─────────────────────────────────────────────────── */}
        <div
          ref={titleRef}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            paddingTop: '80px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            textAlign: 'center', zIndex: 20,
            willChange: 'opacity, transform',
          }}
        >
          <span className="section-tag" style={{ letterSpacing: '0.55em', marginBottom: 10 }}>
            The Ghoomar Empire
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
            fontWeight: 300, fontStyle: 'italic', color: 'var(--ivory)',
            lineHeight: 1.1,
          }}>
            One Legacy. Four <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Royal</em> Experiences.
          </h2>
        </div>

        {/* ── Stacked Cards ─────────────────────────────────────────────────── */}
        {CARDS.map((card, i) => (
          <div
            key={card.numeral}
            ref={el => { cardRefs.current[i] = el; }}
            className="legacy-card"
            style={{
              position: 'absolute',
              top: headerH + i * (PEEK_H + CARD_GAP),
              left: '4vw',
              right: '4vw',
              // Fixed height = same as card 0 → all cards identical size
              height: `calc(100vh - ${headerH}px)`,
              borderRadius: 18,
              overflow: 'hidden',
              zIndex: 10 + i,
              transformOrigin: 'top center',
              willChange: 'transform',
              boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 -1px 0 rgba(230,185,92,0.22), inset 0 0 0 1px rgba(230,185,92,0.08)',
              background: 'rgba(26, 10, 19, 0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* No full card background image, only frosted glass */}

            {/* Gold peek-strip vignette */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: PEEK_H,
              background: 'linear-gradient(to bottom, rgba(230,185,92,0.07), transparent)',
              borderTop: '1px solid rgba(230,185,92,0.28)',
              zIndex: 3,
            }} />

            <CornerBrackets color={`${card.accentColor}77`} />

            {/* ── Peek strip ───────────────────────────────────────────────────── */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: PEEK_H,
              display: 'flex', alignItems: 'center',
              padding: '0 32px', justifyContent: 'flex-end',
              zIndex: 5,
            }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                letterSpacing: '0.22em', color: 'rgba(212,191,169,0.65)',
                textTransform: 'uppercase',
              }}>
                {card.coming ? 'Coming Soon' : card.detail}
              </span>
            </div>

            {/* ── Card Body ────────────────────────────────────────────────────── */}
            <div style={{
              position: 'absolute',
              top: PEEK_H + 12,
              left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'stretch',
              zIndex: 4,
            }}>
              {/* Left: Text */}
              <div style={{
                flex: '0 0 48%',
                padding: 'clamp(28px,4vh,52px) clamp(28px,4vw,60px)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                borderRight: '1px solid rgba(230,185,92,0.10)',
                position: 'relative',
              }}>
                <span style={{
                  fontFamily: 'var(--font-royal)', fontSize: '0.6rem',
                  letterSpacing: '0.45em', color: card.accentColor,
                  textTransform: 'uppercase', display: 'block', marginBottom: 18,
                }}>
                  {card.title}
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)',
                  fontWeight: 300, fontStyle: 'italic', color: 'var(--ivory)',
                  lineHeight: 1.1, marginBottom: 20,
                }}>
                  {card.tag}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${card.accentColor}, transparent)` }} />
                  <div style={{ width: 5, height: 5, border: `1px solid ${card.accentColor}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'rgba(212,191,169,0.8)', fontStyle: 'italic' }}>
                    {card.sub}
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.82rem, 1.1vw, 1rem)',
                  lineHeight: 1.85, color: 'var(--ivory-dim)',
                  fontWeight: 300, maxWidth: 420, marginBottom: 32,
                }}>
                  {card.body}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  paddingTop: 20,
                  borderTop: '1px solid rgba(230,185,92,0.15)',
                }}>
                  {card.coming ? (
                    <span style={{
                      fontFamily: 'var(--font-royal)', fontSize: '0.6rem',
                      letterSpacing: '0.38em', color: card.accentColor,
                      textTransform: 'uppercase',
                      border: `1px solid ${card.accentColor}50`,
                      padding: '5px 14px',
                    }}>
                      Coming Soon
                    </span>
                  ) : (
                    <>
                      <span style={{
                        fontFamily: 'var(--font-royal)', fontSize: '0.55rem',
                        letterSpacing: '0.28em', color: 'rgba(212,191,169,0.55)',
                        textTransform: 'uppercase',
                      }}>
                        Experience at
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1rem',
                        fontStyle: 'italic', color: card.accentColor,
                      }}>
                        {card.detail}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Image panel */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: card.coming ? 'brightness(0.45) saturate(0.35)' : 'brightness(0.72) saturate(0.85)',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }} />
                {/* No left blend gradient, keeping a sharp border */}
                {/* Ghost numeral */}
                <div style={{
                  position: 'absolute',
                  bottom: 'clamp(20px,4vh,48px)',
                  right: 'clamp(20px,3vw,48px)',
                  fontFamily: 'var(--font-royal)',
                  fontSize: 'clamp(6rem, 14vw, 13rem)',
                  color: `${card.accentColor}16`,
                  lineHeight: 1,
                  userSelect: 'none', pointerEvents: 'none',
                  letterSpacing: '-0.04em',
                }}>
                  {card.numeral}
                </div>
                {/* Coming Soon badge */}
                {card.coming && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-12deg)',
                    border: `1px solid ${card.accentColor}`,
                    padding: '10px 30px', textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-royal)', fontSize: '0.65rem',
                      letterSpacing: '0.4em', color: card.accentColor,
                      textTransform: 'uppercase',
                    }}>
                      Coming Soon
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Closing Note ──────────────────────────────────────────────────── */}
        <div
          ref={closingRef}
          style={{
            position: 'absolute', top: `calc(${headerH}px + 4vh)`, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 5, pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 680, padding: '0 40px' }}>
            {/* 26px spacer to maintain the exact gap where the "The Ghoomar Promise" tag used to be */}
            <div style={{ height: 26 }} />
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)',
              fontWeight: 300, fontStyle: 'italic',
              lineHeight: 1.45, color: 'var(--ivory)', marginBottom: 32,
            }}>
              "Every experience bears the same royal soul —{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>
                the spirit of Rajputana hospitality
              </em>
              , passed from generation to generation."
            </p>
            <div className="ornament-line" style={{ marginBottom: 28, justifyContent: 'center' }}>
              <div className="diamond" />
            </div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem',
              fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400,
            }}>
              — Padma Shri Bhawani Singh Rathore, Founder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
