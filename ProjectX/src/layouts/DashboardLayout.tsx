import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();
    return (
        <div className="flex h-screen w-full bg-background-dark overflow-hidden font-display text-white">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-white/5 bg-card-dark p-4 shrink-0">
                <div className="flex flex-col gap-8">
                    {/* User Profile */}
                    <div className="flex gap-3 items-center px-2">
                        <div className="size-12 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center text-xl uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-base font-bold leading-normal text-white truncate">{user?.name || 'Student'}</h1>
                            <p className="text-[#9dabb9] text-xs font-normal truncate">{user?.email || 'ExpertTalkz Learner'}</p>
                        </div>
                    </div>
                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary border-r-2 border-primary">
                            <span className="material-symbols-outlined">dashboard</span>
                            <p className="text-sm font-medium">Dashboard</p>
                        </Link>
                        <Link to="/courses" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#9dabb9] hover:bg-white/5 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">menu_book</span>
                            <p className="text-sm font-medium">My Courses</p>
                        </Link>
                        {/* More links... */}
                    </nav>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#1c2127] border border-slate-200 dark:border-white/5 relative group cursor-pointer overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#9dabb9] group-hover:text-primary transition-colors">Daily Goal</span>
                        <span className="text-xs font-bold text-slate-400">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-[#283039] rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%] rounded-full transition-all"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
