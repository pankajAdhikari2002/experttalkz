import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Current logged-in user email
  const [currentAdminEmail, setCurrentAdminEmail] = useState('');

  // Add User Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'admin',
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ id: number; email: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    try {
      const activeUser = localStorage.getItem('expertTalkz_active_user');
      if (activeUser) {
        const u = JSON.parse(activeUser);
        if (u.email) setCurrentAdminEmail(u.email);
      }
    } catch {}
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (search.trim()) params.append('search', search.trim());
      if (roleFilter !== '') params.append('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.items || []);
      } else {
        showToast('Failed to load user list', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  // Toggle Role (Admin <-> User)
  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    const prevUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        showToast(
          newRole === 'admin'
            ? 'User promoted to Administrator! They can now access the admin panel.'
            : 'Admin permissions revoked. User changed to student role.'
        );
      } else {
        const err = await res.json().catch(() => ({}));
        setUsers(prevUsers);
        showToast(err.message || 'Failed to update user role', 'error');
      }
    } catch (err) {
      setUsers(prevUsers);
      showToast('Network error updating role', 'error');
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const prevUsers = [...users];

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u))
    );

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (res.ok) {
        showToast(newStatus ? 'User account activated' : 'User account suspended');
      } else {
        const err = await res.json().catch(() => ({}));
        setUsers(prevUsers);
        showToast(err.message || 'Failed to update account status', 'error');
      }
    } catch (err) {
      setUsers(prevUsers);
      showToast('Network error updating status', 'error');
    }
  };

  // Create New User / Admin
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email.trim() || !newUserForm.password.trim()) {
      showToast('Email and Password are required', 'error');
      return;
    }

    setAddingUser(true);
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserForm),
      });

      if (res.ok) {
        showToast(`New ${newUserForm.role} account created successfully!`);
        setNewUserForm({ name: '', email: '', password: '', mobile: '', role: 'admin' });
        setAddModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Failed to create user', 'error');
      }
    } catch (err) {
      showToast('Error creating user account', 'error');
    } finally {
      setAddingUser(false);
    }
  };

  // Delete User Confirmation
  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/users/${deleteModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
        showToast(`Account for ${deleteModal.email} deleted`);
        setDeleteModal(null);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Failed to delete user', 'error');
      }
    } catch (err) {
      showToast('Network error deleting user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const studentCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-[#1b2a20] border-green-500/30 text-green-400'
              : 'bg-[#2a1b1b] border-red-500/30 text-red-400'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl">manage_accounts</span>
            </span>
            Access & Admin Team Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Control which accounts have administrative access to courses, blogs, and platform settings.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span className="material-symbols-outlined text-xl">person_add</span>
          Add Admin / User
        </button>
      </div>

      {/* Security Architecture Info Box */}
      <div className="bg-[#121824] border border-blue-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Role-Based Security Active</h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Only accounts with the <strong className="text-amber-400">ADMIN</strong> role can access the control panel. Normal students with the <strong className="text-slate-300">USER</strong> role are strictly restricted by backend guards and routed to the student dashboard upon login.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          JWT & Database Guards Active
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalUsers}</div>
            <div className="text-xs text-slate-400 font-medium">Total Registered Users</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{adminCount}</div>
            <div className="text-xs text-slate-400 font-medium">Administrators</div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{studentCount}</div>
            <div className="text-xs text-slate-400 font-medium">Students / Regular Users</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="admin">Administrators Only</option>
            <option value="user">Students / Normal Users Only</option>
          </select>

          {(search || roleFilter !== '') && (
            <button
              onClick={() => {
                setSearch('');
                setRoleFilter('');
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0d1117] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#30363d] select-none">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-4 py-4 font-bold">Contact / Phone</th>
                <th className="px-4 py-4 font-bold">Access Level (Role)</th>
                <th className="px-4 py-4 font-bold">Account Status</th>
                <th className="px-4 py-4 font-bold">Joined</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-sm text-slate-400">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#30363d] flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-3xl">person_off</span>
                      </div>
                      <div className="font-bold text-white text-base">No users found</div>
                      <p className="text-xs text-slate-400">
                        {search || roleFilter
                          ? 'Try adjusting your search criteria.'
                          : 'You can create a new administrator account using the button above.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = user.email === currentAdminEmail;

                  return (
                    <tr key={user.id} className="hover:bg-[#1f242c] transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                            user.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {user.name || 'Unnamed User'}
                              {isSelf && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4 text-xs text-slate-300">
                        {user.mobile ? (
                          <span className="font-mono">{user.mobile}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Role Selector */}
                      <td className="px-4 py-4">
                        <select
                          disabled={isSelf}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border focus:outline-none transition-all ${
                            user.role === 'admin'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                              : 'bg-slate-700/30 text-slate-300 border-[#30363d] hover:bg-slate-700/50'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <option value="admin" className="bg-[#161b22] text-amber-400">
                            🛡️ Administrator (Full Access)
                          </option>
                          <option value="user" className="bg-[#161b22] text-slate-300">
                            🎓 Student / User (No Admin)
                          </option>
                        </select>
                      </td>

                      {/* Active Status */}
                      <td className="px-4 py-4">
                        <button
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            user.is_active
                              ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                          {user.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() =>
                              setDeleteModal({
                                id: user.id,
                                email: user.email,
                                name: user.name || user.email,
                              })
                            }
                            title="Delete User Account"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: Add New Admin / User Modal ──────────────────────── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Create User / Admin Account
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone / Mobile (Optional)
                </label>
                <input
                  type="text"
                  value={newUserForm.mobile}
                  onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Role & Access Level
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="admin">🛡️ Administrator (Can access /admin panel)</option>
                  <option value="user">🎓 Student (Dashboard only, NO admin access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-yellow-400 text-black font-bold text-xs shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {addingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete User Confirmation ─────────────────────────── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h3 className="text-lg font-bold text-white">Delete User Account</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-white">{deleteModal.email}</strong>? All their profile data will be removed.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
