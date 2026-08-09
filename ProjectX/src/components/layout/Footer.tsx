import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#070924',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        padding: '4rem 2rem',
        marginTop: 'auto',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem', color: '#ffffff' }}>
            Expertalkz Global Solutions LLP
          </h3>
          <p style={{ color: '#50739b', fontSize: '0.875rem', lineHeight: '1.6' }}>
            "Shaping the Future of Oil & Gas — Jobs, Training & Industry Solutions."
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1rem', color: '#ffffff' }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link to="/" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Home</Link>
            <Link to="/about" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">About Us</Link>
            <Link to="/courses" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Training Courses</Link>
            <Link to="/blog" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Knowledge Hub</Link>
            <Link to="/opportunities" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Opportunities</Link>
            <Link to="/contact" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1rem', color: '#ffffff' }}>
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link to="/privacy" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#50739b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }} className="hover:text-[#4169E1] hover:underline transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ 
        marginTop: '3rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#244777',
        fontSize: '0.8rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '1200px',
        margin: '3rem auto 0 auto'
      }}>
        <p style={{ lineHeight: '1.6' ,color: '#50739b' }}>
          Expertalkz Global Solutions LLP is a registered LLP in India. All training programs and content are subject to availability. Placement support does not guarantee employment.
        </p>
        <p style={{ fontWeight: '600', color: '#475569' }}>
          © 2020–{new Date().getFullYear()} Expertalkz Global Solutions LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
