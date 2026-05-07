import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const links = ['Story', 'Menu', 'Culture', 'Locations', 'Reserve'];

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;

    // Note: Initial entrance slide-down is now controlled by LoadingScreen.jsx's master timeline.

    // On scroll: increase opacity (already blurred from start via CSS)
    ScrollTrigger.create({
      start: 'top+=80 top',
      onEnter:     () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled'),
    });
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className="nav" style={{ opacity: 0, willChange: 'transform' }}>
        <a href="#" className="nav-logo">
          <img src="/ghoomar-logo.png" alt="Ghoomar" height="48" style={{ display: 'block', objectFit: 'contain' }} />
        </a>

        <ul className="nav-links">
          {links.map(link => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} onClick={e => { e.preventDefault(); scrollTo(link); }}>{link}</a>
            </li>
          ))}
        </ul>

        <a href="#reserve" className="nav-cta" onClick={e => { e.preventDefault(); scrollTo('reserve'); }}>
          Reserve Table
        </a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none' }}
        >
          <div style={{ width: 24, height: 1, background: 'var(--gold)', marginBottom: 6 }} />
          <div style={{ width: 16, height: 1, background: 'var(--gold)', marginBottom: 6 }} />
          <div style={{ width: 20, height: 1, background: 'var(--gold)' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(26,10,19,0.97)', zIndex: 9998,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40,
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: 24, right: 32, background: 'none', border: 'none', color: 'var(--gold)', fontSize: 24, cursor: 'pointer' }}
          >✕</button>
          {links.map(link => (
            <button key={link} onClick={() => scrollTo(link)} style={{
              background: 'none', border: 'none', fontFamily: 'var(--font-royal)',
              fontSize: '1.4rem', letterSpacing: '0.3em', color: 'var(--gold)', cursor: 'pointer', textTransform: 'uppercase',
            }}>{link}</button>
          ))}
        </div>
      )}
    </>
  );
}
