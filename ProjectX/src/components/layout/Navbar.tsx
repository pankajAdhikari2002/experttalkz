import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/events', label: 'Events' },
    { to: '/opportunities', label: 'Opportunities' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background-dark/95 backdrop-blur-sm px-6 py-3 lg:px-10 transition-colors">
      <Link to="/" className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity">
        <div className="text-primary">
          <span className="material-symbols-outlined !text-[32px]">school</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Expertalkz</h2>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-sm font-bold transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-300 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
             <Link to="/dashboard">
               <Button variant="outline" size="sm">Dashboard</Button>
             </Link>
             <Link to="/dashboard/profile" title="Profile Settings" className="flex items-center text-[#9dabb9] hover:text-white transition-colors">
               <span className="material-symbols-outlined !text-[32px]">account_circle</span>
             </Link>
             <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
             <button className="relative text-[#9dabb9] hover:text-white transition-colors">
               <span className="material-symbols-outlined !text-[24px]">notifications</span>
               <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
             </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
         
         {/* Mobile Menu Toggle */}
         <button 
           className="md:hidden text-white"
           onClick={() => setIsOpen(!isOpen)}
         >
           <span className="material-symbols-outlined !text-[28px]">{isOpen ? 'close' : 'menu'}</span>
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background-dark border-b border-white/10 shadow-lg md:hidden flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-base font-bold py-2 px-4 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="outline">Dashboard</Button>
                </Link>
                <Link to="/dashboard/profile" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="ghost" className="!justify-start">
                    <span className="material-symbols-outlined mr-2">account_circle</span>
                    Profile Settings
                  </Button>
                </Link>
                <Button fullWidth variant="ghost" onClick={() => { handleLogout(); setIsOpen(false); }}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
