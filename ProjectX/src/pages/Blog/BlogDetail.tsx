import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Blog } from '../../types';
import { api } from '../../services/api';
import Section from '../../components/common/Section';
import Meta from '../../components/common/Meta';
import { Calendar, ArrowLeft, Clock, Share2, Check } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (slug) {
        try {
          const data = await api.getBlogBySlug(slug);
          setBlog(data || null);
        } catch (error) {
          console.error('Failed to fetch blog', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBlog();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Estimate reading time
  const getReadingTime = (content?: string) => {
    if (!content) return '3 min read';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center text-center p-6">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <span className="material-symbols-outlined text-3xl">article</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
          <p className="text-sm text-slate-400">
            The article you are looking for does not exist or may have been moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0a0d12] text-slate-200">
      <Meta
        title={`${blog.title} | ExpertTalkz Engineering Blog`}
        description={blog.excerpt || 'Read the latest technical insights on piping, stress analysis, EPC, and engineering design on ExpertTalkz.'}
      />

      {/* Hero Header */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/5 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-primary transition-colors py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
              Technical Guide
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar size={14} className="text-slate-500" />
              <span>{blog.date || 'Recent'}</span>
            </div>
            <span className="text-slate-600 text-xs">•</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock size={14} className="text-slate-500" />
              <span>{getReadingTime(blog.content)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg md:text-xl text-[#9dabb9] leading-relaxed font-normal">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Featured Header Banner Image */}
      {(blog.banner_image || blog.featured_image) && (
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#161b22] aspect-[21/9] max-h-[480px]">
            <img
              src={blog.banner_image || blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Blog Content Area */}
      <Section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Rich Content Renderer */}
          <div
            className="prose prose-invert prose-lg max-w-none 
              text-slate-300 leading-relaxed font-normal
              [&>p]:mb-6 [&>p]:leading-[1.8]
              [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-extrabold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:tracking-tight [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-3
              [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-10 [&>h3]:mb-4
              [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-primary [&>h4]:mt-8 [&>h4]:mb-3
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
              [&>li]:text-slate-300 [&>li]:leading-relaxed
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/5 [&>blockquote]:px-6 [&>blockquote]:py-4 [&>blockquote]:rounded-r-2xl [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-slate-100
              [&>pre]:bg-[#161b22] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-2xl [&>pre]:p-5 [&>pre]:overflow-x-auto [&>pre]:my-8
              [&>pre>code]:text-emerald-400 [&>pre>code]:font-mono [&>pre>code]:text-sm
              [&>code]:bg-white/10 [&>code]:text-primary [&>code]:px-2 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm
              [&>figure]:my-10 [&>figure]:text-center
              [&>figure>img]:rounded-2xl [&>figure>img]:border [&>figure>img]:border-white/10 [&>figure>img]:shadow-2xl [&>figure>img]:max-w-full [&>figure>img]:mx-auto
              [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-slate-400 [&>figure>figcaption]:mt-3 [&>figure>figcaption]:italic
              [&>img]:rounded-2xl [&>img]:border [&>img]:border-white/10 [&>img]:shadow-2xl [&>img]:max-w-full [&>img]:my-8 [&>img]:mx-auto
              [&>hr]:border-white/10 [&>hr]:my-12
              [&>table]:w-full [&>table]:border-collapse [&>table]:my-8 [&>table]:border [&>table]:border-white/10
              [&>table_th]:bg-white/5 [&>table_th]:border [&>table_th]:border-white/10 [&>table_th]:p-3 [&>table_th]:text-left [&>table_th]:font-bold [&>table_th]:text-white
              [&>table_td]:border [&>table_td]:border-white/10 [&>table_td]:p-3 [&>table_td]:text-slate-300
              [&>a]:text-primary [&>a]:underline [&>a]:font-medium hover:[&>a]:text-yellow-300"
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />

          {/* Post Footer & Author Box */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-primary/20 shrink-0">
                ET
              </div>
              <div>
                <div className="font-bold text-white text-sm">ExpertTalkz Editorial Team</div>
                <div className="text-xs text-slate-400">Engineering & Technology Experts</div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-colors"
            >
              <Share2 size={14} />
              {copied ? 'Link Copied!' : 'Share Article'}
            </button>
          </div>
        </div>
      </Section>
    </article>
  );
};

export default BlogDetail;
