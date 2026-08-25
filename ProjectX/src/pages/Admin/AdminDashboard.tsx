import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch counts in parallel
        const [coursesRes, blogsRes] = await Promise.all([
          fetch('/api/admin/courses?limit=1', { headers }),
          fetch('/api/admin/blogs?limit=1', { headers }),
        ]);

        if (coursesRes.ok && blogsRes.ok) {
          const coursesData = await coursesRes.json();
          const blogsData = await blogsRes.json();
          
          setStats({
            courses: coursesData.total || 0,
            blogs: blogsData.total || 0,
          });
        }
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
      icon: 'menu_book',
      color: 'bg-blue-500/10 text-blue-500',
      link: '/admin/courses',
    },
    {
      title: 'Total Blogs',
      value: stats.blogs,
      icon: 'article',
      color: 'bg-green-500/10 text-green-500',
      link: '/admin/blogs',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="group flex items-center gap-6 rounded-xl border border-gray-700 bg-gray-800 p-6 transition-colors hover:border-gray-600"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${card.color}`}>
                <span className="material-symbols-outlined text-3xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
