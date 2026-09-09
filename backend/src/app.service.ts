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
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid submission data.');
    }

    // 1. Name validation
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new BadRequestException('Full name is required.');
    }
    const name = data.name.trim();
    if (name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters long.');
    }
    if (name.length > 100) {
      throw new BadRequestException('Name cannot exceed 100 characters.');
    }
    const nameRegex = /^[a-zA-Z\s.'\-\u00C0-\u024F\u1E00-\u1EFF]+$/;
    if (!nameRegex.test(name)) {
      throw new BadRequestException('Name can only contain letters, spaces, hyphens, and periods.');
    }

    // 2. Email validation
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
      throw new BadRequestException('Email address is required.');
    }
    const email = data.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 120) {
      throw new BadRequestException('Please provide a valid email address (e.g. name@domain.com).');
    }

    // 3. Phone validation
    if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
      throw new BadRequestException('Phone number is required.');
    }
    const phone = data.phone.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      throw new BadRequestException('Phone number must contain between 7 and 15 digits.');
    }
    const phoneFormatRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,16}$/;
    if (!phoneFormatRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number format.');
    }

    // 4. Subject validation
    if (!data.subject || typeof data.subject !== 'string' || !data.subject.trim()) {
      throw new BadRequestException('Subject is required.');
    }
    const subject = data.subject.trim();
    if (subject.length < 3) {
      throw new BadRequestException('Subject must be at least 3 characters.');
    }
    if (subject.length > 200) {
      throw new BadRequestException('Subject cannot exceed 200 characters.');
    }

    // 5. Message validation
    if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
      throw new BadRequestException('Message is required.');
    }
    const message = data.message.trim();
    if (message.length < 10) {
      throw new BadRequestException('Message must be at least 10 characters long.');
    }
    if (message.length > 3000) {
      throw new BadRequestException('Message cannot exceed 3000 characters.');
    }

    // 6. Anti-spam / duplicate prevention (same email and message within 60 seconds)
    const recentDuplicate = await this.contactRepo.findOne({
      where: { email, message },
      order: { created_at: 'DESC' },
    });
    if (recentDuplicate && recentDuplicate.created_at) {
      const diffMs = Date.now() - new Date(recentDuplicate.created_at).getTime();
      if (diffMs < 60000) {
        throw new BadRequestException('A duplicate message was recently received. Please wait a moment before resending.');
      }
    }

    const contact = new Contact();
    contact.name = name;
    contact.email = email;
    contact.phone = phone;
    contact.subject = subject;
    contact.message = message;
    contact.status = 'unread';
    contact.ip_address = ip || '';

    return this.contactRepo.save(contact);
  }
}
