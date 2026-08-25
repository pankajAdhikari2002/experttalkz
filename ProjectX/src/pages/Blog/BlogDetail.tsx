import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Blog } from '../../types';
import { api } from '../../services/api';
import Meta from '../../components/common/Meta';
import { Calendar, ArrowLeft, Clock, Share2, Check, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = (totalScroll / windowHeight) * 100;
        setScrollProgress(scroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      if (slug) {
        setLoading(true);
        try {
          const [currentBlog, allBlogs] = await Promise.all([
            api.getBlogBySlug(slug),
            api.getBlogs(),
          ]);

          setBlog(currentBlog || null);

          if (allBlogs && currentBlog) {
            const others = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);
            setRelatedBlogs(others);
          }
        } catch (error) {
          console.error('Failed to fetch blog', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBlogAndRelated();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getReadingTime = (content?: string) => {
    if (!content) return '3 min read';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return '/Cointainer/5 Soft Skill.png';
    if (url.startsWith('http')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Loading engineering article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-center p-6">
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
            <ArrowLeft size={16} /> Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#07090e] text-slate-200">
      <Meta
        title={`${blog.title} | ExpertTalkz Engineering Journal`}
        description={blog.excerpt || 'Read this in-depth engineering article and technical guide on ExpertTalkz.'}
      />

      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-primary via-yellow-400 to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ─── Header & Meta ────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-14 md:pt-40 md:pb-20 border-b border-white/5 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">{blog.title}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-primary transition-colors py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Tags & Time */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Technical Guide
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar size={13} className="text-slate-500" />
              <span>{blog.date || 'Recent'}</span>
            </div>
            <span className="text-slate-600 text-xs">•</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={13} className="text-slate-500" />
              <span>{getReadingTime(blog.content)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white leading-[1.18] tracking-tight mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal border-l-2 border-primary/50 pl-4 my-6">
              {blog.excerpt}
            </p>
          )}

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-amber-400 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-primary/20">
              ET
            </div>
            <div>
              <div className="text-xs font-bold text-white">ExpertTalkz Engineering Team</div>
              <div className="text-[11px] text-slate-400">Verified Technical Publication</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hero Banner Image (If present) ───────────────────────────── */}
      {(blog.banner_image || blog.featured_image) && (
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#121620] aspect-[21/9] max-h-[460px]">
            <img
              src={formatImageUrl(blog.banner_image || blog.featured_image)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ─── Main Article Body ────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6">
          {/* Formatted Content */}
          <div
            className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-normal
              [&>p]:mb-6 [&>p]:leading-[1.85] [&>p]:text-base [&>p]:sm:text-lg
              [&>h1]:text-3xl [&>h1]:sm:text-4xl [&>h1]:font-black [&>h1]:text-white [&>h1]:mt-12 [&>h1]:mb-6
              [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:tracking-tight [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-3
              [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-10 [&>h3]:mb-4
              [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-primary [&>h4]:mt-8 [&>h4]:mb-3
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2.5
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2.5
              [&>li]:text-slate-300 [&>li]:leading-relaxed
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-primary/10 [&>blockquote]:px-6 [&>blockquote]:py-4 [&>blockquote]:rounded-r-2xl [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-slate-100
              [&>pre]:bg-[#121620] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-2xl [&>pre]:p-5 [&>pre]:overflow-x-auto [&>pre]:my-8
              [&>pre>code]:text-emerald-400 [&>pre>code]:font-mono [&>pre>code]:text-sm
              [&>code]:bg-white/10 [&>code]:text-primary [&>code]:px-2 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm
              [&>figure]:my-10 [&>figure]:text-center
              [&>figure>img]:rounded-2xl [&>figure>img]:border [&>figure>img]:border-white/10 [&>figure>img]:shadow-2xl [&>figure>img]:max-w-full [&>figure>img]:mx-auto
              [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-slate-400 [&>figure>figcaption]:mt-3 [&>figure>figcaption]:italic
              [&>img]:rounded-2xl [&>img]:border [&>img]:border-white/10 [&>img]:shadow-2xl [&>img]:max-w-full [&>img]:my-8 [&>img]:mx-auto
              [&>hr]:border-white/10 [&>hr]:my-12
              [&>table]:w-full [&>table]:border-collapse [&>table]:my-8 [&>table]:border [&>table]:border-white/10
              [&>table_th]:bg-white/5 [&>table_th]:border [&>table_th]:border-white/10 [&>table_th]:p-3.5 [&>table_th]:text-left [&>table_th]:font-bold [&>table_th]:text-white
              [&>table_td]:border [&>table_td]:border-white/10 [&>table_td]:p-3.5 [&>table_td]:text-slate-300
              [&>a]:text-primary [&>a]:underline [&>a]:font-semibold hover:[&>a]:text-yellow-300"
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />

          {/* ─── Author Box & Share CTA ──────────────────────────────── */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#121620] border border-white/5 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                ET
              </div>
              <div>
                <div className="font-bold text-white text-base">ExpertTalkz Editorial Team</div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Authoritative engineering insights curated by industry instructors and senior consultants.
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-yellow-400 text-black font-bold text-xs shadow-lg shadow-primary/20 transition-all shrink-0 cursor-pointer"
            >
              <Share2 size={15} />
              {copied ? 'Link Copied!' : 'Share This Guide'}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Keep Reading / Related Articles Section ─────────────────── */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 border-t border-white/5 bg-[#0b0e15]">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={22} className="text-primary" />
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Continue Reading
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>View all articles</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className="group flex flex-col bg-[#121620] border border-white/10 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#161c28] relative">
                    <img
                      src={formatImageUrl(item.featured_image || item.banner_image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-500" />
                        <span>{item.date || 'Recent'}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-primary pt-2 border-t border-white/5">
                      <span>Read Guide</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogDetail;
