import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Course } from '../../types';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';
import Meta from '../../components/common/Meta';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  BookOpen,
  Award,
  Video,
  Sparkles,
  ChevronDown,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [data, all] = await Promise.all([
          api.getCourseBySlug(slug),
          api.getCourses().catch(() => []),
        ]);
        setCourse(data || null);
        if (all && data) {
          setRelatedCourses(
            all.filter((c: Course) => c.slug !== slug && c.status !== 0).slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Failed to fetch course details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Will I receive a verified certificate upon completion?',
      a: 'Yes! Upon successfully submitting all assignments and completing the final capstone project, you will receive an industry-recognized Certificate of Completion from ExpertTalkz Global Solutions LLP.',
    },
    {
      q: 'Are live classes recorded if I miss a session?',
      a: 'Absolutely. Every live lecture is recorded in high definition and uploaded to your student portal within 24 hours, accessible with lifetime validity.',
    },
    {
      q: 'Is software installation assistance provided?',
      a: 'Yes, our technical mentors provide step-by-step guidance and installation support for all required design and analysis software modules.',
    },
    {
      q: 'What placement and career support is included?',
      a: 'Students receive comprehensive resume building workshops, LinkedIn optimization, mock technical interview sessions, and exclusive access to our industry partner job openings.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 bg-[#070b14] text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined text-4xl">menu_book</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Course Not Found</h2>
          <p className="text-slate-400 text-sm max-w-md">
            The course you are looking for might have been moved or is no longer available.
          </p>
        </div>
        <Link
          to="/courses"
          className="px-6 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20"
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  const isFeatured = Boolean(course.is_featured && Number(course.is_featured) !== 0);
  const priceDisplay = formatPrice(course.discount_price || course.price);
  const originalPriceDisplay = formatPrice(course.price);
  const discountPercent =
    course.discount_price && course.discount_price < course.price
      ? Math.round(((course.price - course.discount_price) / course.price) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-primary selection:text-black">
      <Meta
        title={`${course.course_name} | ExpertTalkz Engineering Masterclass`}
        description={course.short_description || course.description}
      />

      {/* ─── Top Breadcrumb Navigation ─────────────────────────────── */}
      <div className="bg-[#0b1220] border-b border-white/10 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link to="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            {course.category && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300">{course.category}</span>
              </>
            )}
            <span className="text-slate-600">/</span>
            <span className="text-primary truncate max-w-[200px] sm:max-w-md font-bold">
              {course.course_name}
            </span>
          </div>

          <button
            onClick={() => navigate('/courses')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Catalog
          </button>
        </div>
      </div>

      {/* ─── Hero Section with Dynamic Background ───────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0b1220] via-[#070b14] to-[#070b14] pt-8 pb-14 md:py-16">
        {/* Subtle background glow */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-sm"
          style={{
            backgroundImage: `url(${
              (course as any).banner_images || course.thumbnail || '/experttalkz icon.png'
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/95 to-[#070b14]/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-black shadow-md shadow-amber-500/20">
                    <Sparkles size={13} />
                    Featured Program
                  </span>
                )}
                {course.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
                    {course.category}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                  {course.course_mode || 'Online Live'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {course.level || 'Intermediate'} Level
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {course.course_name}
              </h1>

              {/* Short Description */}
              <div
                className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
                dangerouslySetInnerHTML={{
                  __html: course.short_description || course.description,
                }}
              />

              {/* Meta stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={18} className="text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-white">{course.course_duration || '8 Weeks'}</div>
                    <div className="text-[10px] text-slate-400">Total Duration</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Award size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Certificate</div>
                    <div className="text-[10px] text-slate-400">Accredited</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Video size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">{course.course_mode || 'Online'}</div>
                    <div className="text-[10px] text-slate-400">Delivery Format</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck size={18} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Lifetime</div>
                    <div className="text-[10px] text-slate-400">Access Included</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Quick Action Card on Desktop */}
            <div className="lg:col-span-5">
              <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 sticky top-24 space-y-6">
                {/* Thumbnail / Video Preview */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 group">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.course_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#121c33] to-[#1e293b] text-primary">
                      <span className="material-symbols-outlined text-5xl">menu_book</span>
                    </div>
                  )}

                  {discountPercent && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-black shadow-lg">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Pricing & Guarantee */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {priceDisplay || 'Free'}
                    </span>
                    {course.discount_price && course.discount_price < course.price && (
                      <span className="text-lg text-slate-400 line-through font-semibold">
                        {originalPriceDisplay}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Includes all training modules, project datasets, license support & certification.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    to={`/buy/${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-yellow-400 text-black font-black text-base shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-xl">bolt</span>
                    Enroll in Masterclass
                  </Link>

                  <a
                    href={`https://wa.me/919324545107?text=Hi%2C%20I%20have%20an%20inquiry%20regarding%20the%20${encodeURIComponent(
                      course.course_name
                    )}%20course.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 font-bold text-sm transition-all"
                  >
                    <MessageCircle size={18} />
                    Chat with Course Advisor on WhatsApp
                  </a>
                </div>

                {/* Key Course Inclusions Checklist */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    This Training Program Includes:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span>Live interactive instructor-led classes & Q&A</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span>Hands-on industrial projects & real calculation sheets</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span>Lifetime access to recorded session library</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span>Official verified Certificate of Completion</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span>Placement assistance & interview prep sessions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Details & Curriculum Tabs Section ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-12">
            {/* What You'll Learn Grid */}
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">What You'll Master</h2>
                  <p className="text-xs text-slate-400">Key engineering competencies and tools covered</p>
                </div>
              </div>

              {course.learnings && course.learnings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.learnings.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#080d1a] border border-white/5 hover:border-primary/30 transition-colors flex items-start gap-3"
                    >
                      <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-200 leading-relaxed font-medium">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  Comprehensive syllabus modules and industrial calculations included.
                </p>
              )}
            </div>

            {/* Course Overview & Long Description */}
            {course.long_description && (
              <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Curriculum & Overview</h2>
                    <p className="text-xs text-slate-400">Detailed course syllabus breakdown</p>
                  </div>
                </div>

                <div
                  className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-white [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-white [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1.5 [&>p]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: course.long_description }}
                />
              </div>
            )}

            {/* Certification Guarantee Banner */}
            <div className="bg-gradient-to-br from-[#121d33] to-[#0b1424] border border-primary/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-wider">
                  Verified Credential
                </span>
                <h3 className="text-xl font-bold text-white">
                  Earn Your Certificate of Completion
                </h3>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Demonstrate your expertise to top EPC, Oil & Gas, and engineering employers with a verifiable certificate recognized across the industry.
                </p>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 mx-auto sm:mx-0">
                <Award size={42} />
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Frequently Asked Questions</h2>
                  <p className="text-xs text-slate-400">Everything you need to know before enrolling</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#080d1a] border border-white/5 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                          openFaq === idx ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Additional Widgets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact & Consultation */}
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                Speak With an Expert Advisor
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have custom corporate training requirements or questions about prerequisite skills? Our counseling team is available 24/7.
              </p>
              <div className="space-y-2.5 pt-1">
                <a
                  href="tel:+919324545107"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors border border-white/5"
                >
                  <span className="material-symbols-outlined text-primary text-base">call</span>
                  <span>+91 93245 45107</span>
                </a>
                <a
                  href="mailto:experttalkz@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors border border-white/5 font-mono"
                >
                  <span className="material-symbols-outlined text-primary text-base">mail</span>
                  <span>experttalkz@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Related Courses Widget */}
            {relatedCourses.length > 0 && (
              <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                  Related Masterclasses
                </h3>

                <div className="space-y-3">
                  {relatedCourses.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/courses/${rel.slug}`}
                      className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#080d1a] border border-white/5 hover:border-primary/40 transition-all"
                    >
                      <div className="w-16 h-12 rounded-xl bg-black/40 overflow-hidden shrink-0">
                        {rel.thumbnail ? (
                          <img
                            src={rel.thumbnail}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <span className="material-symbols-outlined text-base">menu_book</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                          {rel.course_name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>{rel.category || 'Engineering'}</span>
                          <span className="font-bold text-white">
                            {formatPrice(rel.discount_price || rel.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
