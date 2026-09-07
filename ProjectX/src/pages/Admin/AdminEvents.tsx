import React, { useEffect, useState, useRef } from 'react';
import Loader from '../../components/common/Loader';
import type { EventItem, EventCategory } from '../../types';

export default function AdminEvents() {
  const [activeTab, setActiveTab] = useState<'events' | 'categories'>('events');

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    date_text: '',
    description: '',
    image: '',
    badge: 'NEW',
    color: 'blue',
    link_url: '',
    link_text: 'Learn More',
    is_featured: false,
    status: 1,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    color: 'blue',
    sort_order: 0,
    status: 1,
  });
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Delete Confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'event' | 'category';
    id: number;
    title: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('expertTalkz_auth_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [eventsRes, catsRes] = await Promise.all([
        fetch('/api/admin/events?limit=100', { headers }),
        fetch('/api/admin/event-categories', { headers }),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.items || []);
      }
      if (catsRes.ok) {
        const catsData = await catsRes.json();
        setCategories(catsData || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load events data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      !search.trim() ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase()) ||
      (ev.badge && ev.badge.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || String(ev.category_id) === String(selectedCategory);

    const matchesStatus =
      statusFilter === 'all' || String(ev.status) === String(statusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Event Modal
  const handleOpenEventModal = (eventToEdit?: EventItem) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setEventFormData({
        title: eventToEdit.title || '',
        slug: eventToEdit.slug || '',
        category_id: eventToEdit.category_id ? String(eventToEdit.category_id) : '',
        date_text: eventToEdit.date_text || '',
        description: eventToEdit.description || '',
        image: eventToEdit.image || '',
        badge: eventToEdit.badge || 'NEW',
        color: eventToEdit.color || 'blue',
        link_url: eventToEdit.link_url || '',
        link_text: eventToEdit.link_text || 'Learn More',
        is_featured: Boolean(eventToEdit.is_featured),
        status: eventToEdit.status !== undefined ? Number(eventToEdit.status) : 1,
      });
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: '',
        slug: '',
        category_id: categories.length > 0 ? String(categories[0].id) : '',
        date_text: '',
        description: '',
        image: '',
        badge: 'NEW',
        color: 'blue',
        link_url: '',
        link_text: 'Learn More',
        is_featured: false,
        status: 1,
      });
    }
    setIsEventModalOpen(true);
  };

  // Open Category Modal
  const handleOpenCategoryModal = (catToEdit?: EventCategory) => {
    if (catToEdit) {
      setEditingCategory(catToEdit);
      setCategoryFormData({
        name: catToEdit.name || '',
        slug: catToEdit.slug || '',
        color: catToEdit.color || 'blue',
        sort_order: catToEdit.sort_order || 0,
        status: catToEdit.status !== undefined ? Number(catToEdit.status) : 1,
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        slug: '',
        color: 'blue',
        sort_order: categories.length + 1,
        status: 1,
      });
    }
    setIsCategoryModalOpen(true);
  };

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('expertTalkz_auth_token');
    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const imageUrl = data.url || data.path || data.location;
      setEventFormData((prev) => ({ ...prev, image: imageUrl }));
      showToast('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      showToast('Image upload failed. Please try again.', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Event (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) {
      showToast('Please enter an event title', 'error');
      return;
    }
    if (!eventFormData.date_text.trim()) {
      showToast('Please enter the event date/schedule', 'error');
      return;
    }
    if (!eventFormData.description.trim()) {
      showToast('Please enter an event description', 'error');
      return;
    }

    setEventSubmitting(true);
    try {
      const url = editingEvent
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(eventFormData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save event');
      }

      const saved = await res.json();

      if (editingEvent) {
        setEvents((prev) => prev.map((ev) => (ev.id === saved.id ? saved : ev)));
        showToast('Event updated successfully');
      } else {
        setEvents((prev) => [saved, ...prev]);
        showToast('Event created successfully');
      }

      setIsEventModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving event', 'error');
    } finally {
      setEventSubmitting(false);
    }
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setCategorySubmitting(true);
    try {
      const url = editingCategory
        ? `/api/admin/event-categories/${editingCategory.id}`
        : '/api/admin/event-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryFormData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save category');
      }

      const saved = await res.json();

      if (editingCategory) {
        setCategories((prev) => prev.map((cat) => (cat.id === saved.id ? saved : cat)));
        showToast('Category updated successfully');
      } else {
        setCategories((prev) => [...prev, saved]);
        showToast('Category created successfully');
      }

      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving category', 'error');
    } finally {
      setCategorySubmitting(false);
    }
  };

  // Toggle Event Status
  const handleToggleEventStatus = async (event: EventItem) => {
    const newStatus = event.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to toggle status');

      const updated = await res.json();
      setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
      showToast(`Event marked as ${newStatus === 1 ? 'Active' : 'Draft'}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update event status', 'error');
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === 'event') {
        const res = await fetch(`/api/admin/events/${deleteConfirmation.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete event');
        setEvents((prev) => prev.filter((ev) => ev.id !== deleteConfirmation.id));
        showToast('Event deleted successfully');
      } else {
        const res = await fetch(`/api/admin/event-categories/${deleteConfirmation.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete category');
        setCategories((prev) => prev.filter((cat) => cat.id !== deleteConfirmation.id));
        showToast('Category deleted successfully');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete item', 'error');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const colorOptions = [
    { label: 'Blue', value: 'blue', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { label: 'Green', value: 'green', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { label: 'Purple', value: 'purple', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { label: 'Orange', value: 'orange', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { label: 'Red', value: 'red', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { label: 'Cyan', value: 'cyan', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">event</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Events & Masterclasses
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Create, schedule, and publish interactive sessions, workshops, new course announcements, and manage event categories.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {activeTab === 'events' ? (
            <button
              onClick={() => handleOpenEventModal()}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add New Event</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenCategoryModal()}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'events'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-lg">calendar_month</span>
          <span>All Events</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300 font-semibold">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'categories'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-lg">category</span>
          <span>Event Categories</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300 font-semibold">
            {categories.length}
          </span>
        </button>
      </div>

      {loading ? (
        <Loader className="py-20" text="Loading events data..." />
      ) : activeTab === 'events' ? (
        /* ══════════════════════════════════════════════════════════════════════
           EVENTS TAB
           ══════════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, description, or badge..."
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="1">Active (Published)</option>
                <option value="0">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <span className="material-symbols-outlined text-4xl">event_busy</span>
              </div>
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                {search || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'No events match your current search or filter criteria.'
                  : 'Start by creating your first scheduled workshop or live webinar!'}
              </p>
              <button
                onClick={() => handleOpenEventModal()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Create Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => {
                const colorDef =
                  colorOptions.find((c) => c.value === ev.color) || colorOptions[0];

                return (
                  <div
                    key={ev.id}
                    className="bg-[#161b22] border border-[#30363d] hover:border-slate-600 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group"
                  >
                    {/* Event Banner */}
                    <div className="relative h-44 w-full bg-[#0d1117] overflow-hidden">
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                          <span className="material-symbols-outlined text-4xl">event</span>
                          <span className="text-xs">No banner image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />

                      {/* Badges Top Bar */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border backdrop-blur-md ${colorDef.bg}`}
                        >
                          {ev.badge || 'EVENT'}
                        </span>

                        <div className="flex items-center gap-1">
                          {Boolean(ev.is_featured) && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                              ★ Featured
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                              ev.status === 1
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-700/60 text-slate-300 border-slate-600'
                            }`}
                          >
                            {ev.status === 1 ? 'Active' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Category & Date */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-primary font-semibold">
                            {ev.category?.name || 'General'}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1 text-slate-300 truncate">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            <span className="truncate">{ev.date_text}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                          {ev.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-[#30363d] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleEventStatus(ev)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                        >
                          {ev.status === 1 ? 'Deactivate' : 'Publish'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEventModal(ev)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Edit Event"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                type: 'event',
                                id: ev.id,
                                title: ev.title,
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Event"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
           CATEGORIES TAB
           ══════════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#30363d] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Event Categories</h3>
                <p className="text-xs text-slate-400">
                  Categories group workshops, webinars, and special promotional sessions.
                </p>
              </div>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Category</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#30363d] bg-[#0d1117] text-slate-400 text-xs font-semibold">
                    <th className="py-3 px-5">Category Name</th>
                    <th className="py-3 px-5">Slug</th>
                    <th className="py-3 px-5">Color Theme</th>
                    <th className="py-3 px-5">Sort Order</th>
                    <th className="py-3 px-5">Events Count</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {categories.map((cat) => {
                    const colorDef =
                      colorOptions.find((c) => c.value === cat.color) || colorOptions[0];

                    return (
                      <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-5 font-bold text-white">{cat.name}</td>
                        <td className="py-3.5 px-5 text-slate-400 font-mono text-xs">
                          {cat.slug}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colorDef.bg}`}
                          >
                            {cat.color || 'blue'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-300">{cat.sort_order ?? 0}</td>
                        <td className="py-3.5 px-5">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {cat.eventCount || 0} events
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                              cat.status === 1
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700/60 text-slate-400'
                            }`}
                          >
                            {cat.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenCategoryModal(cat)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="Edit Category"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  type: 'category',
                                  id: cat.id,
                                  title: cat.name,
                                })
                              }
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete Category"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         EVENT CREATE / EDIT MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">
                    {editingEvent ? 'edit_calendar' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill in the details to publish or update this event.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Title & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Event Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Advanced CAESAR II Pipe Stress Masterclass"
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Badge Label</label>
                  <input
                    type="text"
                    value={eventFormData.badge}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="e.g. LIVE, NEW, WEBINAR"
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Category & Date/Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={eventFormData.category_id}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, category_id: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Date / Schedule Text <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.date_text}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, date_text: e.target.value }))
                    }
                    placeholder="e.g. Dec 20, 2026 at 6:00 PM IST"
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Theme Color</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setEventFormData((prev) => ({ ...prev, color: c.value }))}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${c.bg} ${
                        eventFormData.color === c.value
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#161b22]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Event Banner Image
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">
                      {uploadingImage ? 'sync' : 'upload_file'}
                    </span>
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  </button>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={eventFormData.image}
                      onChange={(e) =>
                        setEventFormData((prev) => ({ ...prev, image: e.target.value }))
                      }
                      placeholder="Or paste direct image URL (/uploads/events/...)"
                      className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {eventFormData.image && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#30363d] mt-2">
                    <img
                      src={eventFormData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEventFormData((prev) => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      title="Remove Image"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Link URL & Button Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Action Link URL</label>
                  <input
                    type="text"
                    value={eventFormData.link_url}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, link_url: e.target.value }))
                    }
                    placeholder="e.g. /courses or /contact or external URL"
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Button Label</label>
                  <input
                    type="text"
                    value={eventFormData.link_text}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, link_text: e.target.value }))
                    }
                    placeholder="e.g. Learn More, Register Free"
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Event Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={eventFormData.description}
                  onChange={(e) =>
                    setEventFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Provide details about what attendees will learn, prerequisites, live schedule details, etc."
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary leading-relaxed resize-none"
                />
              </div>

              {/* Featured & Status Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={eventFormData.is_featured}
                    onChange={(e) =>
                      setEventFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                    }
                    className="rounded border-[#30363d] text-primary focus:ring-primary w-4 h-4 bg-[#0d1117]"
                  />
                  <span>Mark as Featured Event</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={eventFormData.status === 1}
                    onChange={(e) =>
                      setEventFormData((prev) => ({
                        ...prev,
                        status: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="rounded border-[#30363d] text-primary focus:ring-primary w-4 h-4 bg-[#0d1117]"
                  />
                  <span>Publish Immediately (Active)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {eventSubmitting && (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  <span>{editingEvent ? 'Save Changes' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         CATEGORY CREATE / EDIT MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add Event Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Masterclasses, Workshops"
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Slug (Optional)</label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="Auto-generated if left empty"
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Color Theme</label>
                <select
                  value={categoryFormData.color}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Sort Order</label>
                <input
                  type="number"
                  value={categoryFormData.sort_order}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {categorySubmitting && (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  <span>{editingCategory ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         DELETE CONFIRMATION MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">"{deleteConfirmation.title}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
