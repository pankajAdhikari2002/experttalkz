import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RichWordEditor from '../../components/common/RichWordEditor';

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Upload states for Card Featured Image and Header Banner
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    banner_image: '',
    status: 'draft',
    is_featured: false,
    published_at: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch blog data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem('expertTalkz_auth_token');
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
              banner_image: data.banner_image || '',
              status: data.status || 'draft',
              is_featured: Boolean(data.is_featured),
              published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 10) : '',
            });
          } else {
            showToast('Failed to load blog article', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Error loading blog article', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

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

  // Auto-generate slug from title
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return {
        ...prev,
        title,
        slug: !isEdit || !prev.slug ? autoSlug : prev.slug,
      };
    });
  };

  // ─── Featured & Banner Image Uploaders ────────────────────────────────
  const handleMediaUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: 'featured_image' | 'banner_image'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (field === 'featured_image') setUploadingFeatured(true);
    if (field === 'banner_image') setUploadingBanner(true);

    const token = localStorage.getItem('expertTalkz_auth_token');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
        showToast(`${field === 'featured_image' ? 'Thumbnail' : 'Banner'} uploaded successfully!`);
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image', 'error');
    } finally {
      if (field === 'featured_image') setUploadingFeatured(false);
      if (field === 'banner_image') setUploadingBanner(false);
    }
  };

  // ─── Form Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter an article title', 'error');
      return;
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      showToast('Please write some content for the article', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
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
        showToast(isEdit ? 'Article updated successfully!' : 'Article published successfully!');
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || 'Failed to save article', 'error');
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
        <span className="text-sm text-slate-400 font-medium">Loading article...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
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
            onClick={() => navigate('/admin/blogs')}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-[#161b22] border border-[#30363d] hover:border-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isEdit ? `Edit: ${formData.title || 'Blog Post'}` : 'Write New Blog Article'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual Word-style editor. Type, format text, and insert images with one click.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs"
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
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                {isEdit ? 'Save Changes' : 'Publish Article'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column Editor (8 cols) + Right Column Meta (4 cols) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Writing Space */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 7 Key Concepts Every Piping Stress Engineer Must Know"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-primary font-bold tracking-tight"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                URL Slug <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                  /blog/
                </span>
                <input
                  type="text"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="key-concepts-piping-stress-engineers"
                  className="w-full pl-16 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Tab Switcher: Word Editor vs Live Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-xl border border-[#30363d]">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit_document</span>
                Document Editor
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                Live Preview
              </button>
            </div>

            <span className="text-xs text-slate-500 hidden sm:block">
              {activeTab === 'editor' ? '✍️ Type directly like in MS Word' : '👁️ Public Page Preview'}
            </span>
          </div>

          {/* Word-Style WYSIWYG Document Editor */}
          {activeTab === 'editor' ? (
            <RichWordEditor
              value={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Click here and start typing your article... Highlight text for formatting or click 'Add Image' to insert pictures."
            />
          ) : (
            /* Live Preview Canvas */
            <div className="bg-[#0a0d12] border border-[#30363d] rounded-2xl p-6 md:p-10 shadow-2xl min-h-[450px]">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Live Article Preview
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white mt-2 leading-tight">
                    {formData.title || 'Untitled Article'}
                  </h1>
                  {formData.excerpt && (
                    <p className="text-base text-slate-400 mt-2 italic leading-relaxed">
                      {formData.excerpt}
                    </p>
                  )}
                </div>

                {formData.featured_image && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] max-h-[300px]">
                    <img
                      src={formatImageUrl(formData.featured_image)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Rendered HTML Content */}
                <div
                  className="prose prose-invert max-w-none text-slate-300 leading-relaxed
                    [&>p]:mb-5 [&>p]:leading-relaxed
                    [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mt-8 [&>h1]:mb-4
                    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-2
                    [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
                    [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-1.5
                    [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:space-y-1.5
                    [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/5 [&>blockquote]:px-5 [&>blockquote]:py-3 [&>blockquote]:rounded-r-xl [&>blockquote]:my-6 [&>blockquote]:italic
                    [&>pre]:bg-[#161b22] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:my-6
                    [&>img]:rounded-2xl [&>img]:border [&>img]:border-white/10 [&>img]:shadow-xl [&>img]:max-w-full [&>img]:my-6 [&>img]:mx-auto
                    [&>hr]:border-white/10 [&>hr]:my-8"
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content ||
                      '<p class="text-slate-500 italic">No content written yet. Switch to Document Editor to start typing.</p>',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar & Post Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center gap-2 text-primary border-b border-[#30363d] pb-3 font-bold text-sm">
              <span className="material-symbols-outlined text-lg">publish</span>
              Publication Settings
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Private / Work in progress)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Featured Post Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-3 rounded-xl bg-[#0d1117] border border-[#30363d]">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 rounded text-primary focus:ring-primary bg-[#161b22] border-[#30363d]"
              />
              <div>
                <span className="text-xs font-bold text-white block">Feature on Homepage</span>
                <span className="text-[11px] text-slate-400 block">Highlight in hero & top lists</span>
              </div>
            </label>

            {/* Publish Date */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Publication Date
              </label>
              <input
                type="date"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-primary border-b border-[#30363d] pb-3 font-bold text-sm">
              <span className="material-symbols-outlined text-lg">short_text</span>
              Article Excerpt / Summary
            </div>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short 2-line summary for article cards and Google search snippet."
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary leading-relaxed"
            />
          </div>

          {/* Featured Image (Card Thumbnail) Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-lg">image</span>
                Card Thumbnail
              </div>
              {formData.featured_image && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, featured_image: '' }))}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {formData.featured_image ? (
              <div className="rounded-xl overflow-hidden border border-[#30363d] aspect-[16/9] relative">
                <img
                  src={formatImageUrl(formData.featured_image)}
                  alt="Featured Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-xl p-5 text-center">
                {uploadingFeatured ? (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-400">Uploading...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <span className="material-symbols-outlined text-3xl text-primary block">
                      cloud_upload
                    </span>
                    <span className="text-xs font-bold text-primary block hover:underline">
                      Upload Card Image
                    </span>
                    <span className="text-[10px] text-slate-500 block">PNG, JPG, WebP (Max 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaUpload(e, 'featured_image')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <input
              type="text"
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              placeholder="Or direct image URL (/uploads/blogs/...)"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Banner Image Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-lg">panorama</span>
                Header Banner
              </div>
              {formData.banner_image && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, banner_image: '' }))}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {formData.banner_image ? (
              <div className="rounded-xl overflow-hidden border border-[#30363d] aspect-[21/9] relative">
                <img
                  src={formatImageUrl(formData.banner_image)}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-xl p-5 text-center">
                {uploadingBanner ? (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-400">Uploading...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <span className="material-symbols-outlined text-3xl text-primary block">
                      add_photo_alternate
                    </span>
                    <span className="text-xs font-bold text-primary block hover:underline">
                      Upload Header Banner
                    </span>
                    <span className="text-[10px] text-slate-500 block">Wide banner (Max 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaUpload(e, 'banner_image')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <input
              type="text"
              name="banner_image"
              value={formData.banner_image}
              onChange={handleChange}
              placeholder="Or direct banner URL"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
