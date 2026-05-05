import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Meta from '../components/common/Meta';
import Section from '../components/common/Section';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Buy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (slug) {
        const data = await api.getCourseBySlug(slug);
        if (data) {
          setCourse({
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
      }
      setLoading(false);
    };
    loadCourse();
  }, [slug]);

  const createOrder = async () => {
    try {
        const response = await api.createPaypalOrder(slug || 'default');
        if (response.id) return response.id;
        throw new Error('Failed to create order on backend');
    } catch (error) {
        console.error(error);
        alert('Failed to initiate PayPal Checkout.');
        return "";
    }
  };

  const onApprove = async (data: any) => {
    setProcessing(true);
    try {
        const response = await api.capturePaypalOrder(data.orderID);
        if (response.success) {
            alert('Payment successful! You now have access to the course.');
            navigate('/dashboard');
        } else {
            alert('Payment capture failed.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while verifying the payment.');
    } finally {
        setProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background-dark pt-32 flex justify-center"><div className="animate-spin text-primary material-symbols-outlined text-4xl">autorenew</div></div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-background-dark pt-32 text-center text-slate-400">Course not found.</div>;
  }

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
                
                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden text-4xl">
                      {course.image?.includes('/') ? (
                         <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(http://localhost:3000/${course.image})` }}></div>
                      ) : (
                         course.image
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-400">by {course.instructor}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Original Price</span>
                    <span className="line-through">${course.originalPrice}</span>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex justify-between text-white text-xl font-black">
                    <span>Total</span>
                    <span>${course.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Options */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-card-dark border border-white/10 rounded-2xl p-8 md:p-10">
                <h1 className="text-3xl font-black text-white mb-2">Checkout</h1>
                <p className="text-slate-400 mb-8">Complete your secure transaction via PayPal</p>

                {processing && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-primary !text-[32px]">autorenew</span>
                    <p className="text-primary font-bold text-lg">Verifying transaction...</p>
                  </div>
                )}

                {!isAuthenticated ? (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="material-symbols-outlined text-orange-400 !text-[48px]">account_circle</span>
                    <h3 className="text-orange-400 font-bold text-xl">Sign in required</h3>
                    <p className="text-slate-300 mb-4 max-w-sm">You must be logged into your ExpertTalkz account to securely process this enrollment.</p>
                    <button onClick={() => navigate('/login', { state: { from: `/buy/${slug}` } })} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                      Go to Sign In
                    </button>
                  </div>
                ) : (
                  !processing && (
                    <div className="p-4 bg-white rounded-xl">
                      <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD", intent: "capture" }}>
                        <PayPalButtons 
                           style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }} 
                           createOrder={createOrder}
                           onApprove={onApprove}
                           onError={() => alert('PayPal button failed to render. Please try again.')}
                        />
                      </PayPalScriptProvider>
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
