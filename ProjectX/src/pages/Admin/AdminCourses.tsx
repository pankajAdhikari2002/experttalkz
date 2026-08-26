import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CourseItem {
  id: number;
  course_name: string;
  slug: string;
  price: number;
  discount_price?: number;
  is_free: number;
  course_duration?: string;
  course_mode?: string;
  course_type?: string;
  thumbnail?: string;
  status: number;
  is_featured: number | boolean;
  sorting_order: number;
  created_at: string;
  category?: {
    id: number;
    category_title: string;
    category_slug: string;
  };
}

interface CategoryOption {
  id: number;
  category_title: string;
  category_slug: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== '') params.append('status', statusFilter);
      if (categoryFilter !== '') params.append('category', categoryFilter);

      const res = await fetch(`/api/admin/courses?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data.items || []);
      } else if (res.status === 401 || res.status === 403) {
        showToast('Unauthorized. Please log in again.', 'error');
      } else {
        showToast('Failed to load courses', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while loading courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter]);

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    // Optimistic UI update
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/courses/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast(newStatus === 1 ? 'Course published!' : 'Course moved to draft');
      } else {
        // Revert on failure
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c))
        );
        showToast('Failed to update course status', 'error');
      }
    } catch (err) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c))
      );
      showToast('Network error updating status', 'error');
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: any) => {
    const isCurrentlyFeatured = Boolean(currentFeatured && Number(currentFeatured) !== 0);
    const newFeatured = isCurrentlyFeatured ? 0 : 1;

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_featured: newFeatured } : c))
    );

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/courses/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_featured: newFeatured }),
      });

      if (res.ok) {
        showToast(
          newFeatured === 1
            ? 'Course promoted to Featured carousel & top banner ⭐'
            : 'Course removed from Featured section'
        );
      } else {
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_featured: isCurrentlyFeatured ? 1 : 0 } : c))
        );
        showToast('Failed to update featured status', 'error');
      }
    } catch (err) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_featured: isCurrentlyFeatured ? 1 : 0 } : c))
      );
      showToast('Network error updating featured status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/courses/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== deleteModal.id));
        showToast(`Course "${deleteModal.name}" deleted successfully`);
        setDeleteModal(null);
      } else {
        showToast('Failed to delete course', 'error');
      }
    } catch (err) {
      showToast('Network error while deleting course', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Format thumbnail image URL
  const formatImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  // Metrics
  const totalCourses = courses.length;
  const publishedCount = courses.filter((c) => c.status === 1).length;
  const draftCount = totalCourses - publishedCount;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-bounce ${
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
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </span>
            Courses Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, organize, and publish courses in your catalog.
          </p>
        </div>

        <Link
          to="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create New Course
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">collections_bookmark</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalCourses}</div>
            <div className="text-xs text-slate-400 font-medium">Total Courses</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{publishedCount}</div>
            <div className="text-xs text-slate-400 font-medium">Published & Live</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">edit_note</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{draftCount}</div>
            <div className="text-xs text-slate-400 font-medium">Drafts / Inactive</div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by course title or slug..."
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="1">Published</option>
            <option value="0">Draft</option>
          </select>

          {(search || statusFilter !== '' || categoryFilter !== '') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0d1117] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#30363d] select-none">
              <tr>
                <th className="px-6 py-4 font-bold">Course Details</th>
                <th className="px-4 py-4 font-bold">Category</th>
                <th className="px-4 py-4 font-bold">Mode & Level</th>
                <th className="px-4 py-4 font-bold">Pricing</th>
                <th className="px-4 py-4 font-bold">Featured</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-sm text-slate-400">Loading courses catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#30363d] flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-3xl">search_off</span>
                      </div>
                      <div className="font-bold text-white text-base">No courses found</div>
                      <p className="text-xs text-slate-400">
                        {search || statusFilter || categoryFilter
                          ? 'Try adjusting your search filters to find what you are looking for.'
                          : 'Get started by creating your first course in the platform!'}
                      </p>
                      <Link
                        to="/admin/courses/new"
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black font-bold text-xs"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        Create Course
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => {
                  const isFeatured = Boolean(course.is_featured && Number(course.is_featured) !== 0);

                  return (
                    <tr key={course.id} className="hover:bg-[#1f242c] transition-colors group">
                      {/* Course Name & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-10 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shrink-0 flex items-center justify-center relative">
                            {course.thumbnail ? (
                              <img
                                src={formatImageUrl(course.thumbnail)}
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
                              to={`/admin/courses/${course.id}/edit`}
                              className="font-semibold text-white hover:text-primary transition-colors line-clamp-1 block text-sm"
                            >
                              {course.course_name}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-mono">
                                /{course.slug}
                              </span>
                              {course.course_duration && (
                                <>
                                  <span className="text-slate-600 text-xs">•</span>
                                  <span className="text-[11px] text-slate-400">
                                    {course.course_duration}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        {course.category ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                            {course.category.category_title}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Uncategorized</span>
                        )}
                      </td>

                      {/* Mode & Level */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {course.course_mode || 'Online'}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {course.course_type || 'Basic'} Level
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-4 py-4">
                        {course.is_free ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                            FREE
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">
                              ₹{course.discount_price !== null && course.discount_price !== undefined ? course.discount_price : course.price}
                            </span>
                            {course.discount_price && course.discount_price < course.price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ₹{course.price}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(course.id, course.is_featured)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                            isFeatured
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 shadow-sm shadow-amber-500/10'
                              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200 hover:bg-white/10'
                          }`}
                          title={isFeatured ? 'Click to remove from Featured' : 'Click to mark as Featured'}
                        >
                          <span className={`material-symbols-outlined text-sm ${isFeatured ? 'text-amber-400' : 'text-slate-500'}`}>
                            star
                          </span>
                          <span>{isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleStatus(course.id, course.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            course.status === 1
                              ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${course.status === 1 ? 'bg-green-400' : 'bg-amber-400'}`} />
                          {course.status === 1 ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/courses/${course.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview public page"
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </a>

                          <Link
                            to={`/admin/courses/${course.id}/edit`}
                            title="Edit course"
                            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>

                          <button
                            onClick={() => setDeleteModal({ id: course.id, name: course.course_name })}
                            title="Delete course"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              <h3 className="text-lg font-bold text-white">Delete Course</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteModal.name}"</strong>? This action cannot be undone.
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
                  'Delete Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
