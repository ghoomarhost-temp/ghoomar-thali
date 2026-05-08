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
      <svg viewBox="0 0 24 24" style={{ width: 45, height: 45, fill: '#fff' }}>
        <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z" />
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
          className="quick-book-card zomato-card"
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
          className="quick-book-card swiggy-card"
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
        .zomato-card {
          box-shadow: inset 0 0 60px rgba(226, 55, 68, 0.25), inset 0 0 20px rgba(226, 55, 68, 0.2);
        }
        .swiggy-card {
          box-shadow: inset 0 0 60px rgba(252, 128, 25, 0.25), inset 0 0 20px rgba(252, 128, 25, 0.2);
        }
        .quick-book-card:hover {
          background: linear-gradient(135deg, rgba(42, 16, 29, 0.7) 0%, rgba(26, 10, 19, 0.8) 100%) !important;
          border-color: rgba(230,185,92,0.4) !important;
          transform: translateY(-4px);
        }
        .zomato-card:hover {
          box-shadow: inset 0 0 100px rgba(226, 55, 68, 0.4), inset 0 0 35px rgba(226, 55, 68, 0.3), 0 15px 35px rgba(0,0,0,0.4) !important;
        }
        .swiggy-card:hover {
          box-shadow: inset 0 0 100px rgba(252, 128, 25, 0.4), inset 0 0 35px rgba(252, 128, 25, 0.3), 0 15px 35px rgba(0,0,0,0.4) !important;
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
