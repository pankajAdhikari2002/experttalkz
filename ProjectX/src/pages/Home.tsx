import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import { api } from '../services/api';
import type { Course, Category, Award } from '../types';
import { Wrench, Layers, Activity, Compass, Flame, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderIntervalRef = useRef<any>(null);

  const startSlider = (total: number) => {
    stopSlider();
    if (total === 0) return;
    sliderIntervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
    }, 5000);
  };

  const stopSlider = () => {
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
      sliderIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, allCats, allAwards] = await Promise.all([
          api.getCourses(),
          api.getCategories(),
          api.getAwards()
        ]);
        setAllCourses(coursesData);
        setFeaturedCourses(coursesData.filter(c => c.is_featured));
        setCategories(allCats);
        setAwards(allAwards);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (featuredCourses.length > 0) startSlider(featuredCourses.length);
    return () => stopSlider();
  }, [featuredCourses]);

  const handlePrev = () => {
    stopSlider();
    setActiveSlide((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
    startSlider(featuredCourses.length);
  };

  const handleNext = () => {
    stopSlider();
    setActiveSlide((prev) => (prev + 1) % featuredCourses.length);
    startSlider(featuredCourses.length);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">autorenew</span>
        <p className="text-slate-300 font-medium">Loading Offshore Engineering Data...</p>
      </div>
    );
  }

  // Testimonials with real student images
  const testimonials = [
    {
      id: 1,
      name: 'Amit Patel',
      role: 'Piping Stress Engineer',
      company: 'Worley',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      rating: 5,
      feedback: 'The CAESAR II piping stress course shifted my career completely. The stress modeling projects and ASME code walkthroughs were exactly what I faced in my Worley technical interviews!'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      role: 'Offshore Structural Lead',
      company: 'Technip Energies',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
      rating: 5,
      feedback: 'Incredible platform! The structural engineering curriculum was comprehensive and industrial. Learning from active field experts made all the difference in landing my role at Technip.'
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      role: 'Senior Process Engineer',
      company: 'SBM Offshore',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
      rating: 5,
      feedback: 'HYSYS simulation and P&ID concepts explained with amazing industrial precision. The gas separation topsides module directly helped me secure a promotion at SBM Offshore.'
    }
  ];

  // EPC & Engineering companies with real logo URLs
  const hiringCompanies = [
    {
      name: 'Worley',
      type: 'International EPC',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Worley_logo.svg/320px-Worley_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'Wood Group',
      type: 'International',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wood_Group_logo.svg/320px-Wood_Group_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'Technip Energies',
      type: 'International',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Technip_Energies_logo.svg/320px-Technip_Energies_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'McDermott',
      type: 'International EPC',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/McDermott_logo.svg/320px-McDermott_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'Larsen & Toubro',
      type: 'India-based',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/L%26T_Logo.svg/320px-L%26T_Logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'Cyient',
      type: 'India-based',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cyient_logo.svg/320px-Cyient_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'Assystem',
      type: 'International',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Assystem_logo.svg/320px-Assystem_logo.svg.png',
      bg: '#fff'
    },
    {
      name: 'SBM Offshore',
      type: 'International',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/SBM_Offshore_logo.svg/320px-SBM_Offshore_logo.svg.png',
      bg: '#fff'
    }
  ];

  return (
    <>
      <Meta
        title="Expertalkz Global Solutions | No. 1 Offshore Engineering Training & Career Platform"
        description="Launch your offshore engineering career with Expertalkz — India's leading training platform for Oil & Gas, Aviation, Shipping, Mining, and Fintech professionals."
      />

      {/* ─── HERO + CAROUSEL ─────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/mxBjzOMVg4f2eoRR/oil-and-gas-platforms-A852DbQ2PWSrlJno.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050914]/70 via-[#050914]/80 to-[#050914]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-20 pb-10 lg:px-10 lg:pt-28">
          {/* Hero text */}
          <div className="max-w-2xl flex flex-col gap-5 items-start mb-12">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-primary !text-[16px]">verified</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white">#1 Offshore Engineering Platform</span>
            </div>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.2rem] drop-shadow-lg">
              Shaping the Future of Oil & Gas Jobs, Training & Industry Solutions!
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 max-w-xl">
              Master piping stress, 3D plant design, and offshore engineering with hands-on ASME-compliant training built for real EPC careers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" icon={<span className="material-symbols-outlined fill-current">explore</span>}>
                  Explore Courses
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button
                  size="lg"
                  variant="outline"
                  className="relative text-white border-0 bg-gradient-to-r from-[#4169E1] via-[#8F00FF] to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:scale-[1.03] transition-all duration-300"
                  icon={<span className="material-symbols-outlined fill-current">work</span>}
                >
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Top Trending Courses multi-card carousel ──────────── */}
          {featuredCourses.length > 0 && (
            <div
              className="relative"
              onMouseEnter={stopSlider}
              onMouseLeave={() => startSlider(featuredCourses.length)}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-1">Editor's Pick</span>
                  <h2 className="text-xl font-black text-white">Top Trending Courses</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer"
                    aria-label="Previous"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer"
                    aria-label="Next"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Card strip — shows 3 cards with the active one highlighted */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredCourses.map((course, index) => {
                  const isActive = index === activeSlide;
                  return (
                    <Link
                      key={course.id}
                      to={`/courses/${course.slug}`}
                      className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 ${
                        isActive
                          ? 'border-primary/60 shadow-[0_0_30px_rgba(65,105,225,0.3)] scale-[1.02]'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      {/* Square-ish thumbnail */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0b1530]">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url("${course.thumbnail}")` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1530] via-transparent to-transparent" />
                        {course.installments && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            EMI Available
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Trending
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold" style={{color:'#FFB800'}}>
                          <span className="material-symbols-outlined text-[13px]" style={{color:'#FFB800', fontVariationSettings:"'FILL' 1"}}>star</span>
                          {course.rating}
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="bg-[#0f1a2e]/95 backdrop-blur-md p-4">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">{course.course_mode}</span>
                          <span className="text-slate-500">• {course.course_duration}</span>
                        </div>
                        <h3 className={`font-black leading-snug text-sm mb-3 transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {course.course_name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-white">${course.discount_price || course.price}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                            Enroll →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-5">
                {featuredCourses.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { stopSlider(); setActiveSlide(i); startSlider(featuredCourses.length); }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === i ? 'w-6 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* bottom fade */}
        <div className="h-10 bg-gradient-to-b from-transparent to-[#050914]" />
      </div>

      {/* ─── EXPLORE CURRICULUMS (Cards with image + square-ish) ── */}
      <Section className="py-20 bg-background-dark border-t border-white/5">

        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Our Programs</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Explore Professional Curriculums</h2>
            <p className="text-[#9dabb9] text-sm max-w-xl mx-auto mt-3">
              Hover over any card to reveal a quick syllabus breakdown and enrollment options.
            </p>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => (
              <div
                key={course.id}
                className="group relative rounded-2xl border border-white/10 overflow-hidden bg-[#0f1a2e] shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                style={{ minHeight: 320 }}
              >
                {/* Square-ish thumbnail */}
                <div className="relative w-full" style={{ paddingTop: '62%' }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${course.thumbnail}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2e] via-[#0f1a2e]/30 to-transparent" />
                  {course.installments && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      EMI
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md" style={{color:'#FFB800'}}>
                    <span className="material-symbols-outlined text-[13px]" style={{color:'#FFB800', fontVariationSettings:"'FILL' 1"}}>star</span>
                    {course.rating}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">{course.course_mode}</span>
                    <span className="text-slate-500">• {course.course_duration}</span>
                  </div>
                  <h3 className="text-base font-black text-white leading-tight group-hover:text-primary transition-colors">
                    {course.course_name}
                  </h3>
                  <p className="text-[#9dabb9] text-xs leading-relaxed line-clamp-2">
                    {course.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white">${course.discount_price || course.price}</span>
                    </div>
                    <Link to={`/buy/${course.slug}`}>
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
                        Enroll Now
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Hover Quick-Look overlay */}
                <div className="absolute inset-0 bg-[#080f1f]/95 border border-primary/30 rounded-2xl p-5 flex flex-col justify-between opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-20">
                  <div>
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Curriculum Quick-Look</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-4 line-clamp-5">
                      {course.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="material-symbols-outlined !text-[12px] text-primary">check_circle</span>
                        <span>Level: {course.level || 'Advanced'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="material-symbols-outlined !text-[12px] text-primary">check_circle</span>
                        <span>Duration: {course.course_duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="material-symbols-outlined !text-[12px] text-primary">check_circle</span>
                        <span>ASME-compliant, industry-grade curriculum</span>
                      </div>
                      {course.installments && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="material-symbols-outlined !text-[12px] text-green-400">check_circle</span>
                          <span>Structured EMI/installment plans available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/courses/${course.slug}`} className="flex-1">
                      <Button size="sm" variant="outline" fullWidth className="!text-[11px] !border-white/10 text-white hover:!bg-white/5">
                        Details
                      </Button>
                    </Link>
                    <Link to={`/buy/${course.slug}`} className="flex-1">
                      <Button size="sm" fullWidth className="!text-[11px]">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── WHY CHOOSE EXPERTTALKZ ───────────────────────────────── */}
      <Section className="py-20 bg-[#050914] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Why Us</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Why Choose Experttalkz?</h2>
            <p className="text-[#9dabb9] text-sm max-w-2xl mx-auto mt-3">
              We don't just teach — we prepare you for the real engineering world with expert mentorship, hands-on learning, and dedicated career support.
            </p>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'engineering',
                color: 'from-blue-600 to-blue-400',
                glow: 'rgba(59,130,246,0.15)',
                title: 'Industry-Experienced Trainers',
                desc: 'Learn directly from professionals with extensive real-world project experience in EPC, Oil & Gas, and offshore engineering.'
              },
              {
                icon: 'handyman',
                color: 'from-violet-600 to-purple-400',
                glow: 'rgba(139,92,246,0.15)',
                title: 'Hands-on Practical Training',
                desc: 'Gain practical skills through live sessions, real-world projects, and industry case studies — not just theory.'
              },
              {
                icon: 'verified',
                color: 'from-emerald-600 to-green-400',
                glow: 'rgba(16,185,129,0.15)',
                title: 'Industry-Ready Curriculum',
                desc: 'Courses are designed based on current industry requirements and global engineering standards, keeping you job-ready.'
              },
              {
                icon: 'workspace_premium',
                color: 'from-amber-600 to-yellow-400',
                glow: 'rgba(245,158,11,0.15)',
                title: 'Career Support & Certification',
                desc: 'Receive career guidance, interview preparation, resume building support, and a course completion certificate.'
              },
              {
                icon: 'devices',
                color: 'from-cyan-600 to-sky-400',
                glow: 'rgba(14,165,233,0.15)',
                title: 'Flexible Online Learning',
                desc: 'Attend live online classes from anywhere with access to all learning resources, assignments, and recorded sessions.'
              },
              {
                icon: 'public',
                color: 'from-rose-600 to-pink-400',
                glow: 'rgba(244,63,94,0.15)',
                title: 'Global Career Opportunities',
                desc: 'Build skills that open doors to leading EPC, Oil & Gas, Infrastructure, and Engineering companies worldwide.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0b1428] border border-white/8 rounded-2xl p-7 hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                style={{ boxShadow: `0 0 0 0 ${item.glow}` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${item.glow}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${item.glow}`; }}
              >
                <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <span className="material-symbols-outlined text-white text-[22px]">{item.icon}</span>
                </div>
                <h3 className="text-base font-black text-white mb-2.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#9dabb9] text-xs leading-relaxed">
                  {item.desc}
                </p>
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-500 rounded-b-2xl`} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── BROWSE BY CATEGORY ───────────────────────────────────── */}
      <Section variant="surface" className="py-16 border-t border-white/5 bg-[#0b1530]/30">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-2 text-center">What We Cover</h2>
          <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto text-sm">One Platform. Five Engineering & Financial Domains.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/courses?category=${cat.slug}`} className="group">
                <div className="bg-card-dark/60 border border-white/10 p-6 rounded-2xl text-center hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">category</span>
                  </div>
                  <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors">{cat.category_title}</h3>
                  <span className="text-xs text-[#9dabb9]">{cat.count} Courses</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── STUDENT TESTIMONIALS ─────────────────────────────────── */}
      <Section className="py-20 bg-background-dark border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Student Stories</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Voices of Success</h2>
            <p className="text-[#9dabb9] text-sm max-w-xl mx-auto mt-3">
              Hear from graduates who launched global engineering careers after our courses.
            </p>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#0f1a2e] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300 shadow-lg"
              >
                {/* Quote mark */}
                <div className="text-primary/30 text-6xl font-serif leading-none mb-2 select-none">"</div>

                {/* Rating */}
                <div className="flex gap-0.5 text-yellow-500 mb-3">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[15px] filled">star</span>
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                  {test.feedback}
                </p>

                {/* Student info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">{test.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {test.role}
                      <span className="text-primary font-semibold ml-1">@ {test.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TOP HIRING COMPANIES ─────────────────────────────────── */}
      <Section className="py-20 bg-[#080f1f] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Our Hiring Network</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Top Companies Hiring Our Alumni</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-12">
            Join the elite EPC engineering firms and international oil & gas companies that actively recruit from our platform.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {hiringCompanies.map((company, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-white/10 p-5 flex flex-col items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(65,105,225,0.2)] hover:-translate-y-1 transition-all duration-300 group min-h-[110px]"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-9 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.logo-fallback') as HTMLElement | null;
                      if (fallback) fallback.style.display = 'block';
                    }
                  }}
                />
                {/* Fallback text if logo fails */}
                <span
                  className="logo-fallback text-gray-700 font-extrabold text-sm tracking-wide hidden"
                >
                  {company.name}
                </span>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{company.type}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

        {/*updated here*/}
      {/*─── Who Should Enroll ───────────────────────────────────────── */}
      <Section className="py-20 bg-[#080f1f] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Target Audience</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Who Should Enroll?</h2>
            <p className="text-[#9dabb9] text-sm max-w-2xl mx-auto mt-3">
              Industry-aligned training programs built specifically for engineering students, practicing professionals, and career switchers looking to excel in EPC design.
            </p>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Wrench,
                title: "Mechanical Engineers",
                tag: "Students & Professionals",
                desc: "Bridge the gap between mechanical theory and real-world EPC plant design, 3D piping, and equipment layout.",
                link: "/courses"
              },
              {
                icon: Layers,
                title: "Piping & Layout Engineers",
                tag: "Design & Modeling",
                desc: "Master 3D plant design software like SP3D & AVEVA E3D, ASME B31.3 codes, and isometric drawing extraction.",
                link: "/courses"
              },
              {
                icon: Activity,
                title: "Stress Analysis Engineers",
                tag: "CAESAR II & ASME",
                desc: "Perform static/dynamic pipe stress, thermal expansion, spring hanger sizing, and offshore wave load analysis.",
                link: "/courses"
              },
              {
                icon: Compass,
                title: "Pipeline Design Professionals",
                tag: "Onshore & Subsea",
                desc: "Develop onshore and subsea pipeline routing, wall thickness calculations, alignment sheets, and offshore design.",
                link: "/courses"
              },
              {
                icon: Flame,
                title: "Oil & Gas Industry Veterans",
                tag: "Career Advancement",
                desc: "Upgrade your skill set with modern software tools to transition into senior lead engineer & PMC consultancy roles.",
                link: "/courses"
              },
              {
                icon: GraduationCap,
                title: "Freshers & Graduates",
                tag: "Job-Ready Skills",
                desc: "Gain practical EPC project experience, industry portfolio projects, and dedicated placement guidance to land your first job.",
                link: "/courses"
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className="bg-[#0f1a2e] border border-white/10 rounded-2xl p-6 hover:border-primary/50 hover:bg-[#13223f] hover:-translate-y-1.5 transition-all duration-300 shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <IconComponent size={24} />
                      </div>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        <CheckCircle2 size={13} /> {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#9dabb9] text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-slate-400 group-hover:text-primary flex items-center gap-1.5 transition-colors mt-6 pt-4 border-t border-white/5">
                    <span>Explore Suitable Programs</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── ACCREDITATIONS ───────────────────────────────────────── */}
      {awards.length > 0 && (
        <Section className="py-14 border-t border-white/5 bg-background-dark">
          <div className="max-w-[1400px] mx-auto text-center">
            <h2 className="text-sm font-bold text-slate-500 mb-10 uppercase tracking-widest">Our Accreditations & Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {awards.map(award => {
                const label = award.id === '1' ? 'Award' : award.id === '2' ? 'Excellence' : award.id === '3' ? 'Top Rated' : award.award_title;
                return (
                  <div 
                    key={award.id} 
                    className="w-40 h-14 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-black font-black text-sm tracking-wide hover:scale-105 transition-transform"
                    title={award.award_title}
                  >
                    {award.award_image && !award.award_image.includes('placehold.co') ? (
                      <img src={award.award_image} alt={award.award_title} className="max-h-10 max-w-[85%] object-contain" />
                    ) : (
                      <span>{label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      )}
    </>
  );
};

export default Home;
