import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { CourseInstallment } from './entities/course-installment.entity';
import { Blog } from './entities/blog.entity';
import { Award } from './entities/award.entity';
import { Contact } from './entities/contact.entity';
import { Event } from './entities/event.entity';
import { EventCategory } from './entities/event-category.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(CourseInstallment) private installmentRepo: Repository<CourseInstallment>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    @InjectRepository(Award) private awardRepo: Repository<Award>,
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(EventCategory) private eventCategoryRepo: Repository<EventCategory>,
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

  async getEvents() {
    return this.eventRepo.find({
      where: { status: 1 },
      relations: ['category'],
      order: {
        is_featured: 'DESC',
        created_at: 'DESC',
      },
    });
  }

  async getEventCategories() {
    return this.eventCategoryRepo.find({
      where: { status: 1 },
      order: {
        sort_order: 'ASC',
        name: 'ASC',
      },
    });
  }

  async saveContactMessage(
    data: { name: string; email: string; phone?: string; subject?: string; message: string },
    ip?: string,
  ) {
    if (!data.name || !data.name.trim()) {
      throw new BadRequestException('Name is required');
    }
    if (!data.email || !data.email.trim()) {
      throw new BadRequestException('Valid email address is required');
    }
    if (!data.message || !data.message.trim()) {
      throw new BadRequestException('Message is required');
    }

    const contact = new Contact();
    contact.name = data.name.trim();
    contact.email = data.email.trim();
    contact.phone = data.phone?.trim() || '';
    contact.subject = data.subject?.trim() || 'Website Inquiry';
    contact.message = data.message.trim();
    contact.status = 'unread';
    contact.ip_address = ip || '';

    return this.contactRepo.save(contact);
  }
}
