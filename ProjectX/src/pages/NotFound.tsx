import { Link } from 'react-router-dom';
import Meta from '../components/common/Meta';

const NotFound = () => {
  return (
    <div className="container" style={{ 
      padding: '4rem 1rem', 
      textAlign: 'center', 
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Meta title="Page Not Found | ExpertTalkz" description="The page you are looking for does not exist." />
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Page Not Found</p>
      <Link to="/" style={{ 
        padding: '0.75rem 1.5rem', 
        backgroundColor: 'var(--primary)', 
        color: 'white', 
        borderRadius: '0.5rem' 
      }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
