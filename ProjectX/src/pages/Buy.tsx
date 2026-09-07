import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Meta from '../components/common/Meta';
import Section from '../components/common/Section';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import Loader from '../components/common/Loader';

const Buy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currency, formatPrice } = useCurrency();
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  useEffect(() => {
    const loadCourseAndEnrollment = async () => {
      if (slug) {
        const data = await api.getCourseBySlug(slug);
        if (data) {
          setCourse({
            id: data.id,
            title: data.course_name,
            instructor: 'ExpertTalkz Instructor',
            price: data.discount_price || data.price,
            originalPrice: data.price,
            discount: data.discount_price ? Math.round(((data.price - data.discount_price) / data.price) * 100) : 0,
            image: data.thumbnail || '💻',
            duration: data.course_duration || 'Flexible',
            lessons: 40,
            level: data.level || 'All Levels',
          });
        }

        if (isAuthenticated) {
          const enrollCheck = await api.checkCourseEnrollment(slug);
          if (enrollCheck.enrolled) {
            setIsEnrolled(true);
          }
        }
      }
      setLoading(false);
    };
    loadCourseAndEnrollment();
  }, [slug, isAuthenticated]);

  const createOrder = async () => {
    setOrderError(null);
    try {
      const response = await api.createPaypalOrder(slug || 'default');
      if (response.id) return response.id;
      setOrderError(response.message || 'Failed to initialize PayPal order.');
      return '';
    } catch (error: any) {
      console.error(error);
      setOrderError(error?.message || 'Failed to initiate PayPal Checkout.');
      return '';
    }
  };

  const onApprove = async (data: any) => {
    setProcessing(true);
    setOrderError(null);
    try {
      const response = await api.capturePaypalOrder(data.orderID);
      if (response.success) {
        navigate('/dashboard', { state: { enrollmentSuccess: true } });
      } else {
        setOrderError('Payment capture could not be completed. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      setOrderError('An error occurred while verifying the payment capture.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background-dark pt-32 text-center text-slate-400">
        Course not found.
      </div>
    );
  }

  const courseImageUrl = course.image?.startsWith('http')
    ? course.image
    : course.image?.includes('/')
    ? `${window.location.origin}/${course.image.replace(/^\//, '')}`
    : null;

  return (
    <>
      <Meta title={`Checkout: ${course.title} | ExpertTalkz`} description="Complete your course enrollment" />
      
      <Section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(`/courses/${slug}`)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
              Back to Course Details
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-card-dark border border-white/10 rounded-2xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden text-3xl">
                      {courseImageUrl ? (
                         <img src={courseImageUrl} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                         course.image
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">Course</span>
                      <h3 className="font-bold text-white text-sm mt-1 mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-slate-400">Duration: {course.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Base Tuition</span>
                    <span>{formatPrice(course.originalPrice || course.price)}</span>
                  </div>
                  {course.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 text-sm font-semibold">
                      <span>Discount ({course.discount}% OFF)</span>
                      <span>-{formatPrice((course.originalPrice || course.price) - course.price)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/10 flex justify-between text-white text-xl font-black">
                    <span>Total Due</span>
                    <span className="text-primary">{formatPrice(course.price)}</span>
                  </div>
                  {currency === 'INR' && (
                    <p className="text-[11px] text-slate-400 text-right">
                      (Approx. ${course.price} USD)
                    </p>
                  )}
                </div>

                <div className="bg-white/5 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <span className="material-symbols-outlined !text-[14px] text-emerald-400">verified</span>
                    Instant Account Activation
                  </div>
                  <p>Course content and resources are unlocked in your Student Dashboard immediately after payment.</p>
                </div>
              </div>
            </div>

            {/* Checkout Area */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-card-dark border border-white/10 rounded-2xl p-8 md:p-10">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-black text-white">Checkout</h1>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    PayPal Sandbox Mode
                  </span>
                </div>
                <p className="text-slate-400 mb-8">Complete your secure transaction via PayPal</p>

                {orderError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm flex items-center gap-3">
                    <span className="material-symbols-outlined !text-[20px]">error</span>
                    <div>{orderError}</div>
                  </div>
                )}

                {processing && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 mb-8 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-primary font-bold text-sm">Verifying transaction & unlocking course...</p>
                  </div>
                )}

                {isEnrolled ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
                      <span className="material-symbols-outlined !text-[36px]">check_circle</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">You Already Own This Course!</h3>
                      <p className="text-slate-300 text-sm max-w-md mx-auto">
                        This course is already enrolled and active in your student account. You don't need to purchase it again.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <Link
                        to="/dashboard"
                        className="bg-primary hover:bg-yellow-400 text-black font-black px-6 py-3 rounded-xl transition-all shadow-lg"
                      >
                        Go to My Dashboard
                      </Link>
                      <Link
                        to={`/courses/${slug}`}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                      >
                        View Course Details
                      </Link>
                    </div>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="material-symbols-outlined text-orange-400 !text-[56px]">account_circle</span>
                    <h3 className="text-orange-400 font-bold text-2xl">Sign In Required</h3>
                    <p className="text-slate-300 max-w-md">
                      Please sign in to your ExpertTalkz account before purchasing so we can immediately link the course to your profile.
                    </p>
                    <button
                      onClick={() => navigate('/login', { state: { from: `/buy/${slug}` } })}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                    >
                      Sign In to Continue
                    </button>
                  </div>
                ) : (
                  !processing && (
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-900 border border-white/10 rounded-2xl">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-white mb-1">Pay with PayPal</h4>
                          <p className="text-xs text-slate-400">
                            Use your PayPal account or credit/debit card to complete testing.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-xl shadow-inner">
                          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD', intent: 'capture' }}>
                            <PayPalButtons
                              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={(err) => {
                                console.error('PayPal SDK render error:', err);
                                setOrderError('PayPal checkout could not load. Please check Sandbox Client ID configuration.');
                              }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      </div>

                      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined !text-[16px] text-slate-400">lock</span>
                        <span>Transactions are encrypted and secured via PayPal Sandbox environment.</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Buy;
