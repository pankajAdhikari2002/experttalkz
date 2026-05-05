import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Meta title="Student Dashboard | ExpertTalkz" description="Track your learning progress." />
      
      <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-20 px-4 md:px-8 pt-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-400 font-medium">Here's what's happening with your courses today.</p>
          </div>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <span className="material-symbols-outlined !text-[18px] mr-1">calendar_today</span>
              Schedule
            </Button>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
               <div className="w-8 h-8 bg-primary text-white font-bold flex items-center justify-center rounded-full uppercase">
                  {user?.name?.charAt(0) || 'U'}
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">{user?.name}</span>
                  <span className="text-xs text-slate-400 leading-tight">{user?.email}</span>
               </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-blue-400 !text-[32px]">school</span>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-md">ACTIVE</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">0</h3>
              <p className="text-sm text-slate-400 font-medium">Enrolled Courses</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-green-400 !text-[32px]">workspace_premium</span>
                <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-md">+12%</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">0</h3>
              <p className="text-sm text-slate-400 font-medium">Completed Courses</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-orange-400 !text-[32px]">trending_up</span>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-md">85%</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">0h</h3>
              <p className="text-sm text-slate-400 font-medium">Learning This Week</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-purple-400 !text-[32px]">emoji_events</span>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-md">TOP 10%</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">0</h3>
              <p className="text-sm text-slate-400 font-medium">Total Points</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center py-12">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-500">menu_book</span>
                 </div>
                 <h3 className="text-white text-lg font-bold mb-2">No active courses</h3>
                 <p className="text-slate-400 text-sm max-w-sm mb-6">
                    You haven't enrolled in any courses yet. Check out the catalog to start learning.
                 </p>
                 <Button onClick={() => window.location.href = '/courses'}>
                    Browse Catalog
                 </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">history</span>
                <p className="text-slate-400 text-sm">No recent activity detected on your account.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Upcoming Tasks */}
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Upcoming</h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center py-6">
                 <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">event_busy</span>
                 <p className="text-slate-400 text-sm">You have no upcoming tasks or deadlines scheduled.</p>
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Study Streak</h3>
                <span className="material-symbols-outlined text-slate-600 !text-[32px]">local_fire_department</span>
              </div>
              <div className="text-center">
                <h2 className="text-5xl font-black text-slate-500 mb-2">0</h2>
                <p className="text-sm text-slate-400 font-medium">Start learning to build a streak!</p>
              </div>
              <div className="flex justify-between mt-6 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                      {/* Empty state for days */}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
