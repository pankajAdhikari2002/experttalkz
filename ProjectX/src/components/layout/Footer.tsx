import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--color-card-dark)', 
      color: 'white', 
      padding: '3rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Expertalkz Global Solutions LLP</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            "Shaping the Future of Oil & Gas — Jobs, Training & Industry Solutions."
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" style={{ color: '#cbd5e1' }}>Home</Link>
            <Link to="/about" style={{ color: '#cbd5e1' }}>About Us</Link>
            <Link to="/courses" style={{ color: '#cbd5e1' }}>Training Courses</Link>
            <Link to="/blog" style={{ color: '#cbd5e1' }}>Knowledge Hub</Link>
            <Link to="/opportunities" style={{ color: '#cbd5e1' }}>Opportunities</Link>
            <Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/privacy" style={{ color: '#cbd5e1' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#cbd5e1' }}>Terms & Conditions</Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ 
        marginTop: '3rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid #334155',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <p>Expertalkz Global Solutions LLP is a registered LLP in India. All training programs and content are subject to availability. Placement support does not guarantee employment.</p>
        <p>© 2020–{new Date().getFullYear()} Expertalkz Global Solutions LLP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
