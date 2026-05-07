export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      padding: '80px 60px 40px',
      position: 'relative',
    }}>
      {/* Subtle top edge glow */}
      <div style={{
        position: 'absolute',
        top: 0, left: '20%', right: '20%', height: 1,
        background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)',
        opacity: 0.4,
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto' }}>

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
                { label: 'Our Story',        id: 'story' },
                { label: 'Royal Menu',       id: 'menu' },
                { label: 'Culture & Folklore', id: 'culture' },
                { label: 'Locations',        id: 'locations' },
                { label: 'Reserve',          id: 'reserve' },
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
