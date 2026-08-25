import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/admin/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              title: data.title || '',
              slug: data.slug || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              featured_image: data.featured_image || '',
              status: data.status || 'draft',
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, featured_image: data.url }));
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/blogs/${id}` : '/api/admin/blogs';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/admin/blogs');
      } else {
        alert('Failed to save blog');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Blog' : 'Create New Blog'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Blog Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Slug (URL) *</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Featured Image</label>
          <div className="flex items-start gap-4">
            {formData.featured_image && (
              <img src={formData.featured_image} alt="Preview" className="h-24 w-32 object-cover rounded border border-gray-700" />
            )}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">OR</span>
                <label className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                  Upload new image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Content (HTML)</label>
          <textarea
            name="content"
            rows={15}
            value={formData.content}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
            placeholder="<p>Write your blog content here in HTML format...</p>"
          />
          <p className="text-xs text-gray-500">Currently using basic HTML input. You can integrate a Rich Text Editor later.</p>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-black hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
