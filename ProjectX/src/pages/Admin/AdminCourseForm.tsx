import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface CategoryOption {
  id: number;
  category_title: string;
  category_slug: string;
}

export default function AdminCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Upload states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Learnings dynamic list
  const [learningsList, setLearningsList] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    course_name: '',
    slug: '',
    category_id: '',
    price: '',
    discount_price: '',
    is_free: false,
    course_duration: '',
    content_hour: '',
    course_mode: 'online',
    course_type: 'basic',
    short_description: '',
    long_description: '',
    thumbnail: '',
    banner_images: '',
    syllabus_file: '',
    status: 1,
    is_featured: false,
    sorting_order: 0,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch course if edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchCourse = async () => {
        try {
          const token = localStorage.getItem('expertTalkz_auth_token');
          const res = await fetch(`/api/admin/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setFormData({
              course_name: data.course_name || '',
              slug: data.slug || '',
              category_id: data.category?.id ? String(data.category.id) : (data.main_category ? String(data.main_category) : ''),
              price: data.price !== null && data.price !== undefined ? String(data.price) : '',
              discount_price: data.discount_price !== null && data.discount_price !== undefined ? String(data.discount_price) : '',
              is_free: Boolean(data.is_free),
              course_duration: data.course_duration || '',
              content_hour: data.content_hour ? String(data.content_hour) : '',
              course_mode: data.course_mode || 'online',
              course_type: data.course_type || 'basic',
              short_description: data.short_description || '',
              long_description: data.long_description || '',
              thumbnail: data.thumbnail || '',
              banner_images: data.banner_images || '',
              syllabus_file: data.syllabus_file || '',
              status: data.status !== undefined ? data.status : 1,
              is_featured: Boolean(data.is_featured && Number(data.is_featured) !== 0),
              sorting_order: data.sorting_order || 0,
            });

            // Parse learnings
            if (data.learnings) {
              try {
                const parsed = JSON.parse(data.learnings);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setLearningsList(parsed);
                } else {
                  setLearningsList(['']);
                }
              } catch {
                setLearningsList([data.learnings]);
              }
            } else {
              setLearningsList(['']);
            }
          } else {
            showToast('Failed to load course details', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Error loading course', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEdit]);

  // Handle standard input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Auto-generate slug from name if creating or if slug is empty
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return {
        ...prev,
        course_name: name,
        slug: !isEdit || !prev.slug ? autoSlug : prev.slug,
      };
    });
  };

  // Learnings bullet points management
  const handleLearningChange = (index: number, val: string) => {
    const updated = [...learningsList];
    updated[index] = val;
    setLearningsList(updated);
  };

  const addLearningPoint = () => {
    setLearningsList([...learningsList, '']);
  };

  const removeLearningPoint = (index: number) => {
    if (learningsList.length === 1) {
      setLearningsList(['']);
      return;
    }
    setLearningsList(learningsList.filter((_, i) => i !== index));
  };

  // Image Upload helper
  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: 'thumbnail' | 'banner_images'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (field === 'thumbnail') setUploadingThumbnail(true);
    if (field === 'banner_images') setUploadingBanner(true);

    const token = localStorage.getItem('expertTalkz_auth_token');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload/courses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
        showToast(`${field === 'thumbnail' ? 'Thumbnail' : 'Banner'} uploaded successfully!`);
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image. Network error.', 'error');
    } finally {
      if (field === 'thumbnail') setUploadingThumbnail(false);
      if (field === 'banner_images') setUploadingBanner(false);
    }
  };

  // Save form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.course_name.trim()) {
      showToast('Please enter a course name', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/courses/${id}` : '/api/admin/courses';

      // Clean learnings
      const cleanedLearnings = learningsList.filter((item) => item.trim() !== '');

      const payload = {
        ...formData,
        learnings: cleanedLearnings,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(isEdit ? 'Course updated successfully!' : 'Course created successfully!');
        setTimeout(() => {
          navigate('/admin/courses');
        }, 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || 'Failed to save course', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading course data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#30363d] pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-[#161b22] border border-[#30363d] hover:border-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isEdit ? `Edit: ${formData.course_name || 'Course'}` : 'Create New Course'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the course details, pricing, syllabus, and media below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Saving Course...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                {isEdit ? 'Save Changes' : 'Publish Course'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-primary border-b border-[#30363d] pb-4">
            <span className="material-symbols-outlined text-xl">info</span>
            <h2 className="text-base font-bold text-white">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.course_name}
                onChange={handleNameChange}
                placeholder="e.g. Advanced Piping Engineering & Stress Analysis"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                URL Slug <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                  /courses/
                </span>
                <input
                  type="text"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="advanced-piping-engineering"
                  className="w-full pl-22 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Main Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Level */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-primary border-b border-[#30363d] pb-4">
            <span className="material-symbols-outlined text-xl">school</span>
            <h2 className="text-base font-bold text-white">Delivery Mode & Level</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Mode
              </label>
              <select
                name="course_mode"
                value={formData.course_mode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="online">Online Live / Recorded</option>
                <option value="offline">Offline Classroom</option>
                <option value="hybrid">Hybrid (Online + Offline)</option>
              </select>
            </div>

            {/* Type/Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Difficulty Level
              </label>
              <select
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="basic">Basic (Beginner)</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Duration
              </label>
              <input
                type="text"
                name="course_duration"
                value={formData.course_duration}
                onChange={handleChange}
                placeholder="e.g. 6 Months / 8 Weeks"
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Content Hours */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Total Hours
              </label>
              <input
                type="number"
                name="content_hour"
                value={formData.content_hour}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Access */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
            <div className="flex items-center gap-2.5 text-primary">
              <span className="material-symbols-outlined text-xl">payments</span>
              <h2 className="text-base font-bold text-white">Pricing & Access</h2>
            </div>

            {/* Free Course Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleChange}
                className="w-4 h-4 rounded text-primary focus:ring-primary bg-[#0d1117] border-[#30363d]"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Make Course 100% Free
              </span>
            </label>
          </div>

          {!formData.is_free && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regular Price */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Regular Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1800.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Standard base price of the course</span>
              </div>

              {/* Discount / Selling Price */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Discount / Offer Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    placeholder="1500.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  Actual price students will pay after discount
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Descriptions */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-primary border-b border-[#30363d] pb-4">
            <span className="material-symbols-outlined text-xl">description</span>
            <h2 className="text-base font-bold text-white">Course Descriptions</h2>
          </div>

          <div className="space-y-6">
            {/* Short Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Short Description (Course Cards & Summary)
              </label>
              <textarea
                name="short_description"
                rows={3}
                value={formData.short_description}
                onChange={handleChange}
                placeholder="A concise 2-3 sentence overview of the course shown on the catalog cards."
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Full Detailed Description / Overview (HTML or Plain Text)
              </label>
              <textarea
                name="long_description"
                rows={6}
                value={formData.long_description}
                onChange={handleChange}
                placeholder="Comprehensive course overview, target audience, syllabus breakdown, and prerequisites."
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary leading-relaxed font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 5: What You'll Learn (Learnings Dynamic List) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
            <div className="flex items-center gap-2.5 text-primary">
              <span className="material-symbols-outlined text-xl">checklist</span>
              <h2 className="text-base font-bold text-white">What You'll Learn (Bullet Points)</h2>
            </div>
            <button
              type="button"
              onClick={addLearningPoint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/25 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Learning Point
            </button>
          </div>

          <div className="space-y-3">
            {learningsList.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono shrink-0">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleLearningChange(index, e.target.value)}
                  placeholder={`e.g. Master Stress Analysis of offshore pipelines and platforms`}
                  className="flex-1 px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeLearningPoint(index)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remove point"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Media & Image Uploaders */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-primary border-b border-[#30363d] pb-4">
            <span className="material-symbols-outlined text-xl">image</span>
            <h2 className="text-base font-bold text-white">Media & Assets Upload</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thumbnail Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Card Thumbnail
              </label>

              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group min-h-[180px]">
                {formData.thumbnail ? (
                  <div className="space-y-3 w-full">
                    <img
                      src={formatImageUrl(formData.thumbnail)}
                      alt="Thumbnail Preview"
                      className="w-full h-36 object-cover rounded-xl border border-[#30363d]"
                    />
                    <div className="flex items-center justify-between gap-2 px-1">
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {formData.thumbnail.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnail: '' }))}
                        className="text-xs text-red-400 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#30363d] flex items-center justify-center mx-auto text-primary">
                      {uploadingThumbnail ? (
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer text-xs font-bold text-primary hover:underline">
                        <span>Click to upload thumbnail</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'thumbnail')}
                          className="hidden"
                          disabled={uploadingThumbnail}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct URL alternative */}
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="Or paste direct image URL (e.g. /uploads/courses/...)"
                className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Header Banner
              </label>

              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group min-h-[180px]">
                {formData.banner_images ? (
                  <div className="space-y-3 w-full">
                    <img
                      src={formatImageUrl(formData.banner_images)}
                      alt="Banner Preview"
                      className="w-full h-36 object-cover rounded-xl border border-[#30363d]"
                    />
                    <div className="flex items-center justify-between gap-2 px-1">
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {formData.banner_images.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, banner_images: '' }))}
                        className="text-xs text-red-400 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#30363d] flex items-center justify-center mx-auto text-primary">
                      {uploadingBanner ? (
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-2xl">panorama</span>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer text-xs font-bold text-primary hover:underline">
                        <span>Click to upload banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'banner_images')}
                          className="hidden"
                          disabled={uploadingBanner}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1">Wide header banner (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct URL alternative */}
              <input
                type="text"
                name="banner_images"
                value={formData.banner_images}
                onChange={handleChange}
                placeholder="Or paste direct banner image URL"
                className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 7: Publishing Settings */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 text-primary border-b border-[#30363d] pb-4">
            <span className="material-symbols-outlined text-xl">tune</span>
            <h2 className="text-base font-bold text-white">Publishing & Organization</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Publication Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value={1}>Published (Visible on Website)</option>
                <option value={0}>Draft (Hidden from Catalog)</option>
              </select>
            </div>

            {/* Sorting Order */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Sort Priority Order (0 = Top / Default)
              </label>
              <input
                type="number"
                name="sorting_order"
                value={formData.sorting_order}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Featured Course Toggle */}
            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between gap-4 md:col-span-2">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-2xl">star</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    Feature in Hero Carousel & Top Picks
                    {formData.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Featured Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Promote this course in the interactive 3D rotating hero carousel on the homepage and at the top of the Courses catalog.
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#30363d]">
          <Link
            to="/admin/courses"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Saving Course...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                {isEdit ? 'Save Changes' : 'Publish Course'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
