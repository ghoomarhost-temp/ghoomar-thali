import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import mandalaSvg from '../assets/mandala_design.svg';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const mandalaRef = useRef(null);
  const bloomRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);

  // Store latest onComplete to avoid restarting the timeline if the parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Initial setup for hero elements to prevent any flash
    gsap.set('.nav', { opacity: 0, y: -20 });
    gsap.set('.hero-bg-blur', { opacity: 1 });
    gsap.set('.hero-bg', { opacity: 0, scale: 1.05 });
    gsap.set('.hero-heading', { opacity: 0, y: 30 });
    gsap.set('.hero-subtext', { opacity: 0, y: 20 });
    gsap.set('.hero-cta', { opacity: 0, scale: 0.95 });

    // Single master timeline. 
    // Not using gsap.context() so external element animations persist after unmount.
    const tl = gsap.timeline({
      onComplete: () => {
        if (onCompleteRef.current) onCompleteRef.current();
      }
    });

    const mandala = mandalaRef.current;
    const bloom = bloomRef.current;
    const wrapper = containerRef.current;

    // STEP 1 - PRELOADER
    // Mandala slow smooth rotation (linear, no jitter)
    gsap.to(mandala, {
      rotation: 360,
      duration: 10,
      ease: 'none',
      repeat: -1,
      force3D: true
    });

    // 1. Initial fade-in of the mandala and side texts
    tl.to([mandala, leftTextRef.current, rightTextRef.current], {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.1,
      force3D: true
    });

    // Start word cycling for the right side
    const words = document.querySelectorAll('.loader-right-word');
    if (words.length > 0) {
      const cycleTl = gsap.timeline({ repeat: -1 });
      words.forEach((word) => {
        cycleTl
          // Always animate FROM the reset position so y never drifts on repeat
          .fromTo(word,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', force3D: true }
          )
          .to(word, { opacity: 0, y: -15, duration: 0.25, ease: 'power2.in' }, '+=0.3')
          // Reset y back to starting position immediately after exit
          .set(word, { y: 15 });
      });
    }

    // Simulate loading time (e.g., waiting for assets)
    tl.to({}, { duration: 1.8 });

    // STEP 2 - LOAD COMPLETE (MAIN TRANSITION)
    // Let the mandala keep spinning while it transitions out for a smoother effect
    
    // 2. Mandala scales up, blurs, and fades out
    tl.to(mandala, {
      scale: 4,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 1.5,
      ease: 'power2.inOut',
      force3D: true
    }, '+=0.1');

    // Fade out text elements with opacity only (no filter — avoids font rendering artifacts)
    tl.to([leftTextRef.current, rightTextRef.current], {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      force3D: true
    }, '<');

    // 3. ADD BLOOM EFFECT
    // Dreamy goldenish overlay fades in to 70% opacity
    tl.to(bloom, {
      opacity: 0.70,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '<0.1');

    // Simultaneously fade out the black background so the bloom screens directly over the hero image
    tl.to(wrapper, {
      backgroundColor: 'transparent',
      duration: 1.2,
      ease: 'power2.inOut'
    }, '<');

    // STEP 3 - TRANSITION TO HERO
    // Wrapper fades out smoothly
    tl.to(wrapper, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, '<0.8');

    // Hero background cross-fade from blurred to sharp
    tl.to('.hero-bg-blur', {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, '<0.1');

    tl.to('.hero-bg', {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: 'power2.out'
    }, '<');

    // STEP 4 - HERO ENTRY (SEQUENCE)
    // 1. Navbar → fade down (0.5s)
    tl.to('.nav', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '<0.3');

    // 2. Heading → fade up (0.6s)
    tl.to('.hero-heading', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '<0.15');

    // 3. Subtext → fade up (0.5s)
    tl.to('.hero-subtext', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        document.querySelectorAll('.hero-subtext .quote-char').forEach(el => {
          el.classList.add('stroke-play');
        });
      }
    }, '<0.15');

    // 4. CTA → scale + fade (0.4s)
    tl.to('.hero-cta', {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.5)'
    }, '<0.15');

    return () => {
      // Cleanup any running tweens to prevent memory leaks or StrictMode double-play
      tl.kill();
      gsap.killTweensOf([mandala, bloom, wrapper]);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99997,
        background: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto', // Block interactions during cinematic intro
      }}
    >
      {/* Center Content Group */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(24px, 10vw, 120px)',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {/* Left Text: GHOOMAR */}
        <div
          ref={leftTextRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
            letterSpacing: '0.5em',
            color: 'var(--gold)',
            opacity: 0,
            textTransform: 'uppercase',
            fontWeight: 300,
            fontStyle: 'italic',
            textAlign: 'right',
            width: 'clamp(100px, 15vw, 200px)',
            /* Fix GPU subpixel bold flash by forcing consistent layer */
            transform: 'translateZ(0)',
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden'
          }}
        >
          Ghoomar
        </div>

        {/* Center Mandala */}
        <div 
          ref={mandalaRef}
          style={{
            width: 'clamp(120px, 20vw, 260px)',
            height: 'clamp(120px, 20vw, 260px)',
            willChange: 'transform, opacity', // Removed filter from willChange to prevent SVG render lag
            opacity: 0,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <img src={mandalaSvg} alt="Mandala Preloader" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Right Text: Cycling Words */}
        <div
          ref={rightTextRef}
          style={{
            position: 'relative',
            width: 'clamp(100px, 15vw, 200px)',
            height: '1.5em',
            opacity: 0,
            overflow: 'hidden'
          }}
        >
          {['Thali', 'Village', 'Experience'].map((word) => (
            <div
              key={word}
              className="loader-right-word"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                letterSpacing: '0.5em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                fontWeight: 300,
                fontStyle: 'italic',
                opacity: 0,
                transform: 'translateY(15px) translateZ(0)',
                /* Fix GPU subpixel bold flash by forcing consistent layer */
                willChange: 'opacity, transform',
                backfaceVisibility: 'hidden'
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      {/* White Overlay Bloom */}
      <div
        ref={bloomRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, #ffffff 0%, #fbd497 40%, var(--gold) 100%)',
          opacity: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}
