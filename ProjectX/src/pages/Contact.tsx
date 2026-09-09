import { useState, useRef } from 'react';
import Meta from '../components/common/Meta';
import { api } from '../services/api';
import type { ContactFormData } from '../types';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

type FormErrors = Partial<Record<keyof ContactFormData, string>>;
type TouchedFields = Partial<Record<keyof ContactFormData, boolean>>;

const NAME_REGEX = /^[a-zA-Z\s.'\-\u00C0-\u024F\u1E00-\u1EFF]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_CHARS_REGEX = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,16}$/;

const validateSingleField = (name: keyof ContactFormData, value: string): string => {
  const trimmed = value.trim();

  switch (name) {
    case 'name':
      if (!trimmed) return 'Full name is required.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (trimmed.length > 70) return 'Name cannot exceed 70 characters.';
      if (!NAME_REGEX.test(trimmed)) return 'Name can only contain letters, spaces, hyphens, and periods.';
      return '';

    case 'email':
      if (!trimmed) return 'Email address is required.';
      if (trimmed.length > 100) return 'Email cannot exceed 100 characters.';
      if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address (e.g. name@domain.com).';
      return '';

    case 'phone': {
      if (!trimmed) return 'Phone number is required.';
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 7) return 'Phone number must contain at least 7 digits.';
      if (digits.length > 15) return 'Phone number cannot exceed 15 digits.';
      if (!PHONE_CHARS_REGEX.test(trimmed)) return 'Please enter a valid phone format (e.g. +91 98765 43210).';
      return '';
    }

    case 'subject':
      if (!trimmed) return 'Subject is required.';
      if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
      if (trimmed.length > 150) return 'Subject cannot exceed 150 characters.';
      return '';

    case 'message':
      if (!trimmed) return 'Message is required.';
      if (trimmed.length < 10) return `Please provide at least 10 characters (${trimmed.length}/10 entered).`;
      if (trimmed.length > 3000) return 'Message cannot exceed 3000 characters.';
      return '';

    default:
      return '';
  }
};

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    subject: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const validateAll = (): { isValid: boolean; newErrors: FormErrors } => {
    const newErrors: FormErrors = {
      name: validateSingleField('name', formData.name),
      phone: validateSingleField('phone', formData.phone),
      email: validateSingleField('email', formData.email),
      subject: validateSingleField('subject', formData.subject),
      message: validateSingleField('message', formData.message),
    };

    // Filter out empty strings
    const cleanErrors: FormErrors = {};
    let isValid = true;
    (Object.keys(newErrors) as (keyof ContactFormData)[]).forEach((key) => {
      if (newErrors[key]) {
        cleanErrors[key] = newErrors[key];
        isValid = false;
      }
    });

    return { isValid, newErrors: cleanErrors };
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateSingleField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err || undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Re-validate dynamically if field was already touched
    if (touched[fieldName]) {
      const err = validateSingleField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Mark all as touched
    setTouched({
      name: true,
      phone: true,
      email: true,
      subject: true,
      message: true,
    });

    const { isValid, newErrors } = validateAll();
    setErrors(newErrors);

    if (!isValid) {
      setErrorMsg('Please correct the highlighted errors before submitting.');
      // Focus the first invalid field
      const firstErrorField = (Object.keys(newErrors) as (keyof ContactFormData)[])[0];
      if (firstErrorField && inputRefs[firstErrorField]?.current) {
        inputRefs[firstErrorField].current?.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const cleanData: ContactFormData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const response = await api.submitLead(cleanData);
      if (response.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
      } else {
        setErrorMsg(response.message || 'Failed to submit inquiry. Please check your details and try again.');
      }
    } catch (error: any) {
      console.error('Submission failed', error);
      setErrorMsg(error?.message || 'Network error occurred while submitting message.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine input state class
  const getInputStateClass = (fieldName: keyof ContactFormData) => {
    const isTouched = touched[fieldName];
    const hasError = !!errors[fieldName];

    if (isTouched && hasError) {
      return 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5';
    }
    if (isTouched && !hasError && formData[fieldName].trim().length > 0) {
      return 'border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';
    }
    return 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20';
  };

  const messageLength = formData.message.trim().length;

  return (
    <>
      <Meta 
        title="Contact Us | ExpertTalkz" 
        description="Get in touch with us for course inquiries, corporate training, or any other questions."
      />
      
      {/* Hero Banner Section */}
      <div 
        className="relative py-14 md:py-28 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/Cointainer/Handshake_A.png')" }}
      >
        <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            CONTACT US
          </h1>
          <p className="text-base md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md">
            Have questions? We would love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-white">Get in Touch</h2>
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Email Us</h3>
                <p className="text-[#9dabb9]"> info@expertalkzglobalsolutions.in</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Call Us</h3>
                <p className="text-[#9dabb9]">+91-7548969182</p>
                <p className="text-[#9dabb9]">+91-8527087566</p>
                <p className="text-[#9dabb9]">Mon-Sat from 8am to 9pm.</p>
                <p className="text-[#9dabb9]">We are available 24/7</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                <p className="text-[#9dabb9]">301, SahakarNagar, Sama</p>
                <p className="text-[#9dabb9]">Vadodara, Gujarat-390008</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card-dark p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl">
          {success ? (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Message Received!</h3>
              <p className="text-[#9dabb9] max-w-md mx-auto mb-6 text-sm">
                Thank you for contacting ExpertTalkz. Our team has received your inquiry and will get back to you shortly.
              </p>
              <button 
                type="button"
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-all"
                onClick={() => setSuccess(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Send Us a Message</h3>
                <p className="text-xs text-slate-400">Fill in the details below and we will get in touch.</p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                    <span>Full Name <span className="text-red-400">*</span></span>
                    {touched.name && !errors.name && formData.name.trim() && (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-0.5">
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </label>
                  <input 
                    id="contact-name"
                    ref={inputRefs.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    aria-invalid={!!errors.name}
                    className={`h-11 px-3.5 rounded-xl bg-surface-dark text-white outline-none transition-all placeholder-slate-500 text-sm ${getInputStateClass('name')}`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                    <span>Phone Number <span className="text-red-400">*</span></span>
                    {touched.phone && !errors.phone && formData.phone.trim() && (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-0.5">
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </label>
                  <input 
                    id="contact-phone"
                    ref={inputRefs.phone}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210" 
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    aria-invalid={!!errors.phone}
                    className={`h-11 px-3.5 rounded-xl bg-surface-dark text-white outline-none transition-all placeholder-slate-500 text-sm ${getInputStateClass('phone')}`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                  <span>Email Address <span className="text-red-400">*</span></span>
                  {touched.email && !errors.email && formData.email.trim() && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-0.5">
                      <CheckCircle2 size={12} /> Valid
                    </span>
                  )}
                </label>
                <input 
                  id="contact-email"
                  ref={inputRefs.email}
                  name="email" 
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!errors.email}
                  className={`h-11 px-3.5 rounded-xl bg-surface-dark text-white outline-none transition-all placeholder-slate-500 text-sm ${getInputStateClass('email')}`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                  <span>Subject <span className="text-red-400">*</span></span>
                  {touched.subject && !errors.subject && formData.subject.trim() && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-0.5">
                      <CheckCircle2 size={12} /> Valid
                    </span>
                  )}
                </label>
                <input 
                  id="contact-subject"
                  ref={inputRefs.subject}
                  name="subject" 
                  type="text"
                  placeholder="e.g. Inquiry about Piping Stress Analysis course" 
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={() => handleBlur('subject')}
                  aria-invalid={!!errors.subject}
                  className={`h-11 px-3.5 rounded-xl bg-surface-dark text-white outline-none transition-all placeholder-slate-500 text-sm ${getInputStateClass('subject')}`}
                />
                {touched.subject && errors.subject && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-slate-300">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-[11px] ${messageLength > 2800 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {messageLength} / 3000
                  </span>
                </div>
                <textarea 
                  id="contact-message"
                  ref={inputRefs.message}
                  name="message" 
                  rows={4}
                  placeholder="Tell us about your learning goals or specific requirements..." 
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  aria-invalid={!!errors.message}
                  className={`px-3.5 py-2.5 rounded-xl bg-surface-dark text-white outline-none transition-all resize-none placeholder-slate-500 text-sm ${getInputStateClass('message')}`}
                />
                {touched.message && errors.message && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="mt-3 h-12 w-full font-bold shadow-lg shadow-primary/10"
                icon={loading ? undefined : <Send size={18} />}
                iconPosition="right"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;
