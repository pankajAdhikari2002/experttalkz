import { useState, useEffect } from 'react';
import Meta from '../components/common/Meta';
import Loader from '../components/common/Loader';
import { api } from '../services/api';
import type { EventItem, EventCategory } from '../types';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected event for the "Learn More" modal popup
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadEventsData = async () => {
      try {
        const [eventsData, catsData] = await Promise.all([
          api.getEvents(),
          api.getEventCategories(),
        ]);
        setEvents(eventsData || []);
        setCategories(catsData || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEventsData();
  }, []);

  const colorStyles: Record<
    string,
    { gradient: string; badge: string; border: string; glow: string }
  > = {
    blue: {
      gradient: 'from-blue-500/15 via-blue-600/5 to-transparent',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      border: 'border-blue-500/30 hover:border-blue-500/60',
      glow: 'group-hover:shadow-blue-500/10',
    },
    green: {
      gradient: 'from-emerald-500/15 via-emerald-600/5 to-transparent',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    purple: {
      gradient: 'from-purple-500/15 via-purple-600/5 to-transparent',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      glow: 'group-hover:shadow-purple-500/10',
    },
    orange: {
      gradient: 'from-amber-500/15 via-amber-600/5 to-transparent',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      glow: 'group-hover:shadow-amber-500/10',
    },
    red: {
      gradient: 'from-rose-500/15 via-rose-600/5 to-transparent',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      border: 'border-rose-500/30 hover:border-rose-500/60',
      glow: 'group-hover:shadow-rose-500/10',
    },
    cyan: {
      gradient: 'from-cyan-500/15 via-cyan-600/5 to-transparent',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      glow: 'group-hover:shadow-cyan-500/10',
    },
  };

  const filteredEvents = events.filter((ev) => {
    const categoryName = ev.category?.name || '';
    const matchesCategory =
      activeCategory === 'All' ||
      categoryName.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.badge && ev.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-primary selection:text-white">
      <Meta
        title="Upcoming Engineering Events & Webinars | ExpertTalkz"
        description="Join live hands-on industry workshops, offshore engineering webinars, and Q&A sessions with global piping and structural leads."
      />

      {/* ─── Hero Banner Section ────────────────────────────────────────── */}
      <div className="relative py-20 md:py-32 text-center overflow-hidden border-b border-white/10">
        {/* Glow Effects */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Interactive Masterclasses & Live Sessions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            ENGINEERING EVENTS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300">
              & INDUSTRY WEBINARS
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Stay ahead in offshore piping, stress analysis, and structural engineering. Connect directly with global leads from Worley, Technip, and McDermott.
          </p>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="block text-xl md:text-2xl font-black text-primary">Live</span>
              <span className="text-xs text-slate-400 font-medium">Interactive Sessions</span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="block text-xl md:text-2xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">Industry Focused</span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="block text-xl md:text-2xl font-black text-cyan-400">CAESAR II</span>
              <span className="text-xs text-slate-400 font-medium">& SP3D Walkthroughs</span>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <span className="block text-xl md:text-2xl font-black text-purple-400">Free</span>
              <span className="text-xs text-slate-400 font-medium">Q&A Opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Section ───────────────────────────────────────── */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Controls: Search & Category Filter Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 ${
                  activeCategory === 'All'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                All Events ({events.length})
              </button>

              {categories.map((cat) => {
                const count = events.filter(
                  (e) => e.category?.name?.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                      activeCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeCategory.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, topics..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Events State */}
          {loading ? (
            <Loader className="py-24" text="Loading upcoming events..." />
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-16 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <span className="material-symbols-outlined text-4xl">event_busy</span>
              </div>
              <h3 className="text-xl font-bold text-white">No Events Found</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {searchQuery
                  ? `No upcoming events match "${searchQuery}". Try a different search term or select "All Events".`
                  : `There are currently no scheduled events under "${activeCategory}". Check back soon!`}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 font-semibold text-xs hover:bg-primary hover:text-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const colorTheme = colorStyles[event.color || 'blue'] || colorStyles.blue;

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`bg-gradient-to-br ${colorTheme.gradient} bg-[#0d121f] border ${colorTheme.border} rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-xl ${colorTheme.glow} flex flex-col`}
                  >
                    {/* Event Banner */}
                    <div className="relative h-48 w-full bg-[#090d16] overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                          <span className="material-symbols-outlined text-5xl text-primary/40">
                            school
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-transparent" />

                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border backdrop-blur-md ${colorTheme.badge}`}
                        >
                          {event.badge || 'EVENT'}
                        </span>

                        {Boolean(event.is_featured) && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                            <span>★</span>
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Category & Date */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-primary font-bold uppercase tracking-wider">
                            {event.category?.name || 'Session'}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1 text-slate-300">
                            <span className="material-symbols-outlined !text-[15px]">
                              calendar_today
                            </span>
                            <span className="font-medium">{event.date_text}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Description Preview */}
                        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-primary hover:border-primary text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Learn More & Details</span>
                          <span className="material-symbols-outlined !text-sm group-hover:translate-x-0.5 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Newsletter / Event Alert CTA ───────────────────────────── */}
          <div className="mt-16 bg-gradient-to-br from-primary/15 via-blue-950/20 to-[#070b14] rounded-3xl border border-primary/20 p-8 md:p-14 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-2xl">notifications_active</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Never Miss an Offshore Masterclass
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Receive direct email notifications when new dates are announced for live piping stress workshops, SP3D demos, and career guidance sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your professional email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => alert('Thank you for subscribing to ExpertTalkz event notifications!')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 whitespace-nowrap transition-all"
                >
                  Get Notified
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         EVENT DETAILS POPUP MODAL (LEARN MORE WINDOW)
         ══════════════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[#0e1422] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-primary/10 my-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Hero / Banner */}
            <div className="relative h-60 w-full bg-[#070b14] overflow-hidden">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
                  <span className="material-symbols-outlined text-6xl">school</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-[#0e1422]/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors backdrop-blur-sm shadow-lg"
                title="Close"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>

              {/* Floating Badges */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border backdrop-blur-md ${
                      colorStyles[selectedEvent.color || 'blue']?.badge || colorStyles.blue.badge
                    }`}
                  >
                    {selectedEvent.badge || 'EVENT'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10 backdrop-blur-md">
                    {selectedEvent.category?.name || 'General Session'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                {/* Date & Schedule Bar */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined !text-[16px]">calendar_month</span>
                  <span>{selectedEvent.date_text}</span>
                </div>

                {/* Full Event Title */}
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                  {selectedEvent.title}
                </h2>
              </div>

              {/* Event Description */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Event Overview & Agenda
                </h4>
                <div className="text-sm md:text-base text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  {selectedEvent.description}
                </div>
              </div>

              {/* Highlights & What to Expect */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Takeaways & Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">
                      check_circle
                    </span>
                    <span>Live Interactive Q&A with Senior Leads</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">
                      check_circle
                    </span>
                    <span>Real-World Offshore Engineering Projects</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">
                      check_circle
                    </span>
                    <span>ASME / API Code Compliance Review</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">
                      check_circle
                    </span>
                    <span>Participation Certificate & Guidance</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Close Window
                </button>

                {selectedEvent.link_url && selectedEvent.link_url.startsWith('http') ? (
                  <a
                    href={selectedEvent.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <span>{selectedEvent.link_text || 'Register / Join Event'}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                ) : (
                  <Link
                    to={selectedEvent.link_url || '/contact'}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <span>{selectedEvent.link_text || 'Reserve Your Spot'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
