import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Course } from '../../types';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';
import Meta from '../../components/common/Meta';
import { CheckCircle2, Clock, BarChart3, Award, PlayCircle, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (slug) {
        try {
          const data = await api.getCourseBySlug(slug);
          setCourse(data || null);
        } catch (error) {
          console.error('Failed to fetch course', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-300">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined text-4xl">menu_book</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          The course you are looking for might have been updated or moved.
        </p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm"
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  const formatImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `/${url.replace(/^\/+/, '')}`;
  };

  const courseImage = formatImageUrl(course.thumbnail || (course as any).banner_images);

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <Meta
        title={`${course.course_name} | ExpertTalkz Industrial Training`}
        description={course.description || course.short_description || ''}
      />

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#0a1122] border-b border-white/10 pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Breadcrumb Navigation */}
          <button
            onClick={() => navigate('/courses')}
            className="text-slate-400 hover:text-white mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Courses</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {course.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 text-xs font-bold">
                    {course.category}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 text-xs font-medium capitalize">
                  {course.level || 'All Levels'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 text-xs font-medium">
                  {course.course_mode || 'Online'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight text-white">
                {course.course_name}
              </h1>

              {/* Short Description */}
              <div
                className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl"
                dangerouslySetInnerHTML={{
                  __html: course.short_description || course.description || '',
                }}
              />

              {/* Mobile Only: Inline Quick Price & CTA */}
              <div className="flex lg:hidden items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(course.discount_price || course.price)}
                  </span>
                  {course.discount_price && course.discount_price < course.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                </div>
                <Link
                  to={`/buy/${slug}`}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black font-extrabold text-sm shadow-lg shadow-primary/20 transition-all"
                >
                  Enroll Now
                </Link>
              </div>
            </div>

            {/* Right Hero Column: Video / Media Preview Banner */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0d1527] shadow-2xl group">
                {/* Course Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#070b14]">
                  <img
                    src={courseImage}
                    alt={course.course_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Video Play Placeholder Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform group-hover:scale-110 cursor-pointer">
                      <PlayCircle size={32} className="fill-black text-primary ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                      Course Preview Video
                    </span>
                  </div>
                </div>

                {/* Quick Info Bar under media */}
                <div className="p-4 bg-[#0e172a] border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-primary" />
                    {course.course_duration || 'Flexible Schedule'}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award size={14} className="text-primary" />
                    Verified Certificate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content & Sticky Sidebar ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ─── Left Column: Overview & Syllabus ──────────────────────── */}
          <div className="lg:col-span-8 space-y-10">
            {/* Mobile Video Space */}
            <div className="lg:hidden rounded-2xl overflow-hidden border border-white/15 bg-[#0d1527] shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden bg-[#070b14]">
                <img
                  src={courseImage}
                  alt={course.course_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
                    <PlayCircle size={28} className="fill-black text-primary ml-0.5" />
                  </div>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full">
                    Course Preview Video
                  </span>
                </div>
              </div>
            </div>

            {/* Course Overview Section */}
            {course.long_description ? (
              <div className="bg-[#0e172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-primary border-b border-white/10 pb-4">
                  <FileText size={22} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Course Overview</h2>
                </div>
                <div
                  className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: course.long_description }}
                />
              </div>
            ) : null}

            {/* What You'll Learn Section */}
            <div className="bg-[#0e172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5 text-primary border-b border-white/10 pb-4">
                <CheckCircle2 size={22} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">What You'll Learn</h2>
              </div>

              {course.learnings && course.learnings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learnings.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 bg-[#121c32] rounded-2xl border border-white/5 hover:border-primary/30 transition-colors"
                    >
                      <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Industry-relevant practical skills, software workflows, and real-time engineering projects.
                </p>
              )}
            </div>
          </div>

          {/* ─── Right Column: Sticky Enrollment Card ──────────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[#0e172a] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              {/* Pricing Header */}
              <div className="space-y-1 pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Course Tuition
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatPrice(course.discount_price || course.price)}
                  </span>
                  {course.discount_price && course.discount_price < course.price && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to={`/buy/${slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-yellow-400 text-black font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  Enroll Now
                </Link>

                <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-400" />
                  Secure checkout & instant course access
                </div>
              </div>

              {/* Course Features List */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  This Course Includes:
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Clock size={18} className="text-primary shrink-0" />
                    <span>{course.course_duration || 'Flexible Schedule'} Duration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <BarChart3 size={18} className="text-primary shrink-0" />
                    <span className="capitalize">{course.level || 'All Levels'} Level</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Award size={18} className="text-primary shrink-0" />
                    <span>Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-primary shrink-0" />
                    <span>Instructor & Placement Support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
