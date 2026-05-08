import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── All durations are abstract scroll units ────────────────────────────────
const S1_DUR = 1.0;   // Stage 1: title in (absorbed into pre-entry)
const S2_DUR = 1.4;   // Stage 2: card rises
const S3_DUR = 1.6;   // Stage 3: card flips
const HOLD   = 2.0;   // Hold at end (persist final state)
const TOTAL_DUR = S1_DUR + S2_DUR + S3_DUR + HOLD; // 6.0 units
const TOTAL_VH  = TOTAL_DUR * 0.75;

export default function ReserveSection() {
  const outerRef     = useRef(null);
  const stickyRef    = useRef(null);
  const titleRef     = useRef(null);
  const cardWrapRef  = useRef(null);
  const cardFrontRef = useRef(null);
  const cardBackRef  = useRef(null);

  // Deferred refresh: LocationSection's SVG loads async and its pinSpacing
  // spacer changes the document height. We must re-calculate after it settles.
  useEffect(() => {
    const t1 = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 400);
    const t2 = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 900);
    const t3 = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const vh = window.innerHeight;
      const scrollDistance = TOTAL_VH * vh;

      // ── INITIAL STATES ──────────────────────────────────────────────────────
      // All visual elements start at opacity:0. The section is "visible" in
      // DOM terms but renders as empty (transparent background → falls through
      // to the global RoyalBackground). No autoAlpha gating needed.
      gsap.set(titleRef.current, { opacity: 0, y: 100 });
      gsap.set(cardWrapRef.current, { opacity: 0, y: '50vh' });
      gsap.set(cardFrontRef.current, { rotationY: 0 });
      gsap.set(cardBackRef.current, { rotationY: -180 });

      // ── PRE-ENTRY: Title fades in as section approaches viewport ───────────
      // This is a standalone scrubbed trigger that starts at 'top 70%' — well
      // after LocationSection's pin has released and the section is naturally
      // scrolling into view. It bridges the gap between sections by showing
      // the title during the scroll-up.
      //
      // SAFE from overlap because:
      // 1. LocationSection uses pinSpacing:true, which pushes this section
      //    far below in the document flow
      // 2. This trigger starts at 'top 70%' which fires when the section's
      //    top edge is at 70% of the viewport — physically impossible while
      //    LocationSection is still pinned (the section would need to have
      //    scrolled past the entire pinSpacing spacer first)
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1, y: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top bottom',   // fires the moment section enters viewport
            end: 'top top',
            scrub: 0.5,
          }
        }
      );

      // ── MASTER TIMELINE (Scrubbed, Pinned) ──────────────────────────────────
      // Single ScrollTrigger with pin:true and pinSpacing:true. GSAP adds the
      // spacer div automatically to maintain proper document flow.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── Stage 2: Card rises from bottom ─────────────────────────────────────
      tl.fromTo(cardWrapRef.current,
        { opacity: 0, y: '50vh' },
        { opacity: 1, y: 0, duration: S2_DUR, ease: 'power2.out' }
      );

      // Title stays rock solid in its resting position as the card rises up behind it.

      // ── Stage 3: Horizontal flip ────────────────────────────────────────────
      tl.add('flip', '+=0.2');

      tl.to(titleRef.current, {
        rotationY: 180, duration: S3_DUR, ease: 'power2.inOut'
      }, 'flip');

      tl.to(cardFrontRef.current, {
        rotationY: 180, duration: S3_DUR, ease: 'power2.inOut'
      }, 'flip');
      
      tl.to(cardBackRef.current, {
        rotationY: 0, duration: S3_DUR, ease: 'power2.inOut'
      }, 'flip');

    }, outerRef);

    return () => ctx.revert();
  }, []);

  // ── Shared card face style ────────────────────────────────────────────────
  const face = {
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    background: `
      /* Luminous maroon blooms */
      radial-gradient(circle at 18% 22%, rgba(150, 20, 50, 0.35) 0%, rgba(150, 20, 50, 0.1) 25%, transparent 45%),
      radial-gradient(circle at 82% 78%, rgba(130, 15, 45, 0.3) 0%, rgba(130, 15, 45, 0.1) 25%, transparent 50%),
      /* Vibrant jewel pink blooms */
      radial-gradient(circle at 85% 25%, rgba(240, 40, 110, 0.4) 0%, rgba(240, 40, 110, 0.15) 25%, transparent 50%),
      radial-gradient(circle at 25% 85%, rgba(210, 25, 90, 0.35) 0%, rgba(210, 25, 90, 0.1) 25%, transparent 50%),
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 60, 130, 0.2) 0%, transparent 55%),
      /* Deep wine grounding elements */
      radial-gradient(ellipse 50% 60% at 95% 95%, rgba(100, 10, 40, 0.5) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 5% 95%, rgba(80, 5, 30, 0.5) 0%, transparent 60%),
      /* Translucent dark base */
      rgba(22, 8, 14, 0.55)
    `,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(230, 185, 92, 0.4)',
    boxShadow: 'inset 0 0 60px rgba(230, 185, 92, 0.05), inset 0 0 20px rgba(130, 30, 60, 0.15), 0 40px 80px rgba(0,0,0,0.7)',
    borderRadius: 8,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px',
    willChange: 'transform',
  };

  const RoyalCorner = ({ pos }) => {
    const isTop = pos.startsWith('t');
    const isLeft = pos.endsWith('l');
    return (
      <div style={{
        position: 'absolute',
        top: isTop ? 24 : 'auto', bottom: !isTop ? 24 : 'auto',
        left: isLeft ? 24 : 'auto', right: !isLeft ? 24 : 'auto',
        width: 50, height: 50,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: isTop ? 'flex-start' : 'flex-end',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }}>
        <div style={{
          position: 'absolute',
          width: '100%', height: 1,
          background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, rgba(230,185,92,0.6), transparent)`,
          [isTop ? 'top' : 'bottom']: 0,
        }} />
        <div style={{
          position: 'absolute',
          height: '100%', width: 1,
          background: `linear-gradient(to ${isTop ? 'bottom' : 'top'}, rgba(230,185,92,0.6), transparent)`,
          [isLeft ? 'left' : 'right']: 0,
        }} />
        <div style={{
          position: 'absolute',
          width: 4, height: 4,
          background: 'var(--gold)',
          [isTop ? 'top' : 'bottom']: -1.5,
          [isLeft ? 'left' : 'right']: -1.5,
          transform: 'rotate(45deg)',
          boxShadow: '0 0 8px rgba(230,185,92,0.8)'
        }} />
      </div>
    );
  };

  return (
    <div 
      ref={outerRef} 
      id="reserve" 
      style={{ 
        position: 'relative',
        height: '100vh',
        marginBottom: '15vh',
        zIndex: 2,
        isolation: 'isolate',
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          paddingTop: '6vh',
          overflow: 'hidden',
          perspective: '1800px',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: '-20%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(142,31,60,0.18) 0%, transparent 70%)',
        }} />

        {/* Stage 1 — Title (Absolute so it floats and fits perfectly into the card) */}
        <div ref={titleRef} style={{ 
          position: 'absolute', top: '22vh', left: 0, right: 0,
          textAlign: 'center', zIndex: 20, pointerEvents: 'none',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}>
          <span className="section-tag" style={{ letterSpacing: '0.5em', display: 'block', marginBottom: 14 }}>
            Your Invitation
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(2.8rem, 5vw, 4.4rem)',
            color: 'var(--ivory)', lineHeight: 1.08,
          }}>
            Reserve Your{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Royal Experience</em>
          </h2>
        </div>

        {/* Stages 2 & 3 — Card (Scaled down ~7% and shifted downwards) */}
        <div
          ref={cardWrapRef}
          style={{
            position: 'relative',
            width: '79vw', height: '79vh', maxWidth: 1300, zIndex: 10,
            marginTop: '4vh',
            willChange: 'transform, opacity',
            perspective: '1800px',
          }}
        >
          {/* Front face */}
            <div ref={cardFrontRef} style={{ ...face, paddingTop: '28vh' }}>
              {['tl','tr','bl','br'].map(p => <RoyalCorner key={p} pos={p} />)}
              
              
                            
              <h3 style={{
                fontFamily: 'var(--font-serif)', fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                color: 'var(--ivory)', lineHeight: 1.25, textAlign: 'center', maxWidth: 700, marginBottom: 16,
              }}>
                Every meal is a <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Ceremony</em>.<br />
                Yours begins here.
              </h3>
              
              <p style={{ 
                fontFamily: 'var(--font-body)', color: 'var(--ivory-dim)', fontSize: '1rem', 
                lineHeight: 1.8, textAlign: 'center', maxWidth: 460, marginBottom: 0,
                letterSpacing: '0.02em'
              }}>
                We have hosted dignitaries, dreamers, and kings. Scroll down to secure your place at our table.
              </p>

              {/* Ornate line at end of content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, opacity: 0.7 }}>
                <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
                <div style={{ width: 6, height: 6, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
                <div style={{ width: 80, height: 1, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
              </div>
            </div>

            {/* Back face */}
            <div ref={cardBackRef} style={{ ...face, justifyContent: 'center', padding: '60px 8vw' }}>
              {['tl','tr','bl','br'].map(p => <RoyalCorner key={p} pos={p} />)}
              
              <div style={{ textAlign: 'center', marginBottom: 50, width: '100%' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.5em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
                  Secure Your Table
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', color: 'var(--ivory)', lineHeight: 1.2 }}>
                  Make a <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Reservation</em>
                </h3>
                <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '24px auto 0', opacity: 0.5 }} />
              </div>

              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px 56px', width: '100%', maxWidth: 840 }} onSubmit={e => e.preventDefault()}>
                
                <div className="royal-field">
                  <label className="royal-label">Location</label>
                  <div className="royal-select-wrapper">
                    <select className="royal-input">
                      <option>Jaipur (The Original)</option>
                      <option>New Delhi (CP)</option>
                      <option>Mumbai (Bandra)</option>
                      <option>Bangalore (Indiranagar)</option>
                    </select>
                  </div>
                </div>

                <div className="royal-field">
                  <label className="royal-label">Guests</label>
                  <div className="royal-select-wrapper">
                    <select className="royal-input">
                      <option>1 Royal Guest</option>
                      <option>2 Royal Guests</option>
                      <option>4 Royal Guests</option>
                      <option>6+ Royal Guests (Banquet)</option>
                    </select>
                  </div>
                </div>

                <div className="royal-field">
                  <label className="royal-label">Date</label>
                  <input type="date" className="royal-input" />
                </div>

                <div className="royal-field">
                  <label className="royal-label">Time</label>
                  <div className="royal-select-wrapper">
                    <select className="royal-input">
                      <option>7:00 PM (Folk Music)</option>
                      <option>8:00 PM (Main Performance)</option>
                      <option>9:00 PM (Late Dinner)</option>
                    </select>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 32 }}>
                  <button type="button" className="btn-royal" style={{ width: '100%', maxWidth: 300, justifyContent: 'center', padding: '16px' }}>
                    <span style={{ letterSpacing: '0.2em', fontSize: '0.8rem' }}>Confirm Reservation</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>

      {/* Inject custom styles for the royal reservation form */}
      <style>{`
        .royal-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .royal-label {
          font-family: var(--font-body);
          font-size: 0.65rem;
          color: rgba(230, 185, 92, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.25em;
        }
        .royal-input {
          width: 100%;
          background: rgba(26, 10, 19, 0.4);
          border: 1px solid rgba(230, 185, 92, 0.2);
          border-radius: 4px;
          color: var(--ivory);
          font-family: var(--font-body);
          font-size: 1.05rem;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
        }
        .royal-input:focus {
          border-color: rgba(230, 185, 92, 0.6);
          background: rgba(26, 10, 19, 0.7);
        }
        .royal-input option {
          background: #1a0a13;
          color: var(--ivory);
        }
        .royal-select-wrapper {
          position: relative;
        }
        .royal-select-wrapper::after {
          content: "▼";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(230, 185, 92, 0.5);
          font-size: 0.6rem;
          pointer-events: none;
        }
        ::-webkit-calendar-picker-indicator {
          filter: invert(70%) sepia(40%) saturate(1000%) hue-rotate(350deg) brightness(120%) contrast(120%);
          opacity: 0.8;
          cursor: pointer;
          padding-right: 8px;
        }
      `}</style>

      {/* Bottom blending gradient to seamlessly merge with the footer */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: '20vh',
          background: 'linear-gradient(to bottom, transparent 0%, var(--black) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
