import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Blog } from '../../types';
import { api } from '../../services/api';
import Section from '../../components/common/Section';
import Meta from '../../components/common/Meta';
import { Calendar, ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (slug) {
        try {
          const data = await api.getBlogBySlug(slug);
          setBlog(data || null);
        } catch (error) {
          console.error('Failed to fetch blog', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!blog) return <div className="text-center py-20 text-slate-500 dark:text-white">Blog post not found</div>;

  return (
    <article>
      <Meta 
        title={`${blog.title} | ExpertTalkz Blog`} 
        description={blog.excerpt}
      />
      <Section variant="surface" className="relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative max-w-3xl mx-auto text-center z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#9dabb9] hover:text-white mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white drop-shadow-lg">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-2 text-[#9dabb9]">
            <Calendar size={16} />
            <span>{blog.date}</span>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto bg-surface-dark rounded-2xl p-8 md:p-12 shadow-xl border border-white/5">
          <div className="text-lg leading-relaxed text-slate-300">
            <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
              {blog.excerpt}
            </p>
            <p className="mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h2 className="text-3xl font-bold mt-10 mb-6 text-white border-b border-white/10 pb-4">Key Takeaways</h2>
            <p className="mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary p-8 my-10 italic text-white rounded-r-lg">
              "The best way to predict the future is to create it."
            </div>
            <p>
               Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
            </p>
          </div>
        </div>
      </Section>
    </article>
  );
};

export default BlogDetail;
