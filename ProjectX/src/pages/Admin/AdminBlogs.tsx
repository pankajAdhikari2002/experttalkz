import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  banner_image?: string;
  status: string;
  is_featured: number;
  published_at?: string;
  created_at: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== '') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/blogs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBlogs(data.items || []);
      } else {
        showToast('Failed to load blog articles', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while loading blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    // Optimistic UI update
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/blogs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast(newStatus === 'published' ? 'Article published live!' : 'Article moved to drafts');
      } else {
        setBlogs((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: currentStatus } : b))
        );
        showToast('Failed to update article status', 'error');
      }
    } catch (err) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: currentStatus } : b))
      );
      showToast('Network error updating status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/blogs/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== deleteModal.id));
        showToast(`Article "${deleteModal.title}" deleted successfully`);
        setDeleteModal(null);
      } else {
        showToast('Failed to delete article', 'error');
      }
    } catch (err) {
      showToast('Network error while deleting article', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  const totalBlogs = blogs.length;
  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = totalBlogs - publishedCount;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-[#1b2a20] border-green-500/30 text-green-400'
              : 'bg-[#2a1b1b] border-red-500/30 text-red-400'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl">article</span>
            </span>
            Blog Articles Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Write, format, publish, and manage engineering blogs & technical articles.
          </p>
        </div>

        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span className="material-symbols-outlined text-xl">edit_square</span>
          Write New Article
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">library_books</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalBlogs}</div>
            <div className="text-xs text-slate-400 font-medium">Total Articles</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{publishedCount}</div>
            <div className="text-xs text-slate-400 font-medium">Published & Live</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">draw</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{draftCount}</div>
            <div className="text-xs text-slate-400 font-medium">Drafts / Inactive</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search articles by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {(search || statusFilter !== '') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Blogs Data Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0d1117] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#30363d] select-none">
              <tr>
                <th className="px-6 py-4 font-bold">Article Details</th>
                <th className="px-4 py-4 font-bold">Date</th>
                <th className="px-4 py-4 font-bold">Featured</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-sm text-slate-400">Loading blog articles...</span>
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#30363d] flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-3xl">article</span>
                      </div>
                      <div className="font-bold text-white text-base">No blog articles found</div>
                      <p className="text-xs text-slate-400">
                        {search || statusFilter
                          ? 'Try adjusting your search or filters to see more results.'
                          : 'Share your first technical blog post with your students!'}
                      </p>
                      <Link
                        to="/admin/blogs/new"
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black font-bold text-xs"
                      >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                        Write Article
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#1f242c] transition-colors group">
                    {/* Title & Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shrink-0 flex items-center justify-center relative">
                          {blog.featured_image ? (
                            <img
                              src={formatImageUrl(blog.featured_image)}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-slate-600 text-lg">image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/blogs/${blog.id}/edit`}
                            className="font-semibold text-white group-hover:text-primary transition-colors truncate block max-w-xs md:max-w-md"
                          >
                            {blog.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-slate-400 truncate">
                              /blog/{blog.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : new Date(blog.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                    </td>

                    {/* Featured Badge */}
                    <td className="px-4 py-4">
                      {blog.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-xs">star</span>
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(blog.id, blog.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          blog.status === 'published'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Preview public article"
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </a>

                        <Link
                          to={`/admin/blogs/${blog.id}/edit`}
                          title="Edit article"
                          className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>

                        <button
                          onClick={() => setDeleteModal({ id: blog.id, title: blog.title })}
                          title="Delete article"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h3 className="text-lg font-bold text-white">Delete Blog Post</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteModal.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Article'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
