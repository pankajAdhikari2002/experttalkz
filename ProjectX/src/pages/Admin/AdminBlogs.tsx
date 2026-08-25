import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/blogs?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setBlogs((prev) => prev.filter((b: any) => b.id !== id));
      } else {
        alert('Failed to delete blog');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const res = await fetch(`/api/admin/blogs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b: any) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-black hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Blog
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 text-xs uppercase text-gray-400 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium">Blog Post</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">Loading...</td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">No blogs found.</td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {blog.featured_image ? (
                        <img src={blog.featured_image} alt="" className="h-10 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-gray-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-500">image</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{blog.title}</div>
                        <div className="text-xs text-gray-500">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(blog.id, blog.status)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                        blog.status === 'published'
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      }`}
                    >
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/blogs/${blog.id}/edit`}
                        className="rounded bg-gray-700 p-1.5 text-gray-400 hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="rounded bg-gray-700 p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
  );
}
