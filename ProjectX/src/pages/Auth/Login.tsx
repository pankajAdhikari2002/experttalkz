import { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuthToken, getDecodedToken } from '../../utils/authStorage';
import Button from '../../components/common/Button';
import Meta from '../../components/common/Meta';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';


const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateField = (field: 'email' | 'password', val: string): string => {
    if (field === 'email') {
      const trimmed = val.trim();
      if (!trimmed) return 'Email address is required.';
      if (trimmed.length > 100) return 'Email cannot exceed 100 characters.';
      if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address (e.g. name@domain.com).';
      return '';
    }
    if (field === 'password') {
      if (!val) return 'Password is required.';
      return '';
    }
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'email' ? email : password;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err || undefined }));
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      const err = validateField('email', val);
      setErrors((prev) => ({ ...prev, email: err || undefined }));
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      const err = validateField('password', val);
      setErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    setTouched({ email: true, password: true });

    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);

    const newErrors: { email?: string; password?: string } = {};
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);

    if (emailErr) {
      emailRef.current?.focus();
      return;
    }
    if (passErr) {
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password, rememberMe);
      if (result.success) {
        const token = getAuthToken();
        if (token) {
          const decodedPayload = getDecodedToken(token);
          if (decodedPayload && decodedPayload.role === 'admin') {
            navigate('/admin');
            return;
          }
        }
        const from = (location.state as any)?.from || '/dashboard';
        navigate(from);
      } else {
        setServerError(result.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Sign In | ExpertTalkz" description="Sign in to access your student dashboard and courses." />
      
      <div className="min-h-screen flex items-center justify-center bg-background-dark py-16 px-4 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0e1726]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 relative z-10 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in with your email and password to continue</p>
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Email Address <span className="text-red-400">*</span></span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleChangeEmail}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className={`w-full pl-10 pr-4 h-11 rounded-xl bg-surface-dark text-white text-sm outline-none transition-all placeholder-slate-500 border ${
                      touched.email && errors.email
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5'
                        : touched.email && !errors.email && email.trim()
                        ? 'border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link to="/contact" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    ref={passwordRef}
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={handleChangePassword}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className={`w-full pl-10 pr-11 h-11 rounded-xl bg-surface-dark text-white text-sm outline-none transition-all placeholder-slate-500 border ${
                      touched.password && errors.password
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5'
                        : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-surface-dark text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary" 
                  />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                disabled={loading}
                className="mt-2 h-11 font-bold shadow-lg shadow-primary/10"
                icon={loading ? undefined : <ArrowRight size={16} />}
                iconPosition="right"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-primary hover:underline font-bold">
                Create an account
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-4 text-center text-[11px] text-slate-400 border-t border-white/5">
            Protected by multi-layer security & encrypted credentials.
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
