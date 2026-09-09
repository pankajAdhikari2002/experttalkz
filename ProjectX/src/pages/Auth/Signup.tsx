import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Meta from '../../components/common/Meta';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Check, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s.'\-\u00C0-\u024F\u1E00-\u1EFF]+$/;

interface PasswordRules {
  length: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const checkPasswordRules = (pass: string): PasswordRules => ({
  length: pass.length >= 8 && pass.length <= 72,
  hasUpper: /[A-Z]/.test(pass),
  hasLower: /[a-z]/.test(pass),
  hasNumber: /[0-9]/.test(pass),
  hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pass),
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean; confirmPassword?: boolean; terms?: boolean }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const rules = checkPasswordRules(password);
  const rulesCount = Object.values(rules).filter(Boolean).length;

  const getStrengthMeta = () => {
    if (!password) return { label: '', color: 'bg-slate-700', width: 'w-0' };
    if (rulesCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (rulesCount === 3) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (rulesCount === 4) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-400', width: 'w-full' };
  };

  const validateField = (field: string, val: string): string => {
    switch (field) {
      case 'name': {
        const trimmed = val.trim();
        if (!trimmed) return 'Full name is required.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        if (trimmed.length > 70) return 'Name cannot exceed 70 characters.';
        if (!NAME_REGEX.test(trimmed)) return 'Name can only contain letters, spaces, hyphens, and periods.';
        return '';
      }
      case 'email': {
        const trimmed = val.trim();
        if (!trimmed) return 'Email address is required.';
        if (trimmed.length > 100) return 'Email cannot exceed 100 characters.';
        if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
        return '';
      }
      case 'password': {
        if (!val) return 'Password is required.';
        if (val.length < 8) return 'Password must be at least 8 characters long.';
        if (val.length > 72) return 'Password cannot exceed 72 characters.';
        if (!rules.hasUpper || !rules.hasLower || !rules.hasNumber || !rules.hasSpecial) {
          return 'Password does not meet all required complexity criteria.';
        }
        return '';
      }
      case 'confirmPassword': {
        if (!val) return 'Please confirm your password.';
        if (val !== password) return 'Passwords do not match.';
        return '';
      }
      case 'terms': {
        if (!agreedTerms) return 'You must agree to the Terms of Service to create an account.';
        return '';
      }
      default:
        return '';
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'name' ? name : field === 'email' ? email : field === 'password' ? password : confirmPassword;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err || undefined }));
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateField('name', val) || undefined }));
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) || undefined }));
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) || undefined }));
    }
    if (touched.confirmPassword && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: val !== confirmPassword ? 'Passwords do not match.' : undefined,
      }));
    }
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: val !== password ? 'Passwords do not match.' : undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    const nameErr = validateField('name', name);
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    const confErr = validateField('confirmPassword', confirmPassword);
    const termsErr = !agreedTerms ? 'You must agree to the Terms of Service.' : '';

    const newErrors = {
      ...(nameErr && { name: nameErr }),
      ...(emailErr && { email: emailErr }),
      ...(passErr && { password: passErr }),
      ...(confErr && { confirmPassword: confErr }),
      ...(termsErr && { terms: termsErr }),
    };
    setErrors(newErrors);

    if (nameErr) {
      nameRef.current?.focus();
      return;
    }
    if (emailErr) {
      emailRef.current?.focus();
      return;
    }
    if (passErr) {
      passwordRef.current?.focus();
      return;
    }
    if (confErr) {
      confirmPasswordRef.current?.focus();
      return;
    }
    if (termsErr) {
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name.trim(), email.trim().toLowerCase(), password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setServerError(result.message || 'Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const strengthMeta = getStrengthMeta();

  return (
    <>
      <Meta title="Create Account | ExpertTalkz" description="Sign up to access engineering courses, tutorials, and certifications." />
      
      <div className="min-h-screen flex items-center justify-center bg-background-dark py-16 px-4 relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-[#0e1726]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 relative z-10 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">Join ExpertTalkz</h1>
            <p className="text-xs text-slate-400">Create an account to master engineering skills & track courses</p>
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-name" className="text-xs font-semibold text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <UserIcon size={16} />
                  </div>
                  <input
                    ref={nameRef}
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={handleChangeName}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. John Doe"
                    aria-invalid={!!errors.name}
                    className={`w-full pl-10 pr-4 h-11 rounded-xl bg-surface-dark text-white text-sm outline-none transition-all placeholder-slate-500 border ${
                      touched.name && errors.name
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5'
                        : touched.name && !errors.name && name.trim()
                        ? 'border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-email" className="text-xs font-semibold text-slate-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    ref={emailRef}
                    id="signup-email"
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-password" className="text-xs font-semibold text-slate-300">
                  Create Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    ref={passwordRef}
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={handleChangePassword}
                    onBlur={() => handleBlur('password')}
                    placeholder="Min. 8 characters"
                    aria-invalid={!!errors.password}
                    className={`w-full pl-10 pr-11 h-11 rounded-xl bg-surface-dark text-white text-sm outline-none transition-all placeholder-slate-500 border ${
                      touched.password && errors.password
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5'
                        : touched.password && !errors.password && password
                        ? 'border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
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

                {/* Password Strength Indicator Bar */}
                {password && (
                  <div className="pt-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Password Strength:</span>
                      <span className={`font-bold ${
                        rulesCount <= 2 ? 'text-red-400' : rulesCount === 3 ? 'text-amber-400' : rulesCount === 4 ? 'text-blue-400' : 'text-emerald-400'
                      }`}>
                        {strengthMeta.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`} />
                    </div>
                  </div>
                )}

                {/* Interactive Password Criteria Checklist */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 mt-1 grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${rules.length ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    {rules.length ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0 text-slate-500" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    {rules.hasUpper ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0 text-slate-500" />}
                    <span>1 uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    {rules.hasLower ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0 text-slate-500" />}
                    <span>1 lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    {rules.hasNumber ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0 text-slate-500" />}
                    <span>1 number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${rules.hasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    {rules.hasSpecial ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0 text-slate-500" />}
                    <span>1 special character (!@#$%^&*)</span>
                  </div>
                </div>

                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Confirm Password <span className="text-red-400">*</span></span>
                  {confirmPassword && confirmPassword === password && (
                    <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                      <Check size={12} /> Matches
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    ref={confirmPasswordRef}
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Re-enter password"
                    aria-invalid={!!errors.confirmPassword}
                    className={`w-full pl-10 pr-11 h-11 rounded-xl bg-surface-dark text-white text-sm outline-none transition-all placeholder-slate-500 border ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5'
                        : touched.confirmPassword && !errors.confirmPassword && confirmPassword
                        ? 'border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: undefined }));
                      }
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-surface-dark text-primary focus:ring-primary accent-primary cursor-pointer" 
                  />
                  <span>
                    I agree to the ExpertTalkz{' '}
                    <Link to="/about" className="text-primary hover:underline font-semibold">
                      Terms of Service
                    </Link>{' '}
                    and Privacy Policy.
                  </span>
                </label>
                {touched.terms && errors.terms && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.terms}</span>
                  </p>
                )}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-4 text-center text-[11px] text-slate-400 border-t border-white/5">
            Your data is protected with enterprise-grade encryption.
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
