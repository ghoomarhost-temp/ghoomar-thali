import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '../utils';
import { SCRUB } from '../animation';

/* ── Royal corner frame component ──────────────────────────────────────────── */
function CornerFrame() {
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const hBars = frameRef.current.querySelectorAll('.cf-h');
    const vBars = frameRef.current.querySelectorAll('.cf-v');
    gsap.set(hBars, { scaleX: 0, scaleY: 1 });
    gsap.set(vBars, { scaleY: 0, scaleX: 1 });

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: frameRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
        // Horizontal bars grow first
        .to(frameRef.current.querySelectorAll('.cf-h'), {
          scaleX: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06,
        }, 0)
        // Then vertical bars
        .to(frameRef.current.querySelectorAll('.cf-v'), {
          scaleY: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06,
        }, 0.15);
    }, frameRef);

    return () => ctx.revert();
  }, []);

  const LINE = 80; // px length of corner bar (longer)
  const THICK = 1; // thinner line
  const GOLD_HEX = 'rgba(230,185,92,1)';
  const GOLD_TRANS = 'rgba(230,185,92,0)';
  const OFFSET = -12; // increased gap from the image

  const corners = [
    // top-left
    { h: { top: OFFSET, left: OFFSET, width: LINE, transformOrigin: 'left center', background: `linear-gradient(to right, ${GOLD_HEX} 20%, ${GOLD_TRANS})` },
      v: { top: OFFSET, left: OFFSET, height: LINE, transformOrigin: 'top center', background: `linear-gradient(to bottom, ${GOLD_HEX} 20%, ${GOLD_TRANS})` } },
    // bottom-right
    { h: { bottom: OFFSET, right: OFFSET, width: LINE, transformOrigin: 'right center', background: `linear-gradient(to left, ${GOLD_HEX} 20%, ${GOLD_TRANS})` },
      v: { bottom: OFFSET, right: OFFSET, height: LINE, transformOrigin: 'bottom center', background: `linear-gradient(to top, ${GOLD_HEX} 20%, ${GOLD_TRANS})` } },
  ];

  return (
    <div ref={frameRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {corners.map((c, i) => (
        <div key={i}>
          <div className="cf-h" style={{ position: 'absolute', height: THICK, opacity: 0.85, ...c.h }} />
          <div className="cf-v" style={{ position: 'absolute', width: THICK, opacity: 0.85, ...c.v }} />
        </div>
      ))}
    </div>
  );
}

/* ── Counting number ──────────────────────────────────────────────────────── */
function CountNum({ value, trigger, index = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !trigger) return;
    // Extract numeric part
    const raw = parseFloat(value);
    const suffix = value.replace(/[\d.]/g, ''); // '+', etc.
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: raw,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.1 + index * 0.25, // Staggered counting
        snap: { val: raw < 10 ? 1 : 1 },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.round(obj.val) + suffix;
          }
        },
        scrollTrigger: {
          trigger,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, [value, trigger]);

  return <span ref={ref}>{value}</span>;
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function BrandSection() {
  const sectionRef = useRef(null);
  const img1Ref    = useRef(null);
  const img2Ref    = useRef(null);
  const text1Ref   = useRef(null);
  const text2Ref   = useRef(null);
  const statsRef   = useRef(null);
  const titleRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── Section title — unified bloom (same as MenuSection title) ──────────
      gsap.set(titleRef.current, { opacity: 0, y: 40, scale: 0.96 });
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          end:   'top 28%',
          scrub: SCRUB,
        },
      })
        .to(titleRef.current, {
          opacity: 1, y: 0, scale: 1,
          ease: 'power3.out', duration: 0.7,
        });

      // ─── Block 1: Image parallax ────────────────────────────────────────────
      gsap.fromTo(img1Ref.current,
        { yPercent: 6 }, { yPercent: -6, ease: 'none',
          scrollTrigger: { trigger: img1Ref.current, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
        }
      );
      const img1Container = img1Ref.current.querySelector('.scale-container');
      gsap.fromTo(img1Container,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out',
          scrollTrigger: { trigger: img1Container, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      // ─── Block 1: Text ──────────────────────────────────────────────────────
      const words1 = splitWords(text1Ref.current.querySelector('h3'));
      gsap.set(words1, { yPercent: 100, opacity: 0 });
      gsap.to(words1, {
        yPercent: 0, opacity: 1, stagger: 0.06, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: text1Ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo(text1Ref.current.querySelectorAll('p, a'),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: text1Ref.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );

      // ─── Block 2: Image parallax ────────────────────────────────────────────
      gsap.fromTo(img2Ref.current,
        { yPercent: 6 }, { yPercent: -6, ease: 'none',
          scrollTrigger: { trigger: img2Ref.current, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
        }
      );
      const img2Container = img2Ref.current.querySelector('.scale-container');
      gsap.fromTo(img2Container,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out',
          scrollTrigger: { trigger: img2Container, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      // ─── Block 2: Text ──────────────────────────────────────────────────────
      const words2 = splitWords(text2Ref.current.querySelector('h3'));
      gsap.set(words2, { yPercent: 100, opacity: 0 });
      gsap.to(words2, {
        yPercent: 0, opacity: 1, stagger: 0.06, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: text2Ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      // ─── Stats: fade in ─────────────────────────────────────────────────────
      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} style={{ padding: '100px 60px 60px', position: 'relative' }}>

      {/* Subtle maroon ambient glow */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(142,31,60,0.12) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Section header ── */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 120, willChange: 'transform, opacity' }}>
          <span className="section-tag">Our Story</span>
          <h2 className="section-title">Born from the <em>Courts</em> of Rajputana</h2>
          <div className="gold-divider" style={{ marginTop: 24 }} />
        </div>

        {/* ── Block 1 ── */}
        <div className="grid-2" style={{ marginBottom: 140, gap: 100, alignItems: 'center' }}>
          <div ref={text1Ref}>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3vw, 3.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: 'var(--ivory)',
              lineHeight: 1.1, marginBottom: 24, overflow: 'hidden', paddingBottom: '0.15em',
            }}>
              Where every dish tells a tale of the desert kingdoms
            </h3>
            <div className="ornament-line" style={{ marginBottom: 32 }}><div className="diamond" /></div>
            <p className="section-body" style={{ marginBottom: 16 }}>
              In 1987, Padma Shri Bhawani Singh Rathore opened the first Ghoomar Village — a living tribute to royal dining traditions perfected over four centuries in the courts of the Maharajas.
            </p>
            <a href="#menu" className="btn-royal"
              onClick={e => { e.preventDefault(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span>Explore the Menu</span>
            </a>
          </div>

          {/* Image with GSAP corner frame */}
          <div ref={img1Ref} style={{ willChange: 'transform' }}>
            <div className="scale-container" style={{ position: 'relative', overflow: 'visible', borderRadius: 4 }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                <img src="/images/interiors/Ambeince_Mall_Vasant_Kunj_1.webp" alt="Royal Interior"
                  style={{ width: '100%', height: 560, objectFit: 'cover', filter: 'brightness(0.75) sepia(0.15)', display: 'block' }}
                />
              </div>
              <CornerFrame />
            </div>
          </div>
        </div>

        {/* ── Block 2 ── */}
        <div className="grid-2" style={{ gap: 100, alignItems: 'center', marginBottom: 40 }}>
          <div ref={img2Ref} style={{ willChange: 'transform' }}>
            <div className="scale-container" style={{ position: 'relative', overflow: 'visible', borderRadius: 4 }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                <img src="/images/interiors/Golf_Course_Road_Gurugram_2.webp" alt="Palace Gate"
                  style={{ width: '100%', height: 480, objectFit: 'cover', filter: 'brightness(0.65) sepia(0.2)', display: 'block' }}
                />
              </div>
              <CornerFrame />
            </div>
          </div>

          <div ref={text2Ref}>
            <span className="section-tag">Philosophy</span>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3vw, 3.5rem)',
              fontWeight: 300, fontStyle: 'italic', color: 'var(--ivory)',
              lineHeight: 1.1, marginBottom: 24, marginTop: 16, overflow: 'hidden', paddingBottom: '0.15em',
            }}>
              The art of Rajputana hospitality, reimagined
            </h3>
            <p className="section-body" style={{ marginBottom: 32 }}>
              "Padharo Mhare Desh" — Welcome to My Land. At Ghoomar, every guest crosses the threshold as an honored guest of the royal household.
            </p>

            {/* Stats with counting animation */}
            <div ref={statsRef} style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
              padding: '28px 0', borderTop: '1px solid rgba(230,185,92,0.2)',
            }}>
              {[{ num: '10', label: 'Years' }, { num: '19+', label: 'Locations' }, { num: '200+', label: 'Recipes' }].map(({ num, label }, i) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-royal)', fontSize: '2.4rem', color: 'var(--gold)', lineHeight: 1 }}>
                    <CountNum value={num} trigger={statsRef.current} index={i} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--sand)', textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
