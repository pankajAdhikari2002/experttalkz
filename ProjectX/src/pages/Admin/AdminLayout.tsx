import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Courses', path: '/admin/courses', icon: 'menu_book' },
    { name: 'Blogs', path: '/admin/blogs', icon: 'article' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">shield_person</span>
            Admin Panel
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <a href="/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              View Site
            </a>
            <div className="h-6 w-px bg-gray-700"></div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
