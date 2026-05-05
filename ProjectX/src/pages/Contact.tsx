import { useState } from 'react';
import Meta from '../components/common/Meta';
import { api } from '../services/api';
import type { ContactFormData } from '../types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/common/Button';

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.submitLead(formData);
      if (response.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Meta 
        title="Contact Us | ExpertTalkz" 
        description="Get in touch with us for course inquiries, corporate training, or any other questions."
      />
      
      {/* Hero Banner Section */}
      <div className="relative py-16 md:py-28 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/Cointainer/Handshake_A.png')" }}>
        <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg cursor-pointer hover:scale-95 transition duration-300">
            CONTACT US
          </h1>
          <p className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md cursor-pointer hover:text-black transition duration-300">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
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
                  <p className="text-[#9dabb9]">Mon-Fri from 8am to 5pm.</p>
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
          <div className="bg-card-dark p-8 rounded-xl border border-white/5 shadow-sm">
            {success ? (
              <div className="text-center py-8">
                <h3 className="text-green-500 text-xl font-bold mb-4">Message Sent!</h3>
                <p className="text-[#9dabb9]">Thank you for contacting us. We will get back to you shortly.</p>
                <button 
                  className="mt-6 px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-white font-medium transition-colors"
                  onClick={() => setSuccess(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                     <label className="text-sm font-medium text-slate-300">Name</label>
                     <input 
                        className="h-10 px-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-500"
                        name="name" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-sm font-medium text-slate-300">Phone</label>
                     <input 
                        className="h-10 px-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-500"
                        name="phone" 
                        placeholder="+91 000-000-0000" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange}
                     />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-sm font-medium text-slate-300">Email</label>
                   <input 
                      className="h-10 px-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-500"
                      name="email" 
                      type="email"
                      placeholder="john123@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                   />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-sm font-medium text-slate-300">Subject</label>
                   <input 
                      className="h-10 px-3 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-500"
                      name="subject" 
                      placeholder="How can we help you?" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                   />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-sm font-medium text-slate-300">Message</label>
                   <textarea 
                      className="h-32 px-3 py-2 rounded-lg border border-white/10 bg-surface-dark text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder-slate-500"
                      name="message" 
                      placeholder="Tell us about your requirements.../Share your's thoughts ...." 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                   />
                </div>

                 <Button 
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-12 w-full"
                  icon={loading ? undefined : <Send size={18} />}
                  iconPosition="right"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
      </div>
    </>
  );
};

export default Contact;
