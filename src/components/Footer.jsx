export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(175deg, #110604 0%, #0a0302 40%, #0d0405 70%, #080204 100%)',
      borderTop: '1px solid rgba(201,168,76,0.18)',
      padding: '80px 60px 40px',
    }}>

      {/* SVG Rajasthani motif at 15% */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(/footer-motif.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '60%',
        opacity: 0.10,
        pointerEvents: 'none',
      }} />

      {/* Vignette — luxury blackish-brown noir */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 68% 62% at 50% 50%, transparent 0%, rgba(6,3,2,0.60) 28%, rgba(3,1,1,0.80) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Gold top edge line */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, zIndex: 1,
        background: 'linear-gradient(90deg, transparent, rgba(197,164,109,0.7), transparent)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 60, marginBottom: 80 }}>

          {/* Brand */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-royal)',
              fontSize: '1.4rem',
              color: 'var(--gold)',
              letterSpacing: '0.2em',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Ghoomar
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--sand)',
              lineHeight: 1.8,
            }}>
              The pinnacle of Rajputana heritage dining. An immersive journey into the culinary and cultural legacy of Rajasthan.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-royal)',
              fontSize: '0.8rem',
              color: 'var(--ivory-dim)',
              letterSpacing: '0.2em',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Our Story',          id: 'story' },
                { label: 'Royal Menu',         id: 'menu' },
                { label: 'Culture & Folklore', id: 'culture' },
                { label: 'Locations',          id: 'locations' },
                { label: 'Reserve',            id: 'reserve' },
              ].map(({ label, id }) => (
                <li key={label}>
                  <a
                    href={`#${id}`}
                    onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--sand)',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseOver={e  => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseOut={e   => e.currentTarget.style.color = 'var(--sand)'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-royal)',
              fontSize: '0.8rem',
              color: 'var(--ivory-dim)',
              letterSpacing: '0.2em',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--sand)' }}>
                reservations@ghoomarvillage.com
              </li>
              <li style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--sand)' }}>
                +91 141 234 5678
              </li>
              <li style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--sand)', marginTop: 12 }}>
                1st Floor, Royal Plaza,<br />
                Jaipur, Rajasthan 302001
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          paddingTop: 32,
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--sand)',
            opacity: 0.5,
          }}>
            &copy; {new Date().getFullYear()} Ghoomar Village. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a
                key={social}
                href="#"
                style={{
                  fontFamily: 'var(--font-royal)',
                  fontSize: '0.7rem',
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  opacity: 0.7,
                  transition: 'opacity 0.3s',
                }}
                onMouseOver={e  => e.currentTarget.style.opacity = '1'}
                onMouseOut={e   => e.currentTarget.style.opacity = '0.7'}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
