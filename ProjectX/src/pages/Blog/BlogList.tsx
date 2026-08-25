import { useEffect, useState, useMemo } from 'react';
import type { Blog } from '../../types';
import { api } from '../../services/api';
import Meta from '../../components/common/Meta';
import { Calendar, Clock, ArrowRight, Search, Sparkles, BookOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs();
        // Only show published articles if status is present
        const published = (data || []).filter((b: any) => !b.status || b.status === 'published');
        setBlogs(published);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        searchQuery === '' ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [blogs, searchQuery, selectedTag]);

  // Featured Hero Article (only if explicitly marked as featured)
  const featuredBlog = useMemo(() => {
    if (blogs.length === 0) return null;
    return blogs.find((b: any) => Boolean(b.is_featured && Number(b.is_featured) !== 0)) || null;
  }, [blogs]);

  // Regular grid articles (excluding hero if featured article exists and no search query)
  const gridBlogs = useMemo(() => {
    if (searchQuery.trim()) return filteredBlogs;
    if (featuredBlog) {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, searchQuery]);

  const getReadingTime = (content?: string) => {
    if (!content) return '4 min read';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return '/Cointainer/5 Soft Skill.png';
    if (url.startsWith('http')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  const categories = ['All', 'Piping & Stress', 'EPC Engineering', 'Design Software', 'Career Guide'];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      <Meta
        title="Engineering Insights & Industry Blog | ExpertTalkz"
        description="Explore in-depth technical guides, piping stress analysis insights, EPC project workflows, and career strategies written by industry specialists."
      />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden border-b border-white/5">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 left-10 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-inner">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>ExpertTalkz Engineering Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Insights, Blueprints & <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-primary bg-clip-text text-transparent">
              Engineering Expertise
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Dive deep into industrial piping design, stress analysis, EPC practices, and modern engineering software workflows.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-xl mx-auto relative mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search articles by topic, keywords, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-[#12161f] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === cat
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Content Container ───────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
              <span className="text-sm text-slate-400 font-medium">Loading articles...</span>
            </div>
          ) : (
            <>
              {/* ─── Featured Hero Magazine Post (When no search query) ── */}
              {featuredBlog && !searchQuery.trim() && (
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Featured Story
                    </span>
                  </div>

                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className="group block relative rounded-3xl overflow-hidden bg-[#121620] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-2xl hover:shadow-primary/10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                      {/* Image Column */}
                      <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#161c28]">
                        <img
                          src={formatImageUrl(featuredBlog.banner_image || featuredBlog.featured_image)}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Content Column */}
                      <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                              Technical Insight
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Calendar size={13} className="text-slate-500" />
                              <span>{featuredBlog.date || 'Recent'}</span>
                            </div>
                            <span className="text-slate-600 text-xs">•</span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Clock size={13} className="text-slate-500" />
                              <span>{getReadingTime(featuredBlog.content)}</span>
                            </div>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-primary transition-colors leading-tight">
                            {featuredBlog.title}
                          </h2>

                          <p className="text-sm sm:text-base text-slate-400 line-clamp-3 leading-relaxed">
                            {featuredBlog.excerpt || 'Explore this comprehensive technical breakdown and industry workflow guidelines.'}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                              ET
                            </div>
                            <span className="text-xs font-semibold text-slate-300">ExpertTalkz Team</span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                            <span>Read Article</span>
                            <ArrowRight size={15} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* ─── Articles Grid ───────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {searchQuery.trim() ? `Search Results (${gridBlogs.length})` : 'Latest Articles'}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Showing {gridBlogs.length} articles
                  </span>
                </div>

                {gridBlogs.length === 0 ? (
                  <div className="py-20 text-center bg-[#121620] border border-white/10 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                      <BookOpen size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white">No Articles Found</h3>
                    <p className="text-xs text-slate-400">
                      We couldn't find any articles matching your search criteria. Try different keywords.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTag('All');
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-black font-bold text-xs hover:bg-yellow-400 transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridBlogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/blog/${blog.slug}`}
                        className="group flex flex-col bg-[#121620] border border-white/10 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
                      >
                        {/* Card Image Container */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#161c28]">
                          <img
                            src={formatImageUrl(blog.featured_image || blog.banner_image)}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Cointainer/5 Soft Skill.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent opacity-80" />

                          {/* Pill Badges on image */}
                          <div className="absolute top-3.5 left-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                              Guide
                            </span>
                          </div>

                          <div className="absolute bottom-3.5 right-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-slate-300 flex items-center gap-1 border border-white/10">
                              <Clock size={11} className="text-primary" />
                              {getReadingTime(blog.content)}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Calendar size={13} className="text-slate-500" />
                              <span>{blog.date || 'Recent'}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {blog.title}
                            </h3>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {blog.excerpt || 'Read the full guide for technical specifications and detailed methodologies.'}
                            </p>
                          </div>

                          {/* Card Bottom / Author */}
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                                <User size={11} />
                              </div>
                              <span>ExpertTalkz</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                              <span>Read</span>
                              <ArrowRight size={13} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogList;
