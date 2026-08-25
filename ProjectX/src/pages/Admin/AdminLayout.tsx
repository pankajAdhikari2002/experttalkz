import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Admin');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const activeUser = localStorage.getItem('expertTalkz_active_user');
      if (activeUser) {
        const u = JSON.parse(activeUser);
        if (u.email) setUserEmail(u.email);
        if (u.name) setUserName(u.name);
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('expertTalkz_auth_token');
    localStorage.removeItem('expertTalkz_active_user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard', description: 'Overview & metrics' },
    { name: 'Courses', path: '/admin/courses', icon: 'menu_book', description: 'Manage catalog & pricing' },
    { name: 'Blogs', path: '/admin/blogs', icon: 'article', description: 'Articles & publications' },
    { name: 'Team & Access', path: '/admin/users', icon: 'manage_accounts', description: 'Admin roles & users' },
  ];

  // Derive current section title for breadcrumbs
  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard';
    if (location.pathname.startsWith('/admin/courses')) {
      if (location.pathname.includes('/new')) return 'New Course';
      if (location.pathname.includes('/edit')) return 'Edit Course';
      return 'Courses';
    }
    if (location.pathname.startsWith('/admin/blogs')) {
      if (location.pathname.includes('/new')) return 'New Blog Post';
      if (location.pathname.includes('/edit')) return 'Edit Blog Post';
      return 'Blogs';
    }
    if (location.pathname.startsWith('/admin/users')) return 'Team & Access Control';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col lg:flex-row antialiased font-sans">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#161b22] border-r border-[#30363d] flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo & Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20 text-black font-black text-lg">
                ET
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white tracking-tight leading-none">
                  ExpertTalkz
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-primary mt-1">
                  Control Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
              Management
            </div>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-primary/15 text-primary font-semibold border border-primary/30 shadow-sm shadow-primary/10'
                        : 'text-slate-300 hover:bg-[#21262d] hover:text-white'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${
                        isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm leading-none">{item.name}</span>
                      <span className="text-[11px] text-slate-400 mt-1 font-normal leading-none group-hover:text-slate-300">
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-6 bg-primary rounded-full absolute right-2" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Links / Actions */}
          <div className="p-4 border-t border-[#30363d] space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#21262d] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base text-slate-400">public</span>
                View Live Website
              </span>
              <span className="material-symbols-outlined text-sm text-slate-500">open_in_new</span>
            </a>
          </div>
        </div>

        {/* User Account / Footer */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/30 to-amber-500/30 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate leading-tight">
                  {userName}
                </span>
                <span className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                  {userEmail || 'Administrator'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-[#161b22]/80 backdrop-blur-md border-b border-[#30363d] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm">
              <Link to="/admin" className="text-slate-400 hover:text-slate-200 font-medium">
                Admin
              </Link>
              {location.pathname !== '/admin' && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-white font-semibold">{getPageTitle()}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/courses/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/25 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Course
            </Link>
            <div className="h-5 w-px bg-[#30363d] hidden sm:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
