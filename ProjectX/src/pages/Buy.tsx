import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import { useAuth } from '../context/AuthContext';

const Buy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
  });

  const [processing, setProcessing] = useState(false);

  // Mock course data - in production, fetch based on slug
  const course = {
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    price: 89.99,
    originalPrice: 199.99,
    discount: 55,
    image: '💻',
    duration: '52 hours',
    lessons: 380,
    level: 'Beginner to Advanced',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/buy/${slug}` } });
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      alert('Payment successful! You now have access to the course.');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <>
      <Meta title={`Buy ${course.title} | ExpertTalkz`} description="Complete your purchase" />
      
      <Section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
              Back to Course
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-card-dark border border-white/10 rounded-2xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                {/* Course Card */}
                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl shrink-0">
                      {course.image}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-400">by {course.instructor}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[14px]">schedule</span>
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[14px]">play_circle</span>
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[14px]">signal_cellular_alt</span>
                      {course.level}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Original Price</span>
                    <span className="line-through">${course.originalPrice}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>Discount ({course.discount}%)</span>
                    <span>-${(course.originalPrice - course.price).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex justify-between text-white text-xl font-black">
                    <span>Total</span>
                    <span>${course.price}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3">What's Included:</h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    {[
                      'Lifetime access',
                      'Certificate of completion',
                      'Downloadable resources',
                      '30-day money-back guarantee',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[16px] text-primary">check_circle</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-card-dark border border-white/10 rounded-2xl p-8 md:p-10">
                <h1 className="text-3xl font-black text-white mb-2">Checkout</h1>
                <p className="text-slate-400 mb-8">Complete your purchase securely</p>

                {!isAuthenticated && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <span className="material-symbols-outlined text-orange-400 !text-[24px]">info</span>
                    <div>
                      <p className="text-orange-400 font-bold text-sm mb-1">Sign in required</p>
                      <p className="text-slate-300 text-sm">You need to be logged in to complete this purchase.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* User Info */}
                  {isAuthenticated && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary !text-[24px]">account_circle</span>
                        <h3 className="font-bold text-white">{user?.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400">{user?.email}</p>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Payment Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="cardNumber" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="cardName" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                          Cardholder Name
                        </label>
                        <input
                          id="cardName"
                          name="cardName"
                          type="text"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            Expiry Date
                          </label>
                          <input
                            id="expiryDate"
                            name="expiryDate"
                            type="text"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            CVV
                          </label>
                          <input
                            id="cvv"
                            name="cvv"
                            type="text"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Billing Address</h3>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="billingAddress" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                          Street Address
                        </label>
                        <input
                          id="billingAddress"
                          name="billingAddress"
                          type="text"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          placeholder="123 Main St"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            ZIP Code
                          </label>
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="10001"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-white/5">
                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Processing Payment...
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined !text-[20px] mr-2">lock</span>
                          Complete Purchase - ${course.price}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-slate-500 text-center mt-4">
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Buy;
