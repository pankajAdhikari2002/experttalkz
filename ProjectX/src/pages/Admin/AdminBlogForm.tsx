import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'html'>('editor');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Upload states
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Inline Image Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [inlineImageCaption, setInlineImageCaption] = useState('');
  const [inlineImageAlt, setInlineImageAlt] = useState('');
  const [inlineImageAlignment, setInlineImageAlignment] = useState<'center' | 'left' | 'right'>('center');
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Table Modal State
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Textarea reference for cursor position insertion
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            showToast('Failed to load blog post', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Error loading blog post', 'error');
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

  // ─── Text Insertion & Formatting Helpers ─────────────────────────────
  const insertTextAtCursor = (beforeText: string, afterText: string = '', defaultInside: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content + beforeText + defaultInside + afterText,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.content;
    const selectedText = currentText.substring(start, end) || defaultInside;

    const newContent =
      currentText.substring(0, start) +
      beforeText +
      selectedText +
      afterText +
      currentText.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + beforeText.length + selectedText.length + afterText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  // Quick formatting actions
  const applyFormat = (type: string) => {
    switch (type) {
      case 'h2':
        insertTextAtCursor('\n\n<h2>', '</h2>\n', 'Subheading Title');
        break;
      case 'h3':
        insertTextAtCursor('\n\n<h3>', '</h3>\n', 'Section Header');
        break;
      case 'h4':
        insertTextAtCursor('\n\n<h4>', '</h4>\n', 'Minor Subheading');
        break;
      case 'bold':
        insertTextAtCursor('<strong>', '</strong>', 'bold text');
        break;
      case 'italic':
        insertTextAtCursor('<em>', '</em>', 'italic text');
        break;
      case 'underline':
        insertTextAtCursor('<u>', '</u>', 'underlined text');
        break;
      case 'strike':
        insertTextAtCursor('<s>', '</s>', 'strikethrough text');
        break;
      case 'code':
        insertTextAtCursor('<code>', '</code>', 'code_snippet');
        break;
      case 'quote':
        insertTextAtCursor(
          '\n\n<blockquote>\n  <p>"',
          '"</p>\n  <cite>— Key Takeaway / Source</cite>\n</blockquote>\n',
          'Insert impactful quote or insight here.'
        );
        break;
      case 'codeblock':
        insertTextAtCursor(
          '\n\n<pre><code>\n',
          '\n</code></pre>\n',
          '// Type or paste code here\nfunction example() {\n  return true;\n}'
        );
        break;
      case 'ul':
        insertTextAtCursor(
          '\n<ul>\n  <li>',
          '</li>\n  <li>Key Point 2</li>\n  <li>Key Point 3</li>\n</ul>\n',
          'Key Point 1'
        );
        break;
      case 'ol':
        insertTextAtCursor(
          '\n<ol>\n  <li>',
          '</li>\n  <li>Step 2 Details</li>\n  <li>Step 3 Details</li>\n</ol>\n',
          'Step 1 Details'
        );
        break;
      case 'hr':
        insertTextAtCursor('\n\n<hr />\n\n');
        break;
      case 'callout':
        insertTextAtCursor(
          '\n\n<div class="bg-primary/10 border-l-4 border-primary p-5 rounded-r-2xl my-6">\n  <h4 class="text-primary font-bold mb-1">💡 Pro Engineering Tip</h4>\n  <p class="text-slate-300 text-sm">',
          '</p>\n</div>\n',
          'Always verify stress intensification factors (SIF) according to ASME B31.3 code.'
        );
        break;
      default:
        break;
    }
  };

  // ─── Inline Image Insertion Handler ──────────────────────────────────
  const handleInsertInlineImage = () => {
    if (!inlineImageUrl.trim()) {
      showToast('Please provide an image URL or upload an image', 'error');
      return;
    }

    const cleanUrl = inlineImageUrl.trim();
    const alt = inlineImageAlt.trim() || 'Blog illustration';
    const caption = inlineImageCaption.trim();

    let figureClass = 'my-8 text-center';
    let imgClass = 'rounded-2xl max-w-full mx-auto shadow-2xl border border-white/10';

    if (inlineImageAlignment === 'left') {
      figureClass = 'my-6 md:float-left md:mr-8 md:max-w-sm text-left';
    } else if (inlineImageAlignment === 'right') {
      figureClass = 'my-6 md:float-right md:ml-8 md:max-w-sm text-right';
    }

    let imageHtml = `\n\n<figure class="${figureClass}">\n  <img src="${cleanUrl}" alt="${alt}" class="${imgClass}" />`;
    if (caption) {
      imageHtml += `\n  <figcaption class="text-xs text-slate-400 mt-2.5 italic">${caption}</figcaption>`;
    }
    imageHtml += '\n</figure>\n\n';

    insertTextAtCursor(imageHtml);
    showToast('Image inserted into article!');

    // Reset and close modal
    setInlineImageUrl('');
    setInlineImageCaption('');
    setInlineImageAlt('');
    setInlineImageAlignment('center');
    setImageModalOpen(false);
  };

  // Inline Image File Upload
  const handleInlineFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image (JPG, PNG, WebP)', 'error');
      return;
    }

    setUploadingInlineImage(true);
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
        setInlineImageUrl(data.url);
        if (!inlineImageAlt) {
          setInlineImageAlt(file.name.replace(/\.[^/.]+$/, ''));
        }
        showToast('Image uploaded! You can now adjust caption and insert.');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingInlineImage(false);
    }
  };

  // ─── Link Insertion Handler ──────────────────────────────────────────
  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      showToast('Please provide a URL', 'error');
      return;
    }

    const url = linkUrl.trim();
    const text = linkText.trim() || url;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-yellow-300 font-medium">${text}</a>`;

    insertTextAtCursor(linkHtml);
    setLinkUrl('');
    setLinkText('');
    setLinkModalOpen(false);
  };

  // ─── Table Insertion Handler ─────────────────────────────────────────
  const handleInsertTable = () => {
    const rows = Math.max(1, Math.min(10, tableRows));
    const cols = Math.max(1, Math.min(6, tableCols));

    let tableHtml = '\n\n<table class="w-full border-collapse my-8 border border-white/10 rounded-xl overflow-hidden">\n  <thead>\n    <tr class="bg-white/5">\n';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `      <th class="border border-white/10 p-3 text-left font-bold text-white text-sm">Header ${c}</th>\n`;
    }
    tableHtml += '    </tr>\n  </thead>\n  <tbody>\n';

    for (let r = 1; r <= rows; r++) {
      tableHtml += '    <tr class="hover:bg-white/[0.02]">\n';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `      <td class="border border-white/10 p-3 text-slate-300 text-sm">Row ${r} Col ${c}</td>\n`;
      }
      tableHtml += '    </tr>\n';
    }
    tableHtml += '  </tbody>\n</table>\n\n';

    insertTextAtCursor(tableHtml);
    setTableModalOpen(false);
    showToast('Table inserted!');
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
        showToast(`${field === 'featured_image' ? 'Featured image' : 'Banner'} uploaded successfully!`);
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
      showToast('Please enter a blog title', 'error');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Please write some content for the blog post', 'error');
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
        showToast(isEdit ? 'Blog updated successfully!' : 'Blog created successfully!');
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || 'Failed to save blog post', 'error');
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
        <span className="text-sm text-slate-400 font-medium">Loading blog article...</span>
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
              Draft your article, format headers, and insert images and callouts.
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

          {/* Rich Content Editor Box */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Editor Tabs & Toolbar Header */}
            <div className="bg-[#0d1117] border-b border-[#30363d] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* View Tabs */}
              <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-xl border border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  Write Editor
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Live Preview
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'html'
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  HTML
                </button>
              </div>

              {/* Special Image Button on Top Toolbar */}
              <button
                type="button"
                onClick={() => setImageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/15 text-primary border border-primary/30 text-xs font-bold hover:bg-primary/25 transition-all shadow-sm shadow-primary/10"
              >
                <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                Insert Image in Article
              </button>
            </div>

            {/* Formatting Toolbar (Visible in Editor/HTML tab) */}
            {activeTab !== 'preview' && (
              <div className="bg-[#161b22] border-b border-[#30363d] p-2 flex flex-wrap items-center gap-1.5 text-slate-300">
                {/* Headings */}
                <div className="flex items-center gap-1 border-r border-[#30363d] pr-2 mr-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('h2')}
                    title="Heading 2 (Major Section)"
                    className="px-2 py-1 rounded hover:bg-white/10 text-xs font-black text-white hover:text-primary"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('h3')}
                    title="Heading 3 (Subsection)"
                    className="px-2 py-1 rounded hover:bg-white/10 text-xs font-bold text-white hover:text-primary"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('h4')}
                    title="Heading 4"
                    className="px-2 py-1 rounded hover:bg-white/10 text-xs font-semibold text-white hover:text-primary"
                  >
                    H4
                  </button>
                </div>

                {/* Inline Formats */}
                <div className="flex items-center gap-1 border-r border-[#30363d] pr-2 mr-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    title="Bold"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    title="Italic"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    title="Underline"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_underlined</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('strike')}
                    title="Strikethrough"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">strikethrough_s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('code')}
                    title="Inline Code"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">code</span>
                  </button>
                </div>

                {/* Lists & Blocks */}
                <div className="flex items-center gap-1 border-r border-[#30363d] pr-2 mr-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('ul')}
                    title="Bulleted List"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('ol')}
                    title="Numbered List"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('quote')}
                    title="Blockquote Quote Box"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">format_quote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('callout')}
                    title="Callout Highlight Box"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">lightbulb</span>
                  </button>
                </div>

                {/* Rich Elements: Link, Table, Divider, Image */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(true)}
                    title="Insert Link"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    title="Insert Table"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">table_chart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('codeblock')}
                    title="Code Snippet Block"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">terminal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('hr')}
                    title="Horizontal Divider"
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">horizontal_rule</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: Editor View */}
            {activeTab === 'editor' && (
              <div className="p-4 bg-[#0d1117] flex-1">
                <textarea
                  ref={textareaRef}
                  required
                  name="content"
                  rows={20}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start writing your article here... Use the toolbar above to add bold text, headings, lists, tables, callouts, or insert images anywhere between paragraphs."
                  className="w-full bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-y text-base leading-relaxed font-sans"
                />
              </div>
            )}

            {/* Tab 2: Live Article Preview */}
            {activeTab === 'preview' && (
              <div className="p-6 md:p-10 bg-[#0a0d12] min-h-[500px]">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Article Preview Mode
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-white mt-2 leading-tight">
                      {formData.title || 'Untitled Article'}
                    </h1>
                    {formData.excerpt && (
                      <p className="text-base text-slate-400 mt-2 italic">{formData.excerpt}</p>
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
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-2
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
                      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-1.5
                      [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:space-y-1.5
                      [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/5 [&>blockquote]:px-5 [&>blockquote]:py-3 [&>blockquote]:rounded-r-xl [&>blockquote]:my-6 [&>blockquote]:italic
                      [&>pre]:bg-[#161b22] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:my-6
                      [&>pre>code]:text-emerald-400 [&>pre>code]:font-mono
                      [&>figure]:my-8 [&>figure]:text-center
                      [&>figure>img]:rounded-xl [&>figure>img]:border [&>figure>img]:border-white/10 [&>figure>img]:shadow-xl [&>figure>img]:max-w-full [&>figure>img]:mx-auto
                      [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-slate-400 [&>figure>figcaption]:mt-2 [&>figure>figcaption]:italic
                      [&>img]:rounded-xl [&>img]:border [&>img]:border-white/10 [&>img]:shadow-xl [&>img]:max-w-full [&>img]:my-6 [&>img]:mx-auto
                      [&>hr]:border-white/10 [&>hr]:my-8
                      [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:border [&>table]:border-white/10
                      [&>table_th]:bg-white/5 [&>table_th]:border [&>table_th]:border-white/10 [&>table_th]:p-2.5 [&>table_th]:text-left [&>table_th]:font-bold
                      [&>table_td]:border [&>table_td]:border-white/10 [&>table_td]:p-2.5"
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.content ||
                        '<p class="text-slate-500 italic">No content written yet. Switch to "Write Editor" to start typing.</p>',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Raw HTML View */}
            {activeTab === 'html' && (
              <div className="p-4 bg-[#0d1117] flex-1">
                <textarea
                  name="content"
                  rows={20}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full bg-transparent text-emerald-400 placeholder-slate-600 focus:outline-none resize-y text-xs leading-relaxed font-mono"
                />
              </div>
            )}
          </div>
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

          {/* Featured Image Box */}
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
                      Upload Featured Image
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

      {/* ─── MODAL 1: Insert Inline Image Modal ──────────────────────── */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
              <div className="flex items-center gap-2.5 text-primary">
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <h3 className="text-base font-bold text-white">Insert Image into Article</h3>
              </div>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Option A: Upload File */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Upload from Computer
              </label>
              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-2xl p-4 text-center">
                {uploadingInlineImage ? (
                  <div className="flex items-center justify-center gap-3 py-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-300 font-medium">Uploading image...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-2 space-y-1">
                    <span className="text-xs font-bold text-primary hover:underline block">
                      Click to choose image file
                    </span>
                    <span className="text-[11px] text-slate-500 block">PNG, JPG, WebP, GIF</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInlineFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Option B: Direct URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Image URL
              </label>
              <input
                type="text"
                value={inlineImageUrl}
                onChange={(e) => setInlineImageUrl(e.target.value)}
                placeholder="https://... or /uploads/blogs/..."
                className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Preview if image URL exists */}
            {inlineImageUrl && (
              <div className="rounded-xl overflow-hidden border border-[#30363d] max-h-36 bg-black flex items-center justify-center">
                <img
                  src={formatImageUrl(inlineImageUrl)}
                  alt="Inline Preview"
                  className="max-h-36 object-contain"
                />
              </div>
            )}

            {/* Caption & Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Image Caption</label>
                <input
                  type="text"
                  value={inlineImageCaption}
                  onChange={(e) => setInlineImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Pipe Stress Diagram"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Alignment</label>
                <select
                  value={inlineImageAlignment}
                  onChange={(e) => setInlineImageAlignment(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-medium"
                >
                  <option value="center">Centered (Full Width)</option>
                  <option value="left">Float Left (Wrap Text)</option>
                  <option value="right">Float Right (Wrap Text)</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertInlineImage}
                disabled={!inlineImageUrl.trim() || uploadingInlineImage}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-xs shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Insert Link Modal ──────────────────────────────── */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">link</span>
                Insert Hyperlink
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Read the full engineering report"
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Destination URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/..."
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-5 py-2 rounded-xl bg-primary text-black font-bold text-xs"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Insert Table Modal ─────────────────────────────── */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">table_chart</span>
                Insert Data Table
              </h3>
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Number of Rows</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Number of Columns</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 rounded-xl bg-primary text-black font-bold text-xs"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
