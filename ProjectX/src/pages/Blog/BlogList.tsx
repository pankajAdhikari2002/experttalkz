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
      <Section variant="surface" className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">Latest Insights</h1>
        <p className="text-xl text-[#9dabb9]">
          Stay updated with the latest trends in technology and engineering.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.slug}`} className="block group">
              <Card hover className="h-full">
                <div className="h-60 bg-surface-dark rounded-lg mb-6 overflow-hidden">
                   {/* Placeholder for blog image */}
                   <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQuKD4VnPMSr2RXD4hSWhySOJC1YJbotcJWXU5jbAg6lMgJNb8TDXJQS5GKMUwjxlbEQ-EINb1-rPn0zQcRrGlNqTwXBvOFj5xQucLvbeZmrqp-bMgPwLg1LA3x_0Dm3iyckoWvr6_vzdICFrPV4VabOHC0mzGvIX5n4DKJQoJTg-q93c7eAAPP4GlbKudkRQTwggHt54KvulAJPknv24fKADyvgWpB53Mbw-_xIhHUTho4qsnssJFsB4cKpRbmtMlxtcdwRqE3g)' }}></div> 
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
