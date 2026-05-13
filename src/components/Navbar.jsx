import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const links = [
  { label: 'Story', id: 'story' },
  { label: 'Legacy', id: 'legacy' },
  { label: 'Menu', id: 'menu' },
  { label: 'Culture', id: 'culture' },
  { label: 'Locations', id: 'locations' },
  { label: 'Testimonials', id: 'testimonials' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;

    // Note: Initial entrance slide-down is now controlled by LoadingScreen.jsx's master timeline.

    // On scroll: increase opacity (already blurred from start via CSS)
    ScrollTrigger.create({
      start: 'top+=80 top',
      onEnter: () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled'),
    });
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent('nav:scrollTo', { detail: { id } }));
  };

  return (
    <>
      <nav ref={navRef} className="nav" style={{ opacity: 0, willChange: 'transform' }}>
        <a href="#" className="nav-logo">
          <img src="/ghoomar-logo.png" alt="Ghoomar" height="48" style={{ display: 'block', objectFit: 'contain' }} />
        </a>

        <ul className="nav-links">
          {links.map(link => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={e => { e.preventDefault(); scrollTo(link.id); }}>{link.label}</a>
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
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
            <button key={link.id} onClick={() => scrollTo(link.id)} style={{
              background: 'none', border: 'none', fontFamily: 'var(--font-royal)',
              fontSize: '1.4rem', letterSpacing: '0.3em', color: 'var(--gold)', cursor: 'pointer', textTransform: 'uppercase',
            }}>{link.label}</button>
          ))}
          <button onClick={() => scrollTo('reserve')} style={{
            background: 'none', border: 'none', fontFamily: 'var(--font-royal)',
            fontSize: '1.4rem', letterSpacing: '0.3em', color: 'var(--gold)', cursor: 'pointer', textTransform: 'uppercase',
          }}>Reserve Table</button>
        </div>
      )}
    </>
  );
}
