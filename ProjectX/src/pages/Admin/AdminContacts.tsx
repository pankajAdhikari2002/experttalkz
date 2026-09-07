import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';

interface ContactItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ip_address?: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Selected message for detail modal
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setContacts(data.items || []);
        setTotalCount(data.total || 0);
        setUnreadCount(data.unreadCount || 0);
        window.dispatchEvent(new CustomEvent('inquiriesUpdated', { detail: { unreadCount: data.unreadCount || 0 } }));
      } else {
        showToast('Failed to load contact inquiries', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while loading inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c))
        );
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus as any });
        }
        showToast(`Marked as ${newStatus}`);
        // update unread count
        if (newStatus === 'read') {
          setUnreadCount((c) => {
            const next = Math.max(0, c - 1);
            window.dispatchEvent(new CustomEvent('inquiriesUpdated', { detail: { unreadCount: next } }));
            return next;
          });
        } else if (newStatus === 'unread') {
          setUnreadCount((c) => {
            const next = c + 1;
            window.dispatchEvent(new CustomEvent('inquiriesUpdated', { detail: { unreadCount: next } }));
            return next;
          });
        }
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/contacts/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== deleteModal.id));
        setTotalCount((c) => Math.max(0, c - 1));
        if (selectedContact?.id === deleteModal.id) {
          setSelectedContact(null);
        }
        showToast('Inquiry deleted successfully');
        setDeleteModal(null);
      } else {
        showToast('Failed to delete inquiry', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const openDetailModal = (contact: ContactItem) => {
    setSelectedContact(contact);
    if (contact.status === 'unread') {
      handleStatusChange(contact.id, 'read');
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium border animate-slideDown ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
              : 'bg-red-950/90 text-red-300 border-red-500/40'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Inquiries & Contact Leads
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-black">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and respond to messages submitted through the website contact form.
          </p>
        </div>

        <button
          onClick={fetchContacts}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-[#161b22] border border-[#30363d] p-3 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, phone, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Read' },
            { id: 'replied', label: 'Replied' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-primary text-black font-bold shadow-sm shadow-primary/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <Loader className="py-20" text="Loading contact messages..." />
        ) : contacts.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h3 className="text-base font-bold text-white">No contact inquiries found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Any messages submitted via the website contact form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Sender</th>
                  <th className="px-5 py-3.5">Subject & Message</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d] text-xs">
                {contacts.map((c) => {
                  const isUnread = c.status === 'unread';

                  return (
                    <tr
                      key={c.id}
                      className={`transition-colors hover:bg-white/[0.02] cursor-pointer ${
                        isUnread ? 'bg-primary/[0.03]' : ''
                      }`}
                      onClick={() => openDetailModal(c)}
                    >
                      {/* Sender */}
                      <td className="px-5 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              isUnread
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`font-bold truncate ${
                                isUnread ? 'text-white' : 'text-slate-300'
                              }`}
                            >
                              {c.name}
                            </span>
                            <span className="text-slate-400 text-[11px] truncate">{c.email}</span>
                            {c.phone && (
                              <span className="text-slate-500 text-[10px] truncate">{c.phone}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject & Preview */}
                      <td className="px-5 py-4 max-w-md">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`font-semibold line-clamp-1 ${
                              isUnread ? 'text-primary' : 'text-white'
                            }`}
                          >
                            {c.subject || 'Website Inquiry'}
                          </span>
                          <span className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                            {c.message}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                            c.status === 'unread'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : c.status === 'replied'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                          }`}
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {formatDate(c.created_at)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openDetailModal(c)}
                            title="View Message"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>

                          <a
                            href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(
                              c.subject || 'ExpertTalkz Inquiry'
                            )}`}
                            title="Reply via Email"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">mail</span>
                          </a>

                          <button
                            onClick={() => setDeleteModal({ id: c.id, name: c.name })}
                            title="Delete Inquiry"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#30363d] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Inquiry Details
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedContact.subject || 'Website Inquiry'}
                </h3>
                <span className="text-xs text-slate-400 block">
                  Received on {formatDate(selectedContact.created_at)}
                </span>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Sender Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">From</span>
                <div className="text-xs font-bold text-white">{selectedContact.name}</div>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-xs text-primary hover:underline block truncate"
                >
                  {selectedContact.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Contact Phone & Status
                </span>
                <div className="text-xs font-bold text-white">
                  {selectedContact.phone ? (
                    <a href={`tel:${selectedContact.phone}`} className="hover:text-primary">
                      {selectedContact.phone}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </div>
                <div className="text-[11px] text-slate-400 capitalize">
                  Status: <span className="text-white font-bold">{selectedContact.status}</span>
                </div>
              </div>
            </div>

            {/* Full Message Box */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Message Content
              </span>
              <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedContact.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#30363d]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedContact.id,
                      selectedContact.status === 'unread' ? 'read' : 'unread'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Mark as {selectedContact.status === 'unread' ? 'Read' : 'Unread'}
                </button>
                <button
                  onClick={() => handleStatusChange(selectedContact.id, 'replied')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-semibold transition-colors"
                >
                  Mark as Replied
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(
                    selectedContact.subject || 'ExpertTalkz Inquiry'
                  )}`}
                  className="px-4 py-2 rounded-xl bg-primary text-black font-extrabold text-xs shadow-md shadow-primary/20 hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Inquiry?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete the message from{' '}
                <strong className="text-white">{deleteModal.name}</strong>? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Inquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
