import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
    style={{
    backgroundColor: 'var(--color-card-dark)',
    color: 'black',
    padding: '3rem 0',
    marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
      {/*update here*/}
       {/* Background Image Section */}
      <div
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.75),
              rgba(255,255,255,0.75)
            ),
            url('https://static.vecteezy.com/system/resources/thumbnails/011/883/333/small_2x/pink-purple-and-blue-gradient-abstract-blank-clean-colors-cheerful-and-simple-style-suitable-for-background-banner-flyer-pamphlet-wallpaper-or-decor-free-vector.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          padding: '3rem 0'
        }}
      ></div>
       {/*update till here*/}

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
