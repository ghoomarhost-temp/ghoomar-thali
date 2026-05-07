import { useRef } from 'react';

export default function QuickBookSection() {
  const sectionRef = useRef(null);

  // Logos for Zomato and Swiggy
  const ZomatoLogo = () => (
    <div style={{
      width: 80, height: 80, borderRadius: '50%', background: '#E23744',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <span style={{
        fontFamily: 'sans-serif', fontWeight: 800, fontStyle: 'italic',
        fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.5px', marginTop: 2
      }}>
        zomato
      </span>
    </div>
  );

  const SwiggyLogo = () => (
    <div style={{
      width: 80, height: 80, borderRadius: '50%', background: '#FC8019',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <svg viewBox="0 0 100 100" style={{ width: 40, height: 40, fill: '#fff' }}>
        {/* Simple approximation of Swiggy 'S' icon shape */}
        <path d="M50 10 C30 10, 20 25, 20 25 L35 35 C35 35, 40 25, 50 25 C60 25, 65 30, 65 40 C65 50, 50 55, 35 60 C20 65, 10 80, 25 95 C25 95, 40 100, 50 100 C70 100, 80 85, 80 85 L65 75 C65 75, 60 85, 50 85 C40 85, 35 80, 35 70 C35 60, 50 55, 65 50 C80 45, 90 30, 75 15 C75 15, 60 10, 50 10 Z" />
      </svg>
    </div>
  );

  return (
    <section 
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '15vh 5vw',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent'
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 
        }}>
          <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <div style={{ width: 4, height: 4, transform: 'rotate(45deg)', border: '1px solid var(--gold)' }} />
          <span style={{ 
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gold)', 
            letterSpacing: '0.4em', textTransform: 'uppercase' 
          }}>
            Skip The Wait
          </span>
          <div style={{ width: 4, height: 4, transform: 'rotate(45deg)', border: '1px solid var(--gold)' }} />
          <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300,
          fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: 'var(--ivory)',
          marginBottom: 16
        }}>
          Book <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Dine-in</em> Instantly
        </h2>

        {/* Ornate Divider underneath title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24, opacity: 0.6 }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✦</span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--ivory-dim)',
          maxWidth: 500, margin: '0 auto'
        }}>
          Reserve your table in seconds on your favorite platforms.
        </p>
      </div>

      {/* ── Cards Container ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3vw',
        flexWrap: 'wrap', width: '100%', maxWidth: 1000
      }}>
        
        {/* Zomato Card */}
        <a 
          href="#"
          className="quick-book-card"
          style={{
            flex: '1 1 400px',
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '30px 40px',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, rgba(42, 16, 29, 0.4) 0%, rgba(26, 10, 19, 0.6) 100%)',
            border: '1px solid rgba(230,185,92,0.15)',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <ZomatoLogo />
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--gold)', 
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 
            }}>
              Zomato
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ivory-dim)', lineHeight: 1.5, margin: 0 }}>
              Book your table<br />on Zomato
            </p>
          </div>
          <div className="arrow-icon" style={{ color: 'var(--gold)', fontSize: '1.5rem', transition: 'transform 0.3s ease' }}>
            →
          </div>
        </a>

        {/* Center Ornament */}
        <div style={{ color: 'var(--gold)', fontSize: '1.5rem', opacity: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
          <span>⚜</span>
          <div style={{ width: 1, height: 20, background: 'linear-gradient(to top, transparent, var(--gold))' }} />
        </div>

        {/* Swiggy Card */}
        <a 
          href="#"
          className="quick-book-card"
          style={{
            flex: '1 1 400px',
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '30px 40px',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, rgba(42, 16, 29, 0.4) 0%, rgba(26, 10, 19, 0.6) 100%)',
            border: '1px solid rgba(230,185,92,0.15)',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <SwiggyLogo />
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--gold)', 
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 
            }}>
              Swiggy
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ivory-dim)', lineHeight: 1.5, margin: 0 }}>
              Book your table<br />on Swiggy
            </p>
          </div>
          <div className="arrow-icon" style={{ color: 'var(--gold)', fontSize: '1.5rem', transition: 'transform 0.3s ease' }}>
            →
          </div>
        </a>

      </div>

      <style>{`
        .quick-book-card:hover {
          background: linear-gradient(135deg, rgba(42, 16, 29, 0.7) 0%, rgba(26, 10, 19, 0.8) 100%) !important;
          border-color: rgba(230,185,92,0.4) !important;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .quick-book-card:hover .arrow-icon {
          transform: translateX(6px);
        }
        @media (max-width: 900px) {
          .quick-book-card {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
