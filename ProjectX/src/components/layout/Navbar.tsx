import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background-dark/95 backdrop-blur-sm transition-colors">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity shrink-0">
          <img
            src="/experttalkz icon.png"
            alt="Expertalkz Logo"
            className="h-9 w-9 object-cover rounded-full shadow-md shadow-purple-500/40"
          />
          <h2 className="text-lg font-bold tracking-wide bg-gradient-to-r from-pink-500 via-white to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,105,180,0.8)]">
            Expertalkz
          </h2>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-bold transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop Auth Buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link to="/dashboard/profile" title="Profile Settings" className="flex items-center text-[#9dabb9] hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[30px]">account_circle</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              <button className="relative text-[#9dabb9] hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[24px]">notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile: Hamburger only ── */}
        <button
          className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined !text-[26px]">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[57px] bg-black/60 md:hidden z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-down panel */}
          <div className="absolute top-full left-0 w-full bg-[#080f1f] border-b border-white/10 shadow-2xl md:hidden z-50 flex flex-col">

            {/* Nav links */}
            <nav className="flex flex-col px-4 pt-3 pb-2 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-semibold py-3 px-4 rounded-xl transition-colors flex items-center gap-3 ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 border-t border-white/10 my-1" />

            {/* Auth buttons */}
            <div className="px-4 pb-5 pt-3 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button fullWidth variant="outline">Dashboard</Button>
                  </Link>
                  <Link to="/dashboard/profile" onClick={() => setIsOpen(false)}>
                    <Button fullWidth variant="ghost" className="!justify-start">
                      <span className="material-symbols-outlined mr-2 !text-[18px]">account_circle</span>
                      Profile Settings
                    </Button>
                  </Link>
                  <Button fullWidth variant="ghost" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="contents">
                    <Button fullWidth variant="ghost">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="contents">
                    <Button fullWidth variant="primary">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
