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
import ReserveSection from './components/ReserveSection';
import QuickBookSection from './components/QuickBookSection';
import Footer from './components/Footer';
import RoyalBackground from './components/RoyalBackground';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Unlock scrolling when intro is entirely finished
  useEffect(() => {
    if (!loading && lenisRef.current) {
      lenisRef.current.start();
      ScrollTrigger.sort();
      ScrollTrigger.refresh(true);
    }
  }, [loading]);

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
          <ReserveSection />
          <QuickBookSection />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
