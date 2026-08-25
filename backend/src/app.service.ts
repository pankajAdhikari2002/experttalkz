import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { CourseInstallment } from './entities/course-installment.entity';
import { Blog } from './entities/blog.entity';
import { Award } from './entities/award.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(CourseInstallment) private installmentRepo: Repository<CourseInstallment>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Award) private awardRepo: Repository<Award>,
  ) {}

  async getCourses() {
    return this.courseRepo.find({ 
      where: { status: 1 },
      relations: ['category', 'installments'],
      order: { sorting_order: 'ASC' }
    });
  }

  async getCourseBySlug(slug: string) {
    return this.courseRepo.findOne({ 
      where: { slug }, 
      relations: ['category', 'installments'] 
    });
  }

  async getCategories() {
    const rawCategories = await this.categoryRepo.find({ order: { sort_order: 'ASC' } });
    return rawCategories.map(cat => ({
        ...cat,
        slug: cat.category_slug // Map internal DB name to frontend key
    }));
  }

  async getAwards() {
    return this.awardRepo.find({ 
      where: { is_active: 1 },
      order: { order: 'ASC' } 
    });
  }

  async getBlogs() {
    return this.blogRepo.find({ 
      where: { status: 'published', is_active: 1 },
      order: { created_at: 'DESC' }
    });
  }

  async getBlogBySlug(slug: string) {
    return this.blogRepo.findOne({ 
      where: { slug, is_active: 1 } 
    });
  }
}
