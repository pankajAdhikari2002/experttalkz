import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Meta from '../../components/common/Meta';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signup(name, email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Sign Up | ExpertTalkz" description="Create an account to start your learning journey." />
      <div className="min-h-screen flex items-center justify-center bg-background-dark py-20 px-4">
        <div className="w-full max-w-md bg-card-dark rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-[#9dabb9]">Join ExpertTalkz and start masters tech skills</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" required className="rounded border-gray-300 text-primary focus:ring-primary" id="terms" />
                <label htmlFor="terms" className="text-slate-400 cursor-pointer">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>
                </label>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 text-center text-xs text-slate-500 border-t border-white/5">
            By signing up, you agree to our research and data usage policy.
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
