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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined !text-[18px] mr-1">calendar_today</span>
              Schedule
            </Button>
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
              <h3 className="text-3xl font-black text-white mb-1">4</h3>
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
              <h3 className="text-3xl font-black text-white mb-1">2</h3>
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
              <h3 className="text-3xl font-black text-white mb-1">24h</h3>
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
              <h3 className="text-3xl font-black text-white mb-1">1,240</h3>
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
              <div className="p-6">
                <div className="relative flex min-h-[280px] flex-col gap-6 overflow-hidden rounded-xl items-start justify-end p-8 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border border-primary/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="z-10 flex flex-col gap-3 text-left max-w-2xl">
                    <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase w-fit tracking-widest">Module 4 • Lesson 12</span>
                    <h3 className="text-white text-2xl font-black">Advanced React Patterns & Custom Hooks</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                      <span className="material-symbols-outlined !text-[16px]">schedule</span>
                      <span>45 min remaining</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <Button size="sm" className="w-fit mt-2">
                      <span className="material-symbols-outlined !text-[18px] mr-1">play_arrow</span>
                      Resume Learning
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {[
                  { icon: 'check_circle', color: 'green', title: 'Completed "State Management" quiz', time: '2 hours ago' },
                  { icon: 'star', color: 'yellow', title: 'Earned "React Master" badge', time: '1 day ago' },
                  { icon: 'comment', color: 'blue', title: 'New comment on your discussion post', time: '2 days ago' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl bg-${activity.color}-500/10 flex items-center justify-center text-${activity.color}-400`}>
                      <span className="material-symbols-outlined !text-[20px]">{activity.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
              <div className="p-6 flex flex-col gap-4">
                {[
                  { type: 'QUIZ', title: 'SEO Strategy', due: 'Tomorrow', color: 'orange' },
                  { type: 'ASSIGNMENT', title: 'Build Portfolio Site', due: 'In 3 days', color: 'blue' },
                  { type: 'LIVE', title: 'Q&A Session', due: 'Friday 3PM', color: 'red' },
                ].map((task, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 bg-${task.color}-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className={`text-xs font-black text-${task.color}-400`}>{task.type}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{task.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined !text-[12px]">schedule</span>
                        {task.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Study Streak</h3>
                <span className="material-symbols-outlined text-primary !text-[32px]">local_fire_department</span>
              </div>
              <div className="text-center">
                <h2 className="text-5xl font-black text-primary mb-2">7</h2>
                <p className="text-sm text-slate-400 font-medium">Days in a row!</p>
              </div>
              <div className="flex justify-between mt-6 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg ${idx < 5 ? 'bg-primary' : 'bg-white/5'} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white !text-[16px]">check</span>
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
