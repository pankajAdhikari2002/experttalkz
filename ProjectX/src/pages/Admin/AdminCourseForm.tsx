import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    course_name: '',
    slug: '',
    short_description: '',
    price: '',
    course_mode: 'online',
    course_type: 'basic',
    thumbnail: '',
    status: 1,
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCourse = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/admin/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              course_name: data.course_name || '',
              slug: data.slug || '',
              short_description: data.short_description || '',
              price: data.price || '',
              course_mode: data.course_mode || 'online',
              course_type: data.course_type || 'basic',
              thumbnail: data.thumbnail || '',
              status: data.status !== undefined ? data.status : 1,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
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
      const res = await fetch('/api/upload/courses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
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
      const url = isEdit ? `/api/admin/courses/${id}` : '/api/admin/courses';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/admin/courses');
      } else {
        alert('Failed to save course');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Course Name *</label>
            <input
              type="text"
              name="course_name"
              required
              value={formData.course_name}
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value={1}>Published</option>
              <option value={0}>Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Short Description</label>
          <textarea
            name="short_description"
            rows={3}
            value={formData.short_description}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Thumbnail</label>
          <div className="flex items-start gap-4">
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Thumbnail preview" className="h-24 w-32 object-cover rounded border border-gray-700" />
            )}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
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
            {saving ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
