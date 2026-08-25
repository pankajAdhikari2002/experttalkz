import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, publishedCourses: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('expertTalkz_auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [coursesRes, blogsRes] = await Promise.all([
          fetch('/api/admin/courses?limit=100', { headers }),
          fetch('/api/admin/blogs?limit=100', { headers }),
        ]);

        let coursesTotal = 0;
        let publishedCount = 0;
        let blogsTotal = 0;

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          coursesTotal = coursesData.total || 0;
          if (Array.isArray(coursesData.items)) {
            publishedCount = coursesData.items.filter((c: any) => c.status === 1).length;
          }
        }

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          blogsTotal = blogsData.total || 0;
        }

        setStats({
          courses: coursesTotal,
          publishedCourses: publishedCount,
          blogs: blogsTotal,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.courses,
      subtitle: `${stats.publishedCourses} Published & Active`,
      icon: 'menu_book',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      link: '/admin/courses',
      actionText: 'Manage Courses',
    },
    {
      title: 'Total Blog Posts',
      value: stats.blogs,
      subtitle: 'Published & Draft Articles',
      icon: 'article',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      link: '/admin/blogs',
      actionText: 'Manage Blogs',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border border-[#30363d] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              ExpertTalkz Admin Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back to your Control Center
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manage your engineering courses, upload media assets, publish curriculum updates, and track your platform content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create Course
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-[#30363d] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
              Live Site
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">insights</span>
          Catalog Metrics
        </h2>

        {loading ? (
          <div className="flex h-36 items-center justify-center bg-[#161b22] border border-[#30363d] rounded-2xl">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between hover:border-slate-500 transition-all group shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-3xl font-black text-white">{card.value}</p>
                    <p className="text-xs text-slate-400">{card.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#21262d] flex items-center justify-between">
                  <Link
                    to={card.link}
                    className="text-xs font-bold text-primary hover:text-yellow-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    {card.actionText}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
