import { useEffect, useRef } from 'react';
import gsap from 'gsap'; // HMR trigger
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const HERO_TEXT = "Experience the richness of Rajasthan. Every pure vegetarian thali is a celebration of its culinary heritage, brought to life through 24+ soulful dishes, served unlimited with timeless tradition and authentic flavors.";

const TOTAL_CHARS = HERO_TEXT.length;

const parsedHeroText = (() => {
  const words = HERO_TEXT.split(' ');
  let currentIndex = 0;
  return words.map((word, wIdx) => {
    const chars = word.split('').map(char => {
      const i = currentIndex++;
      // Calculate distance to closest edge to animate simultaneously from both ends
      const distToEdge = Math.min(i, TOTAL_CHARS - 1 - i);
      return { char, delay: distToEdge * 0.026 }; // slightly increased delay factor so it takes roughly same time
    });
    currentIndex++; // account for space
    return { chars, isLast: wIdx === words.length - 1 };
  });
})();

export default function HeroSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  const heroWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const blendRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Note: Initial entrance animations are now centrally controlled by LoadingScreen.jsx's master timeline
      // to ensure a perfect cinematic sequence (Background -> Navbar -> Heading -> Subtext -> CTA).

      // — Parallax on scroll —
      // Background zooms in slowly
      gsap.fromTo(imgRef.current, {
        scale: 1
      }, {
        scale: 1.18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });

      // Overlay darkens
      gsap.to(overlayRef.current, {
        opacity: 0.88,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });



      // Gloomy cinematic zoom-blur exit — starts from first scroll pixel
      gsap.fromTo(heroWrapperRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '85% top',
            scrub: 1.8,
          }
        }
      );

      gsap.fromTo('.hero-content',
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -25,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '15% top',
            end: '65% top',
            scrub: 1,
          }
        }
      );

      // Animate the bottom blend gradient so it's not visible on initial screen
      gsap.fromTo(blendRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '40% top',
            scrub: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      // NOTE: No background — body bg shows through; overflow hidden for clip safety
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      <div
        ref={heroWrapperRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      >
        {/* Background image layers for performant blur transition */}
        <div
          className="hero-bg-blur"
          style={{
            position: 'absolute',
            inset: '-5%',
            filter: 'blur(10px)',
            opacity: 0,
            willChange: 'opacity',
            transform: 'scale(1.05)',
          }}
        >
          <img
            src="/images/restaurant_interior_1776795925000.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div
          ref={bgRef}
          className="hero-bg"
          style={{
            position: 'absolute',
            inset: '-5%',
            willChange: 'opacity, transform',
            transformOrigin: 'center center',
          }}
        >
          <img
            ref={imgRef}
            src="/images/restaurant_interior_1776795925000.png"
            alt="Ghoomar Royal Interior"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div
          ref={overlayRef}
          className="hero-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.55,
            background: 'linear-gradient(to bottom, rgba(26,10,19,0.2) 0%, var(--black) 100%)',
            willChange: 'opacity',
          }}
        />



        {/* Hero content */}
        <div
          className="hero-content"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 40px',
            willChange: 'transform, opacity',
          }}
        >
          <h1
            ref={titleRef}
            className="hero-heading"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--ivory)',
              lineHeight: 1.1,
              marginBottom: 28,
              textShadow: '0 20px 60px rgba(0,0,0,0.9)',
              overflow: 'hidden',
              paddingBottom: '0.15em',
              opacity: 0,
            }}
          >
            The Royal <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Ghoomar</em> of Flavours
          </h1>

          <p
            ref={subRef}
            className="hero-subtext"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: 'var(--ivory-dim)',
              fontWeight: 300,
              fontStyle: 'italic',
              maxWidth: 620,
              lineHeight: 1.9,
              opacity: 0,
            }}
            aria-label={HERO_TEXT}
          >
            {parsedHeroText.map((wordObj, wIdx) => [
              <span key={`w-${wIdx}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {wordObj.chars.map((c, cIdx) => (
                  <span
                    key={cIdx}
                    className="quote-char"
                    style={{ animationDelay: `${c.delay}s` }}
                  >
                    {c.char}
                  </span>
                ))}
              </span>,
              !wordObj.isLast && <span key={`s-${wIdx}`}> </span>
            ])}
          </p>

          <div ref={ctaRef} className="hero-cta" style={{ marginTop: 52, opacity: 0 }}>
            <a
              href="#reserve"
              className="btn-royal"
              onClick={(e) => { e.preventDefault(); document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                background: 'rgba(26,10,19,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span>Reserve Your Table</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom blending gradient to seamlessly merge with the next section's charcoal background */}
      <div
        ref={blendRef}
        style={{
          position: 'absolute',
          bottom: -1, /* -1 to prevent tiny subpixel gaps */
          left: 0,
          right: 0,
          height: '25vh',
          background: 'linear-gradient(to bottom, transparent 0%, var(--black) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
    </section>
  );
}
