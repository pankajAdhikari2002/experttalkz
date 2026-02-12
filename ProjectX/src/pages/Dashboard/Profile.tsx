import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Meta from '../../components/common/Meta';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20 px-4 md:px-6 pt-8">
      <Meta title="My Profile | ExpertTalkz" description="Manage your account settings." />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Profile Settings</h1>
          <p className="text-slate-400 font-medium">Manage your personal information, security, and preferences.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-sm px-4 py-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-xs font-bold text-white uppercase tracking-widest">Account Status: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 flex flex-col gap-2">
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-sm transition-all">
              <span className="material-symbols-outlined !text-[20px]">person</span>
              Personal Info
           </button>
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-bold text-sm transition-all">
              <span className="material-symbols-outlined !text-[20px]">security</span>
              Security
           </button>
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-bold text-sm transition-all">
              <span className="material-symbols-outlined !text-[20px]">notifications</span>
              Notifications
           </button>
           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-bold text-sm transition-all">
              <span className="material-symbols-outlined !text-[20px]">payments</span>
              Billing & History
           </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-b border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>

            <div className="px-6 md:px-10 pb-10 -mt-12 relative z-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                {/* Profile Header Block */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-white/5">
                  <div className="w-24 h-24 rounded-2xl bg-surface-dark border-4 border-card-dark flex items-center justify-center text-primary relative group shadow-xl">
                    <span className="material-symbols-outlined !text-[56px]">account_circle</span>
                    <button type="button" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="material-symbols-outlined text-white !text-[24px]">photo_camera</span>
                    </button>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                    <p className="text-sm text-slate-400 mb-2">{user?.email}</p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black uppercase text-primary tracking-widest">
                       LMS Student Package
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,44,44,0.1)]'
                  }`}>
                    <span className="material-symbols-outlined text-lg">
                      {message.type === 'success' ? 'verified' : 'report'}
                    </span>
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="flex flex-col gap-2.5">
                    <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 opacity-60 cursor-not-allowed">
                    <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address (Read-only)</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-slate-500 outline-none cursor-not-allowed font-medium"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-500">Location</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      placeholder="e.g. New York, USA"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-500">Professional Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all font-medium min-h-[120px] resize-none"
                      placeholder="Tell us about yourself, your skills, and what you're learning..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5">
                  <Button type="submit" size="lg" disabled={loading} className="px-10">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </div>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-orange-500/5 rounded-2xl border border-orange-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                   <span className="material-symbols-outlined !text-[28px]">verified_user</span>
                </div>
                <div>
                   <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                   <p className="text-sm text-slate-400">Add an extra layer of security to your account.</p>
                </div>
             </div>
             <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white">Enable 2FA</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
