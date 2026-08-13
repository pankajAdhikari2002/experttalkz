import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: `url('https://cdn.prod.website-files.com/6768f29a6d5da42209173f20/6768f29b6d5da42209177487_Rectangle%20(83).svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '4rem 2rem 2rem 2rem',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              marginBottom: '0.75rem',
              fontWeight: '800',
              fontSize: '1.15rem',
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Expertalkz Global Solutions LLP
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.875rem', lineHeight: '1.7' }}>
            "Shaping the Future of Oil &amp; Gas — Jobs, Training &amp; Industry Solutions."
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              marginBottom: '1rem',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Training Courses', to: '/courses' },
              { label: 'Knowledge Hub', to: '/blog' },
              { label: 'Opportunities', to: '/opportunities' },
              { label: 'Contact Us', to: '/contact' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              marginBottom: '1rem',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms & Conditions', to: '/terms' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '3rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '1200px',
          margin: '3rem auto 0 auto',
        }}
      >
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.8rem', lineHeight: '1.7' }}>
          Expertalkz Global Solutions LLP is a registered LLP in India. All training programs and
          content are subject to availability. Placement support does not guarantee employment.
        </p>
        <p style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.82rem' }}>
          © 2020–{new Date().getFullYear()} Expertalkz Global Solutions LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
