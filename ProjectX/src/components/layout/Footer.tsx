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
          <h3 style={{ marginBottom: '1rem' }}>ExpertTalkz</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Empowering the next generation of engineers and tech leaders.
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/courses" style={{ color: '#cbd5e1' }}>All Courses</Link>
            <Link to="/about" style={{ color: '#cbd5e1' }}>About Us</Link>
            <Link to="/contact" style={{ color: '#cbd5e1' }}>Contact</Link>
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
        fontSize: '0.875rem'
      }}>
        © {new Date().getFullYear()} ExpertTalkz. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
