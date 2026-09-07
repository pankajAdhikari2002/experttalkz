import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [enrolledList, setEnrolledList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (location.state?.enrollmentSuccess) {
      setShowSuccessBanner(true);
    }

    const fetchMyCourses = async () => {
      try {
        const courses = await api.getMyCourses();
        setEnrolledList(courses);
      } catch (e) {
        console.error('Failed to load student courses:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [location.state]);

  const enrolledCount = enrolledList.length;

  return (
    <>
      <Meta title="Student Dashboard | ExpertTalkz" description="Track your learning progress and access your enrolled courses." />
      
      <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-20 px-4 md:px-8 pt-8">
        {/* Success Banner on newly confirmed enrollment */}
        {showSuccessBanner && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined !text-[28px]">verified</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Enrollment Confirmed!</h3>
                <p className="text-slate-300 text-sm">
                  Your PayPal payment was verified and your course has been activated below. Welcome aboard!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-slate-400 hover:text-white text-xs uppercase tracking-wider font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-400 font-medium">Here's what's happening with your courses today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <span className="material-symbols-outlined !text-[18px]">explore</span>
                Browse More Courses
              </Button>
            </Link>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
               <div className="w-8 h-8 bg-primary text-black font-black flex items-center justify-center rounded-full uppercase text-sm">
                  {user?.name?.charAt(0) || 'U'}
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">{user?.name}</span>
                  <span className="text-xs text-slate-400 leading-tight">{user?.email}</span>
               </div>
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
              <h3 className="text-3xl font-black text-white mb-1">{enrolledCount}</h3>
              <p className="text-sm text-slate-400 font-medium">Enrolled Courses</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-green-400 !text-[32px]">workspace_premium</span>
                <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-md">VERIFIED</span>
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
                <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-md">PACE</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">Self-Paced</h3>
              <p className="text-sm text-slate-400 font-medium">Lifetime Access</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-purple-400 !text-[32px]">emoji_events</span>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-md">POINTS</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">100</h3>
              <p className="text-sm text-slate-400 font-medium">Member Points</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">My Enrolled Courses</h2>
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {enrolledCount} {enrolledCount === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <Loader />
                </div>
              ) : enrolledList.length > 0 ? (
                <div className="p-6 space-y-4">
                  {enrolledList.map((item: any) => {
                    const c = item.course;
                    const imageUrl = c.thumbnail?.startsWith('http')
                      ? c.thumbnail
                      : c.thumbnail?.includes('/')
                      ? `${window.location.origin}/${c.thumbnail.replace(/^\//, '')}`
                      : null;

                    const enrolledDate = item.enrolled_at
                      ? new Date(item.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Recently';

                    return (
                      <div
                        key={item.enrollment_id || c.id}
                        className="bg-white/5 border border-white/10 hover:border-primary/40 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                            {imageUrl ? (
                              <img src={imageUrl} alt={c.course_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <span className="material-symbols-outlined text-3xl text-primary">school</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                                {c.course_type || 'Engineering'}
                              </span>
                              {item.order_number && (
                                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                  {item.order_number}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                              {c.course_name}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[14px]">schedule</span>
                                {c.course_duration || 'Flexible'}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[14px] text-emerald-400">check_circle</span>
                                Enrolled: {enrolledDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <Link
                            to={`/courses/${c.slug}`}
                            className="bg-primary hover:bg-yellow-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined !text-[16px]">play_circle</span>
                            Access Course
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center py-12">
                   <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                      <span className="material-symbols-outlined text-3xl">menu_book</span>
                   </div>
                   <h3 className="text-white text-lg font-bold mb-2">No active courses yet</h3>
                   <p className="text-slate-400 text-sm max-w-sm mb-6">
                      You haven't enrolled in any courses yet. Browse our comprehensive engineering catalog to get started.
                   </p>
                   <Link to="/courses">
                     <Button>Browse Course Catalog</Button>
                   </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">history</span>
                <p className="text-slate-400 text-sm">
                  {enrolledList.length > 0
                    ? `Enrolled in ${enrolledList.length} ${enrolledList.length === 1 ? 'course' : 'courses'}. Content ready to study!`
                    : 'No recent activity detected on your account.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Upcoming Tasks */}
            <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Student Support</h2>
              </div>
              <div className="p-6 flex flex-col gap-3">
                 <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                   <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                     <span className="material-symbols-outlined text-primary !text-[18px]">support_agent</span>
                     Need Assistance?
                   </div>
                   <p className="text-xs text-slate-400 mb-3">
                     Have questions about your enrollment or curriculum? Our support team is here to help.
                   </p>
                   <Link to="/contact" className="text-xs text-primary font-bold hover:underline">
                     Contact Support &rarr;
                   </Link>
                 </div>
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Study Streak</h3>
                <span className="material-symbols-outlined text-slate-600 !text-[32px]">local_fire_department</span>
              </div>
              <div className="text-center">
                <h2 className="text-5xl font-black text-slate-500 mb-2">1</h2>
                <p className="text-sm text-slate-400 font-medium">Keep learning daily to grow your streak!</p>
              </div>
              <div className="flex justify-between mt-6 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${idx === 0 ? 'bg-primary/20 border-primary/40 text-primary font-bold' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                      {idx === 0 ? '✓' : ''}
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
