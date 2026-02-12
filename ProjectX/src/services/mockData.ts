import type { Course, Blog, Category, Award } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', category_title: 'Design', slug: 'design', count: 12 },
  { id: '2', category_title: 'Development', slug: 'development', count: 24 },
  { id: '3', category_title: 'Marketing', slug: 'marketing', count: 8 },
  { id: '4', category_title: 'Data Science', slug: 'data-science', count: 15 },
  { id: '5', category_title: 'Business', slug: 'business', count: 6 },
];

export const AWARDS: Award[] = [
  { id: '1', award_title: 'Best Tech Education 2024', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Award+2024' },
  { id: '2', award_title: 'Excellence in E-Learning', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Excellence' },
  { id: '3', award_title: 'Top Rated Curriculum', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Top+Rated' },
];

export const COURSES: Course[] = [
  {
    id: '1',
    course_name: 'Full Stack Web Development with React & Node.js',
    slug: 'full-stack-web-development',
    description: 'Become a complete web developer with our comprehensive bootcamp covering modern frontend and backend technologies.',
    price: 499,
    discount_price: 399,
    course_duration: '24 Weeks',
    course_mode: 'Online',
    level: 'Beginner',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJHYBTTXfuqMH-TJjExbx3gjlYSVScXZ4yIGMbfXs3y5Rg5-DZDB-RtqmhorxZUG4OB1qP0chumDVyAKMir9G_9yVQM8mUwW9sgwsYDJ7NjUMnqplHQ7_-q6KSFJRH2EYCqJjRw4yqwVxt3hfdakiaCn1msmjCGECSuXTb9lG64pxvjz5KlDfMyTrCRxbT13DFBvCBIHXNyeYtJEFlcJZOFYfXfMCfcMUCj1XyGN1zQ6HMJsUqfKEKEGa2fGLxF_LZhD4sfsRTVQeY',
    category: 'Development',
    rating: 4.9,
    is_featured: true,
    installments: { id: 'inst1', course_id: '1', total_installments: 4, installment_amount: 100 }
  },
  {
    id: '2',
    course_name: 'Data Science & Machine Learning Bootcamp',
    slug: 'data-science-machine-learning',
    description: 'Master Python, Pandas, Scikit-Learn, and Deep Learning to kickstart your career as a Data Scientist.',
    price: 599,
    discount_price: 549,
    course_duration: '20 Weeks',
    course_mode: 'Online',
    level: 'Intermediate',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuVtNAsuuMEE_LrjUQcY_JOZL3iwxYcphe6KLVwUXsjLGXcpjQyc8d623PoQxZgwNsbweOUzge-jL9bBfVFkvb5ExEPsK3pr0h82CAnL93dexMPZcwXbZtQweGJ1PC0o0IAaorviUNXqPzgvTE9LpBwfAk-91ki9iEMWzMb1wEwC1zyX_ML2fpq_oXVPqyX5xTo-D4bJztjcEVoZh1ceeQZqMdzLYhM-R8ByhwCYL3tX5Gm6p45sDOwkNOcVtnKgYABQciC5ryFpjk',
    category: 'Data Science',
    rating: 4.8,
    is_featured: true,
    installments: { id: 'inst2', course_id: '2', total_installments: 3, installment_amount: 183 }
  },
  {
    id: '3',
    course_name: 'Embedded Systems & IoT Engineering',
    slug: 'embedded-systems-iot',
    description: 'Learn to design and program smart devices using C++, Python, and Raspberry Pi.',
    price: 449,
    course_duration: '16 Weeks',
    course_mode: 'Offline',
    level: 'Advanced',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATZGrJV1nNKUN5GWVrZ1ZIVCJ80C-Y5AuRsqKVJhHsbyKxRND7vHaa2VXDNs7ewlXK7qUBNm3MsCdB3BTh4Fv7abC4rMkkZ7cDA9xADrkkho1-kyb05dL2SJB_rBV2F9gJ4SHm8NGVEuJaynxMpyyXkEsQfnnld2vQcf8VcMLbi9_QKndgsMl8Ic2ZUqU0leIOKP5-xUdptA-JnuBVNVyhp8ooUUPbtMmnb8TeCgD-POdkQ6PMIQ7loDSizHvkW1FVObFOnKmv9ca1',
    category: 'Engineering',
    rating: 4.7,
    is_featured: false
  }
];

export const BLOGS: Blog[] = [
  {
    id: '1',
    title: 'Top 5 Skills Every Engineer Needs in 2026',
    slug: 'top-5-engineering-skills-2026',
    excerpt: 'The tech landscape is evolving rapidly. Here are the must-have skills to stay relevant and competitive.',
    date: 'Jan 15, 2026',
  },
  {
    id: '2',
    title: 'How to Ace Your First Tech Interview',
    slug: 'tech-interview-guide',
    excerpt: 'Practical tips and strategies to help you crack coding interviews at top product-based companies.',
    date: 'Jan 10, 2026',
  },
  {
    id: '3',
    title: 'The Future of AI in Education',
    slug: 'future-of-ai-education',
    excerpt: 'Exploring how Artificial Intelligence is transforming the way we learn, teach, and assess performance.',
    date: 'Dec 28, 2025',
  }
];
