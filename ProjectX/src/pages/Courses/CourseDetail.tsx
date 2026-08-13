import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Course } from '../../types';
import { api } from '../../services/api';
import Section from '../../components/common/Section';
import Button from '../../components/common/Button';
import Meta from '../../components/common/Meta';
import { CheckCircle, Clock, BarChart } from 'lucide-react';

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (slug) {
        try {
          const data = await api.getCourseBySlug(slug);
          setCourse(data || null);
        } catch (error) {
          console.error('Failed to fetch course', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) return <Section><div>Loading...</div></Section>;
  if (!course) return <Section><div>Course not found</div></Section>;

  return (
    <>
      <Meta 
        title={`${course.course_name} | ExpertTalkz`} 
        description={course.description}
      />
      {/* Hero */}
      <div className="bg-background-dark text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <button 
            onClick={() => navigate(-1)}
            className="text-[#9dabb9] hover:text-white mb-8 inline-flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <span>←</span> Back to Courses
          </button>
          <div className="flex gap-4 mb-8">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
              {course.level}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
              {course.course_duration}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-6 max-w-[800px] text-white">
            {course.course_name}
          </h1>
          <div 
            className="text-xl leading-relaxed text-[#9dabb9] max-w-[700px] mb-12"
            dangerouslySetInnerHTML={{ __html: course.short_description || course.description }}
          />
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-white">${course.discount_price || course.price}</span>
            </div>
            <Link to={`/buy/${slug}`}>
              <Button size="lg" className="px-8 py-3 font-bold bg-white text-black hover:bg-gray-100 border-none">Enroll Now</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <Section>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_350px] gap-16 lg:gap-32 items-start">
          <div className="flex flex-col gap-12">
            {course.long_description && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Course Overview</h2>
                <div 
                  className="prose prose-invert max-w-none text-[#9dabb9] leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: course.long_description }}
                />
              </div>
            )}

            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">What You'll Learn</h2>
              {course.learnings && course.learnings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learnings.map((point, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-4 bg-card-dark rounded-xl border border-white/5">
                      <CheckCircle size={22} className="text-primary mt-0.5 shrink-0" />
                      <span className="leading-relaxed text-[#9dabb9]">{point}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">No learning points added yet. Add them from your admin panel.</p>
              )}
            </div>
          </div>
          
          <div className="bg-card-dark p-10 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-white">Course Features</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-3 text-[#9dabb9]">
                <Clock size={20} className="text-primary" /> 
                <span className="font-medium">{course.course_duration} Duration</span>
              </li>
              <li className="flex items-center gap-3 text-[#9dabb9]">
                <BarChart size={20} className="text-primary" /> 
                <span className="font-medium">{course.level} Level</span>
              </li>
              <li className="flex items-center gap-3 text-[#9dabb9]">
                <CheckCircle size={20} style={{ color: 'var(--primary)' }} /> 
                <span style={{ fontWeight: 500 }}>Certificate of Completion</span>
              </li>
            </ul>
             <div className="mt-8 pt-8 border-t border-white/5">
                 <p className="text-sm text-[#9dabb9] leading-relaxed">
                     Need help? Contact our support team for any questions about this course.
                 </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default CourseDetail;
