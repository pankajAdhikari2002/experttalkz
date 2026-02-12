import { Link } from 'react-router-dom';
import Meta from '../components/common/Meta';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import { COURSES, CATEGORIES, AWARDS } from '../services/mockData';

const Home = () => {
  const featuredCourses = COURSES.filter(course => course.is_featured);

  return (
    <>
      <Meta 
        title="ExpertTalkz | Master Tech Skills" 
        description="Mastering UI/UX Design, Development, and Business skills with industry-led courses."
      />
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQuKD4VnPMSr2RXD4hSWhySOJC1YJbotcJWXU5jbAg6lMgJNb8TDXJQS5GKMUwjxlbEQ-EINb1-rPn0zQcRrGlNqTwXBvOFj5xQucLvbeZmrqp-bMgPwLg1LA3x_0Dm3iyckoWvr6_vzdICFrPV4VabOHC0mzGvIX5n4DKJQoJTg-q93c7eAAPP4GlbKudkRQTwggHt54KvulAJPknv24fKADyvgWpB53Mbw-_xIhHUTho4qsnssJFsB4cKpRbmtMlxtcdwRqE3g")' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111418] via-[#111418]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-32">
          <div className="max-w-2xl flex flex-col gap-6 items-start">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-primary !text-[16px]">verified</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">#1 Rated Tech Platform</span>
            </div>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Mastering Tech Skills with Industry Experts
            </h1>
            <p className="text-lg font-medium leading-relaxed text-slate-300 drop-shadow-md max-w-xl">
              Join 10,000+ students in comprehensive guides to designing, developing, and deploying modern applications.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" icon={<span className="material-symbols-outlined fill-current">arrow_forward</span>}>
                  Get Started
                </Button>
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
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map(cat => (
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
              {AWARDS.map(award => (
                 <img key={award.id} src={award.award_image} alt={award.award_title} className="h-16 object-contain" title={award.award_title} />
              ))}
           </div>
        </div>
      </Section>
    </>
  );
};

export default Home;
