import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Cursor from './components/Cursor';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandSection from './components/BrandSection';
import LegacySection from './components/LegacySection';
import MenuSection from './components/MenuSection';
import CultureSection from './components/CultureSection';
import LocationSection from './components/LocationSection';
import TestimonialsSection from './components/TestimonialsSection';
import ReserveSection from './components/ReserveSection';
import QuickBookSection from './components/QuickBookSection';
import Footer from './components/Footer';
import RoyalBackground from './components/RoyalBackground';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);
  const pendingJumpRef = useRef(null);

  useEffect(() => {
    // Force browser to always start at the top on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -8 * t), // expo.out: fast start, gentle finish
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.stop(); // Block scroll during cinematic intro

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // ── Refresh ScrollTrigger on resize ─────────────────────────────────────
    // Critical: all vh-based scroll calculations must recalculate on resize
    const handleResize = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh(true);
    };
    window.addEventListener('resize', handleResize);

    // ── Global Scroll Lock Events ───────────────────────────────────────────
    const stopScroll = () => lenis.stop();
    const startScroll = () => lenis.start();
    window.addEventListener('lenis:stop', stopScroll);
    window.addEventListener('lenis:start', startScroll);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('lenis:stop', stopScroll);
      window.removeEventListener('lenis:start', startScroll);
    };
  }, []);

  // Unlock scrolling when intro is entirely finished
  useEffect(() => {
    if (!loading && lenisRef.current) {
      lenisRef.current.start();
      // Wait for fonts to settle before measuring pin-spacer heights
      document.fonts.ready.then(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh(true);
      });
    }
  }, [loading]);

  // Navbar direct-jump handler.
  //
  // Why gsap.ticker instead of requestAnimationFrame:
  //   lenis.scrollTo({ immediate: true }) defers the actual window.scrollTo call
  //   to the next GSAP ticker frame (inside lenis.raf). A double-rAF fires two
  //   frames later — leaving one painted frame with stale pin/animation states.
  //
  //   gsap.ticker callbacks run in registration order within the SAME animation
  //   frame. lenis.raf was registered first (at mount), so syncAfterJump fires
  //   immediately after Lenis commits window.scrollY — before the browser paints.
  useEffect(() => {
    const onNavScroll = (e) => {
      const el = document.getElementById(e.detail.id);
      if (!el || !lenisRef.current) return;

      const lenis = lenisRef.current;

      if (pendingJumpRef.current) {
        gsap.ticker.remove(pendingJumpRef.current);
        pendingJumpRef.current = null;
      }

      // Snap non-scrubbed (toggleActions) animations to their boundary state.
      const snapAll = (y) => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.scrub || !st.animation) return;
          const anim = st.animation;
          if (y >= st.end)        { anim.pause(); anim.progress(1, true); }
          else if (y <= st.start) { anim.pause(); anim.progress(0, true); }
        });
      };

      // Force ALL soft-scrubbed timelines to their exact progress at y.
      //
      // scrub: N (number) — GSAP creates an internal easing tween that drifts the
      // animation toward the target over N seconds. getTween() may return null on
      // the same frame update() ran (tween creation is queued for the next tick),
      // so we cannot rely on it. Instead: calculate p directly from y/start/end,
      // kill any pending tween to prevent it from overriding our set, then snap
      // the animation to the exact correct progress with suppressEvents:true.
      //
      // scrub: true (boolean) — directly maps progress to scroll position.
      // ScrollTrigger.update() already handles this correctly; we skip it here.
      const forceSync = (y) => {
        ScrollTrigger.getAll().forEach(st => {
          if (!st.animation || typeof st.scrub !== 'number') return;
          const p = st.end > st.start
            ? Math.max(0, Math.min(1, (y - st.start) / (st.end - st.start)))
            : (y >= st.end ? 1 : 0);
          const scrubTween = st.getTween ? st.getTween() : null;
          if (scrubTween) scrubTween.kill();
          st.animation.pause();
          st.animation.progress(p, true);
        });
      };

      // ── Phase 1: calculate first, teleport second (synchronous) ─────────────
      // Refresh pin-spacer heights and all trigger boundaries at current position
      // before measuring the target — ensures getBoundingClientRect is accurate.
      ScrollTrigger.sort();
      ScrollTrigger.refresh(true);

      const targetY = Math.round(el.getBoundingClientRect().top + window.scrollY);

      // Commit scroll position natively (synchronous window.scrollY update).
      window.scrollTo(0, targetY);
      // Sync Lenis internal state so it doesn't re-animate away from targetY.
      lenis.scrollTo(targetY, { immediate: true });

      // Fire onLeave / onEnterBack / onUpdate callbacks for all triggers at targetY.
      ScrollTrigger.update();
      // Snap every soft-scrubbed animation to its exact progress at targetY.
      forceSync(targetY);
      snapAll(targetY);

      // ── Phase 2: next-frame settle and 5px micro-scroll ─────────────────────
      const syncAfterJump = () => {
        pendingJumpRef.current = null;
        gsap.ticker.remove(syncAfterJump);
        
        // Stabilize/update the timeline state at the exact jump position
        ScrollTrigger.update();
        forceSync(window.scrollY);
        snapAll(window.scrollY);
        
        // THE MICRO-SCROLL FIX:
        // Immediately trigger a smooth downward movement. For 'legacy', we scroll 
        // 350px to perfectly reveal the promise text ("Every experience bears...").
        // For other sections, a 5px scroll is enough to force GSAP to update.
        const isLegacy = e.detail.id === 'legacy';
        const scrollOffset = isLegacy ? 350 : 5;
        lenis.scrollTo(targetY + scrollOffset, { duration: isLegacy ? 0.2 : 0.1 });
      };

      pendingJumpRef.current = syncAfterJump;
      gsap.ticker.add(syncAfterJump);
    };

    window.addEventListener('nav:scrollTo', onNavScroll);
    return () => window.removeEventListener('nav:scrollTo', onNavScroll);
  }, []);

  return (
    <>
      <Cursor />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      <div style={{ position: 'relative' }}>
        {/* Fixed global background — sits behind everything */}
        <RoyalBackground />

        {/* Fixed grain texture overlay — sits in front of everything */}
        <div className="grain-overlay" />

        {/* Fixed navigation */}
        <Navbar />

        {/* Page content — NO background here; sections are transparent */}
        <main>
          <HeroSection />
          <BrandSection />
          <LegacySection />
          <MenuSection />
          <CultureSection />
          <LocationSection />
          <TestimonialsSection />
          <ReserveSection />
          <QuickBookSection />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
