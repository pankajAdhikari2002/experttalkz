import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../../components/common/Meta';
import { api } from '../../services/api';
import type { Course } from '../../types';
import Button from '../../components/common/Button';

const CourseList = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]); 
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses();
        // Duplicating for layout preview if there are too few courses
        const expandedCatalog = data.length > 0 ? [...data, ...data, ...data] : [];
        setAllCourses(expandedCatalog);
        setCourses(expandedCatalog);
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
     return (
       <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center text-white">
         <span className="material-symbols-outlined animate-spin text-5xl text-primary">autorenew</span>
         <p>Loading Course Directory...</p>
       </div>
     );
  }

  return (
    <>
      <Meta title="Course Catalog" description="Browse our extensive library of engineering courses." />
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center">
         {/*updated here*/}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://arrowwingsacademy.com/wp-content/uploads/2024/05/industrial-furnace-heat-exchanger-cracking-hydrocarbons-factory-sky-sunset-close-up-equipment-petrochemical-plant-min-scaled-1.jpg")' }}></div>
        {/*updated till here*/}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-2xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">Featured Course</span>
              <span className="text-primary font-medium text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-base">star</span> 4.9 Rating
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
              Mastering OIL<br/>& GAS 2024
            </h1>
            <p className="text-gray-200 text-base md:text-lg font-light leading-relaxed max-w-xl drop-shadow-md">
               The oil and gas industry is the global backbone of energy production, encompassing the exploration, extraction, refining, and transportation of hydrocarbons that power modern civilization and manufacture thousands of everyday products.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button size="lg" icon={<span className="material-symbols-outlined fill-current">play_arrow</span>}>
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="sticky top-[57px] z-40 bg-background-dark/95 backdrop-blur border-b border-white/5 py-4 w-full flex items-center">
         <div className="max-w-[1920px] mx-auto px-6 lg:px-12 w-full flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
               <input 
                  type="text" 
                  placeholder="Search courses, skills, or topics..." 
                  className="w-full bg-surface-dark border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  onChange={(e) => {
                     const term = e.target.value.toLowerCase();
                     const filtered = allCourses.filter(c => 
                        c.course_name.toLowerCase().includes(term) || 
                        c.category?.toLowerCase().includes(term)
                     );
                     setCourses(filtered);
                  }}
               />
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
               <span>Popular:</span>
               {['Piping', 'Structural', 'Process'].map(tag => (
                  <button key={tag} className="hover:text-white transition-colors cursor-pointer" onClick={() => {
                      const term = tag.toLowerCase();
                      const filtered = allCourses.filter(c => 
                        c.course_name.toLowerCase().includes(term) || 
                        c.category?.toLowerCase().includes(term)
                     );
                     setCourses(filtered);
                  }}>#{tag}</button>
               ))}
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-8 mt-8 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-20">
         
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map(course => (
               <Link to={`/courses/${course.slug}`} key={course.id} className="group cursor-pointer">
                  <div className="bg-card-dark rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300 shadow-md flex flex-col h-full">
                     {/* Thumbnail & Badges */}
                     <div className="relative aspect-video w-full overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                             style={{ backgroundImage: `url(${course.thumbnail})` }}></div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                           {course.installments && (
                              <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                                 Partial Payment Available
                              </span>
                           )}
                        </div>

                        {course.discount_price && (
                           <div className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              {(100 - (course.discount_price / course.price) * 100).toFixed(0)}% OFF
                           </div>
                        )}
                     </div>

                     {/* Body */}
                     <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded border ${course.course_mode === 'Online' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                              {course.course_mode}
                           </span>
                           <span className="text-slate-400 text-xs flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> {course.course_duration}
                           </span>
                        </div>

                        <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                           {course.course_name}
                        </h3>

                        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1">
                           <div className="flex items-baseline gap-2">
                              {course.discount_price ? (
                                 <>
                                    <span className="text-xl font-bold text-white">${course.discount_price}</span>
                                    <span className="text-sm text-slate-500 line-through decoration-slate-600">${course.price}</span>
                                 </>
                              ) : (
                                 <span className="text-xl font-bold text-white">${course.price}</span>
                              )}
                           </div>
                           
                           {course.installments && (
                              <p className="text-xs text-blue-300 font-medium">
                                 Or {course.installments.total_installments} payments of ${course.installments.installment_amount}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>
               </Link>
            ))}
         </div>

      </div>
    </>
  );
};

export default CourseList;
