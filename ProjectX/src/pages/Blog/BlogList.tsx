import { useEffect, useState } from 'react';
import type { Blog } from '../../types';
import { api } from '../../services/api';
import Card from '../../components/common/Card';
import Section from '../../components/common/Section';
import Meta from '../../components/common/Meta';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <>
      <Meta 
        title="Blog & Insights | ExpertTalkz" 
        description="Stay updated with the latest trends, tips, and insights in the engineering world."
      />
      {/* Hero Banner Section */}
      <div className="relative py-16 md:py-28 text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/Cointainer/A1.png')" }}>
        <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg cursor-pointer hover:scale-95 transition duration-300">
            LATEST INSIGHTS
          </h1>
          <p className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md cursor-pointer hover:text-black transition duration-300">
            Stay updated with the latest trends in technology and engineering.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.slug}`} className="block group">
              <Card hover className="h-full">
                <div className="h-60 bg-surface-dark rounded-xl mb-6 overflow-hidden relative">
                   <div 
                     className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                     style={{ backgroundImage: `url('${blog.featured_image || blog.banner_image || '/Cointainer/5 Soft Skill.png'}')` }}
                   />
                </div>

                <div className="flex items-center gap-2 text-[#9dabb9] text-sm mb-4">
                  <Calendar size={14} />
                  <span>{blog.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 leading-tight text-white group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-[#9dabb9] leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
};

export default BlogList;
