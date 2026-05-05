import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import { api } from '../services/api';
import type { Course, Category, Award } from '../types';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allCourses, allCats, allAwards] = await Promise.all([
          api.getCourses(),
          api.getCategories(),
          api.getAwards()
        ]);
        setFeaturedCourses(allCourses.filter(c => c.is_featured));
        setCategories(allCats);
        setAwards(allAwards);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
     return (
       <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white">
         <span className="material-symbols-outlined animate-spin text-5xl text-primary">autorenew</span>
         <p>Loading Offshore Data...</p>
       </div>
     );
  }

  return (
    <>
      <Meta 
        title="Expertalkz Global Solutions | No. 1 Offshore Engineering Training & Career Platform" 
        description="Launch your offshore engineering career with Expertalkz — India's leading training platform for Oil & Gas, Aviation, Shipping, Mining, and Fintech professionals. Expert mentors. Real industry skills. Global opportunities."
      />
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        {/*update here*/}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: 'url("https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/mxBjzOMVg4f2eoRR/oil-and-gas-platforms-A852DbQ2PWSrlJno.jpg")'}}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A] via-transparent to-transparent"></div>
        </div>
        {/*update till here*/}

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-32">
          <div className="max-w-2xl flex flex-col gap-6 items-start">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-primary !text-[16px]">verified</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">#1 Offshore Engineering Platform</span>
            </div>
            {/*updated here*/}
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-5xl drop-shadow-lg">
              "Shaping the Future of Oil & Gas Jobs, Training & Industry Solutions!"
            </h1>
            <h1 style={{backgroundColor: "royelblue"}}>
            <p className="text-lg font-medium italic leading-relexed text-white drop-shadow-md max-w-XXXL">
              Energy technology stands as a cornerstone of national development, encompassing the extraction, refinement, and distribution of energy resources, along with power generation and transportation fuels. It serves as a driving force behind economic expansion, guarantees reliable energy access, and fulfills the growing demands of society. Ongoing advancements in this domain enhance efficiency and sustainability, enabling nations to reinforce energy security, accelerate industrial progress, and elevate the quality of life for their citizens.
            </p>
            </h1>
            {/*update till here*/}
            <div className="mt-4 flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" icon={<span className="material-symbols-outlined fill-current">explore</span>}>
                  Explore Training Courses
                </Button>
              </Link>
              <Link to="/opportunities">
              {/*updated here*/}
                <Button size="lg" variant="outline" className="relative text-white border-0 bg-gradient-to-r from-[#4169E1]/120 via-[#8F00FF]/80 to-pink-000 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] hover:scale-105 transition-all duration-300" icon={<span className="material-symbols-outlined fill-current">work</span>}>
                  Browse Opportunities
                </Button>
                {/*update till here*/}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <Section>
        <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
            <Link to="/courses" className="text-primary hover:text-white transition-colors font-medium flex items-center gap-1">
              View All Courses <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <Link to={`/courses/${course.slug}`} key={course.id} className="group">
                <Card className="h-full flex flex-col p-0 overflow-hidden border-white/10 hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                         style={{ backgroundImage: `url("${course.thumbnail}")` }}></div>
                    {course.installments && (
                      <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">
                        Installment Available
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
                       <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{course.course_mode}</span>
                       <span className="text-slate-400">• {course.course_duration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                      {course.course_name}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex flex-col">
                        {course.discount_price ? (
                          <>
                            <span className="text-sm text-slate-500 line-through">${course.price}</span>
                            <span className="text-lg font-bold text-white">${course.discount_price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-white">${course.price}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                        <span className="material-symbols-outlined text-sm filled">star</span> {course.rating}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Browse by Category */}
      <Section variant="surface">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">What We Cover</h2>
          <p className="text-slate-300 text-center mb-8 max-w-2xl mx-auto">One Platform. Five Powerful Industries.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/courses?category=${cat.slug}`} className="group">
                <div className="bg-card-dark border border-white/5 p-6 rounded-xl text-center hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">category</span>
                   </div>
                   <h3 className="text-white font-bold">{cat.category_title}</h3>
                   <span className="text-xs text-[#9dabb9]">{cat.count} Courses</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Accreditations */}
      <Section>
        <div className="max-w-[1400px] mx-auto text-center">
           <h2 className="text-2xl font-bold text-white mb-10 opacity-80">Our Accreditations & Partners</h2>
           <div className="flex flex-wrap justify-center gap-10 md:gap-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {awards.map(award => (
                 <img key={award.id} src={award.award_image} alt={award.award_title} className="h-16 object-contain" title={award.award_title} />
              ))}
           </div>
        </div>
      </Section>
    </>
  );
};

export default Home;
