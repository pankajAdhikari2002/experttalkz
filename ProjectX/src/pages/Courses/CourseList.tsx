import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../../components/common/Meta';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';
import type { Course, Category } from '../../types';

export default function CourseList() {
  const { formatPrice } = useCurrency();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          api.getCourses(),
          api.getCategories().catch(() => []),
        ]);
        setAllCourses(coursesData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Featured Course strictly taken from Admin Panel (is_featured = 1)
  const featuredCourse = useMemo(() => {
    if (allCourses.length === 0) return null;
    return allCourses.find((c) => Boolean(c.is_featured && Number(c.is_featured) !== 0)) || null;
  }, [allCourses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course) => {
        // Search term matching
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          course.course_name.toLowerCase().includes(term) ||
          (course.description && course.description.toLowerCase().includes(term)) ||
          (course.category && course.category.toLowerCase().includes(term)) ||
          (course.learnings && course.learnings.some((l) => l.toLowerCase().includes(term)));

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' ||
          (course.category && course.category.toLowerCase() === selectedCategory.toLowerCase());

        // Mode filter
        const matchesMode =
          selectedMode === 'all' ||
          (course.course_mode && course.course_mode.toLowerCase() === selectedMode.toLowerCase());

        // Level filter
        const matchesLevel =
          selectedLevel === 'all' ||
          (course.level && course.level.toLowerCase() === selectedLevel.toLowerCase());

        return matchesSearch && matchesCategory && matchesMode && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          const priceA = a.discount_price || a.price || 0;
          const priceB = b.discount_price || b.price || 0;
          return priceA - priceB;
        }
        if (sortBy === 'price-high') {
          const priceA = a.discount_price || a.price || 0;
          const priceB = b.discount_price || b.price || 0;
          return priceB - priceA;
        }
        if (sortBy === 'name') {
          return a.course_name.localeCompare(b.course_name);
        }
        return 0; // Default sorting
      });
  }, [allCourses, searchTerm, selectedCategory, selectedMode, selectedLevel, sortBy]);

  // Unique categories list from courses or categories DB
  const categoryOptions = useMemo(() => {
    const list = new Set<string>();
    allCourses.forEach((c) => {
      if (c.category && c.category.trim()) list.add(c.category.trim());
    });
    categories.forEach((cat) => {
      if (cat.category_title && cat.category_title.trim()) list.add(cat.category_title.trim());
    });
    return Array.from(list);
  }, [allCourses, categories]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedMode !== 'all' ||
    selectedLevel !== 'all' ||
    sortBy !== 'default';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedLevel('all');
    setSortBy('default');
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `/${url.replace(/^\/+/, '')}`;
  };

  const getCleanDescription = (desc?: string) => {
    if (!desc) return '';
    return desc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading Engineering Courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <Meta
        title="Engineering Courses & Professional Training | ExpertTalkz"
        description="Explore industry-recognized piping, structural, SP3D, Caesar II, and mechanical engineering certifications."
      />

      {/* ─── Hero / Featured Section (Dynamic from Admin Panel) ─────── */}
      {featuredCourse ? (
        <section className="relative w-full overflow-hidden border-b border-white/10 bg-[#0a1122]">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 filter blur-xs scale-105"
            style={{
              backgroundImage: `url(${formatImageUrl(
                featuredCourse.thumbnail || (featuredCourse as any).banner_images
              )})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
            <div className="max-w-3xl flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black tracking-wider uppercase">
                  <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                  Featured Masterclass
                </span>
                {featuredCourse.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 text-xs font-bold">
                    {featuredCourse.category}
                  </span>
                )}
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  {featuredCourse.course_duration || 'Self-Paced'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-md">
                {featuredCourse.course_name}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed line-clamp-3 max-w-2xl drop-shadow">
                {getCleanDescription(featuredCourse.short_description || featuredCourse.description)}
              </p>

              {/* Price & Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatPrice(featuredCourse.discount_price || featuredCourse.price)}
                  </span>
                  {featuredCourse.discount_price && featuredCourse.discount_price < featuredCourse.price && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formatPrice(featuredCourse.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/buy/${featuredCourse.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-yellow-400 text-black font-extrabold text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    Enroll Now
                  </Link>
                  <Link
                    to={`/courses/${featuredCourse.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-colors"
                  >
                    View Curriculum
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Standard Header if no course is featured */
        <section className="relative w-full py-16 md:py-20 bg-gradient-to-b from-[#0e172a] to-[#070b14] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              Industrial Training & Certifications
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Engineering Course Catalog
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Master industry software, offshore stress analysis, piping design, structural engineering, and plant layout with expert instructors.
            </p>
          </div>
        </section>
      )}

      {/* ─── Search & Comprehensive Filter Control Bar ─────────────── */}
      <div className="sticky top-[57px] z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 space-y-3">
          {/* Top Row: Search Input + Sort + Clear */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search courses, skills, tools (SP3D, Caesar II)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#121a2c] border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Quick Filters & Sorting */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
              {/* Mode Select */}
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 bg-[#121a2c] border border-white/15 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {/* Level Select */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 bg-[#121a2c] border border-white/15 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="basic">Beginner / Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#121a2c] border border-white/15 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Title: A to Z</option>
              </select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors shrink-0"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Chips */}
          {categoryOptions.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-black shadow-md shadow-primary/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                All Specializations ({allCourses.length})
              </button>
              {categoryOptions.map((cat) => {
                const count = allCourses.filter(
                  (c) => c.category && c.category.toLowerCase() === cat.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-black shadow-md shadow-primary/20'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Course Cards Catalog Grid ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Results count & status */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-semibold text-slate-400">
            Showing <span className="text-white font-bold">{filteredCourses.length}</span>{' '}
            {filteredCourses.length === 1 ? 'course' : 'courses'}
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
            <h3 className="text-xl font-bold text-white">No courses match your criteria</h3>
            <p className="text-sm text-slate-400">
              Try searching with different keywords or reset your category and mode filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-xs hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const isFeatured = Boolean(course.is_featured && Number(course.is_featured) !== 0);
              const priceDisplay = formatPrice(course.discount_price || course.price);
              const originalPriceDisplay = formatPrice(course.price);

              return (
                <div
                  key={course.id}
                  className="group bg-[#0d1527] border border-white/10 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
                >
                  {/* Thumbnail Banner */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="relative aspect-video w-full overflow-hidden bg-[#070b14] block"
                  >
                    {course.thumbnail ? (
                      <img
                        src={formatImageUrl(course.thumbnail)}
                        alt={course.course_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0e172a] to-[#1e293b] text-slate-600">
                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                      </div>
                    )}

                    {/* Gradient shade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/15">
                        {course.course_mode || 'Online'}
                      </span>

                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[12px] font-bold">star</span>
                          Featured
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Course Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Category & Duration */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-semibold text-slate-400">
                      <span className="text-primary truncate font-bold">
                        {course.category || 'Engineering'}
                      </span>
                      {course.course_duration && (
                        <span className="flex items-center gap-1 shrink-0 text-slate-400">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {course.course_duration}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="font-extrabold text-base text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {course.course_name}
                      </h3>
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                      {getCleanDescription(course.short_description || course.description)}
                    </p>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-white">
                          {priceDisplay || 'Free'}
                        </span>
                        {course.discount_price && course.discount_price < course.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {originalPriceDisplay}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/courses/${course.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-white/10"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/buy/${course.slug}`}
                          className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                          Enroll
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
