import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';

interface RichWordEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichWordEditor({
  value,
  onChange,
  placeholder = 'Start writing your article... Click formatting buttons or use shortcuts (Ctrl+B, Ctrl+I, Ctrl+U).',
}: RichWordEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full my-6 mx-auto border border-white/10 shadow-2xl block',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium hover:text-yellow-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[380px] p-6 sm:p-8 text-slate-200 focus:outline-none leading-relaxed font-sans text-base prose prose-invert max-w-none [&>p]:mb-5 [&>p]:leading-relaxed [&>h1]:text-3xl [&>h1]:font-black [&>h1]:text-white [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-2 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/5 [&>blockquote]:px-5 [&>blockquote]:py-3 [&>blockquote]:rounded-r-xl [&>blockquote]:my-6 [&>blockquote]:italic [&>pre]:bg-[#161b22] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:font-mono [&>code]:bg-white/10 [&>code]:text-primary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>hr]:border-white/10 [&>hr]:my-8',
      },
    },
  });

  // Sync external content update if needed
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-12 bg-[#0d1117] border border-[#30363d] rounded-2xl">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── Image Insertion Handler ──────────────────────────────────────────
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || 'Blog Image' })
      .run();

    setImageUrl('');
    setImageAlt('');
    setImageModalOpen(false);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem('expertTalkz_auth_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        editor
          .chain()
          .focus()
          .setImage({ src: data.url, alt: file.name.replace(/\.[^/.]+$/, '') })
          .run();
        setImageModalOpen(false);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Link Insertion Handler ───────────────────────────────────────────
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkText('');
    setLinkModalOpen(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      if (linkText.trim()) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl.trim()}">${linkText.trim()}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl.trim() })
          .run();
      }
    }
    setLinkModalOpen(false);
  };

  // Word & Character count
  const textContent = editor.state.doc.textContent;
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
      {/* ─── Top Word-Style Ribbon Toolbar ─────────────────────────────── */}
      <div className="bg-[#0d1117] border-b border-[#30363d] p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-300 select-none sticky top-16 z-20 backdrop-blur">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-[#30363d] pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">undo</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">redo</span>
          </button>
        </div>

        {/* Heading / Style Selector */}
        <div className="flex items-center gap-1 border-r border-[#30363d] pr-1.5 mr-0.5">
          <select
            value={
              editor.isActive('heading', { level: 1 })
                ? 'h1'
                : editor.isActive('heading', { level: 2 })
                ? 'h2'
                : editor.isActive('heading', { level: 3 })
                ? 'h3'
                : editor.isActive('heading', { level: 4 })
                ? 'h4'
                : 'p'
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'p') editor.chain().focus().setParagraph().run();
              else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
              else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
              else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
            }}
            className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1 (Main Title)</option>
            <option value="h2">Heading 2 (Section)</option>
            <option value="h3">Heading 3 (Subsection)</option>
            <option value="h4">Heading 4</option>
          </select>
        </div>

        {/* Font Formats: Bold, Italic, Underline, Strikethrough, Code */}
        <div className="flex items-center gap-0.5 border-r border-[#30363d] pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_bold</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_italic</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('underline')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_underlined</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">strikethrough_s</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">code</span>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r border-[#30363d] pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_align_left</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_align_center</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_align_right</span>
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-r border-[#30363d] pr-1.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_list_numbered</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote Callout"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">format_quote</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('codeBlock')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider Line"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">horizontal_rule</span>
          </button>
        </div>

        {/* Hyperlink & Image Insert */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openLinkModal}
            title="Insert Link"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('link')
                ? 'bg-primary text-black font-bold'
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">link</span>
          </button>

          {/* Primary Insert Image Button */}
          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            title="Insert Image (Upload or URL)"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-bold transition-all shadow-sm shadow-primary/10"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {/* ─── Visual Document Canvas ────────────────────────────────────── */}
      <div className="bg-[#0d1117] flex-1 cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* ─── Word & Character Count Bar ───────────────────────────────── */}
      <div className="bg-[#161b22] border-t border-[#30363d] px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span>
            <strong className="text-white font-mono">{wordCount}</strong> words
          </span>
          <span>
            <strong className="text-white font-mono">{charCount}</strong> characters
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          WYSIWYG Mode • Visual Document Editor
        </div>
      </div>

      {/* ─── MODAL: Insert Image Dialog ────────────────────────────────── */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                Insert Image into Document
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Direct Upload Option */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Option 1: Upload from Computer
              </label>
              <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-2xl p-5 text-center">
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-3">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-300 font-medium">Uploading image...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-1">
                    <span className="material-symbols-outlined text-3xl text-primary block">
                      cloud_upload
                    </span>
                    <span className="text-xs font-bold text-primary block hover:underline">
                      Click to choose image file
                    </span>
                    <span className="text-[11px] text-slate-500 block">PNG, JPG, WebP (Max 10MB)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-xs my-2">
              <div className="h-px bg-[#30363d] flex-1" />
              <span>OR</span>
              <div className="h-px bg-[#30363d] flex-1" />
            </div>

            {/* URL Option */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Option 2: Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /uploads/blogs/..."
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Alt Description (Optional)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Piping isometric drawing"
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                />
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
                onClick={handleInsertImage}
                disabled={!imageUrl.trim() || uploadingImage}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-xs shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Insert Link Dialog ─────────────────────────────────── */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">link</span>
                Insert Link
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
                <label className="block text-xs font-bold text-slate-300">Link URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/..."
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              {!editor.state.selection.empty ? null : (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Link Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. Read full guide"
                    className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}
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
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
