import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { InstallmentPlan } from './entities/installment-plan.entity';
import { Blog } from './entities/blog.entity';
import { Award } from './entities/award.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(InstallmentPlan) private installmentRepo: Repository<InstallmentPlan>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Award) private awardRepo: Repository<Award>,
  ) {}

  async onModuleInit() {
    // Seed initial mock data if the database is empty
    const count = await this.categoryRepo.count();
    if (count === 0) {
      console.log('Seeding initial database...');
      const cats = await this.categoryRepo.save([
        { category_title: 'Energy (Oil & Gas)', slug: 'energy-oil-gas', count: 12 },
        { category_title: 'Aviation', slug: 'aviation', count: 5 },
        { category_title: 'Shipping & Maritime', slug: 'shipping-maritime', count: 8 },
        { category_title: 'Minerals & Mining', slug: 'minerals-mining', count: 6 },
        { category_title: 'Fintech', slug: 'fintech', count: 4 },
      ]);
      
      const energyCat = cats.find(c => c.slug === 'energy-oil-gas');

      await this.courseRepo.save([
        {
          course_name: 'Offshore Piping Stress Engineering',
          slug: 'offshore-piping-stress',
          description: 'CAESAR II-based, ASME B31.3 compliant complete deep-dive into piping stress analysis for offshore and onshore projects.',
          price: 499,
          discount_price: 399,
          course_duration: '24 Weeks',
          course_mode: 'Online',
          level: 'Advanced',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJHYBTTXfuqMH-TJjExbx3gjlYSVScXZ4yIGMbfXs3y5Rg5-DZDB-RtqmhorxZUG4OB1qP0chumDVyAKMir9G_9yVQM8mUwW9sgwsYDJ7NjUMnqplHQ7_-q6KSFJRH2EYCqJjRw4yqwVxt3hfdakiaCn1msmjCGECSuXTb9lG64pxvjz5KlDfMyTrCRxbT13DFBvCBIHXNyeYtJEFlcJZOFYfXfMCfcMUCj1XyGN1zQ6HMJsUqfKEKEGa2fGLxF_LZhD4sfsRTVQeY',
          category: energyCat,
          rating: 4.9,
          is_featured: true,
          installments: { total_installments: 4, installment_amount: 100 }
        },
        {
          course_name: 'Offshore Structural Engineering',
          slug: 'offshore-structural-engineering',
          description: 'Load analysis, steel design, offshore codes. Designed for engineers who want to master the structural design and integrity of offshore platforms, jackets, and topsides.',
          price: 599,
          discount_price: 549,
          course_duration: '20 Weeks',
          course_mode: 'Online',
          level: 'Advanced',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuVtNAsuuMEE_LrjUQcY_JOZL3iwxYcphe6KLVwUXsjLGXcpjQyc8d623PoQxZgwNsbweOUzge-jL9bBfVFkvb5ExEPsK3pr0h82CAnL93dexMPZcwXbZtQweGJ1PC0o0IAaorviUNXqPzgvTE9LpBwfAk-91ki9iEMWzMb1wEwC1zyX_ML2fpq_oXVPqyX5xTo-D4bJztjcEVoZh1ceeQZqMdzLYhM-R8ByhwCYL3tX5Gm6p45sDOwkNOcVtnKgYABQciC5ryFpjk',
          category: energyCat,
          rating: 4.8,
          is_featured: true,
          installments: { total_installments: 3, installment_amount: 183 }
        },
        {
          course_name: 'Offshore Process Engineering',
          slug: 'offshore-process-engineering',
          description: 'HYSYS simulations, P&ID, process safety. Master the fundamentals and advanced techniques of offshore process design, from concept to commissioning.',
          price: 449,
          course_duration: '16 Weeks',
          course_mode: 'Online',
          level: 'Advanced',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATZGrJV1nNKUN5GWVrZ1ZIVCJ80C-Y5AuRsqKVJhHsbyKxRND7vHaa2VXDNs7ewlXK7qUBNm3MsCdB3BTh4Fv7abC4rMkkZ7cDA9xADrkkho1-kyb05dL2SJB_rBV2F9gJ4SHm8NGVEuJaynxMpyyXkEsQfnnld2vQcf8VcMLbi9_QKndgsMl8Ic2ZUqU0leIOKP5-xUdptA-JnuBVNVyhp8ooUUPbtMmnb8TeCgD-POdkQ6PMIQ7loDSizHvkW1FVObFOnKmv9ca1',
          category: energyCat,
          rating: 4.7,
          is_featured: true
        }
      ]);

      await this.awardRepo.save([
        { award_title: 'Best Tech Education 2024', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Award+2024' },
        { award_title: 'Excellence in E-Learning', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Excellence' },
        { award_title: 'Top Rated Curriculum', award_image: 'https://placehold.co/150x80/162040/FFFFFF?text=Top+Rated' },
      ]);

      await this.blogRepo.save([
        { title: 'Top 5 Skills Every Engineer Needs in 2026', slug: 'top-5-engineering-skills-2026', excerpt: 'The tech landscape is evolving rapidly.', date: 'Jan 15, 2026' },
        { title: 'How to Ace Your First Tech Interview', slug: 'tech-interview-guide', excerpt: 'Practical tips and strategies.', date: 'Jan 10, 2026' },
      ]);
      console.log('Seeding complete.');
    }
  }

  getCourses() {
    return this.courseRepo.find({ relations: ['category', 'installments'] });
  }

  getCourseBySlug(slug: string) {
    return this.courseRepo.findOne({ where: { slug }, relations: ['category', 'installments'] });
  }

  getCategories() {
    return this.categoryRepo.find();
  }

  getAwards() {
    return this.awardRepo.find();
  }

  getBlogs() {
    return this.blogRepo.find();
  }
}
