import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Category } from '../entities/category.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/courses')
@UseGuards(AdminAuthGuard)
export class AdminCoursesController {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ─── GET /api/admin/courses/categories ──────────────────────────────
  @Get('meta/categories')
  async getCategories() {
    return this.categoryRepository.find({
      select: ['id', 'category_title', 'category_slug'],
      order: { sort_order: 'ASC', category_title: 'ASC' },
    });
  }

  // ─── GET /api/admin/courses ─────────────────────────────────────────
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('category') categoryId?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: FindOptionsWhere<Course> = {};

    if (status !== undefined && status !== '') {
      where.status = parseInt(status, 10);
    }

    if (categoryId && categoryId !== '') {
      where.category = { id: parseInt(categoryId, 10) };
    }

    let items: Course[] = [];
    let total = 0;

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      const queryBuilder = this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.category', 'category')
        .where('course.course_name LIKE :q OR course.slug LIKE :q OR course.short_description LIKE :q', { q });

      if (where.status !== undefined) {
        queryBuilder.andWhere('course.status = :status', { status: where.status });
      }
      if (categoryId) {
        queryBuilder.andWhere('category.id = :catId', { catId: parseInt(categoryId, 10) });
      }

      queryBuilder
        .orderBy('course.sorting_order', 'ASC')
        .addOrderBy('course.created_at', 'DESC')
        .skip(skip)
        .take(limitNum);

      [items, total] = await queryBuilder.getManyAndCount();
    } else {
      [items, total] = await this.courseRepository.findAndCount({
        where,
        relations: ['category'],
        order: {
          sorting_order: 'ASC',
          created_at: 'DESC',
        },
        skip,
        take: limitNum,
      });
    }

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  // ─── GET /api/admin/courses/:id ─────────────────────────────────────
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['category'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  // ─── POST /api/admin/courses ────────────────────────────────────────
  @Post()
  async create(@Body() body: any) {
    if (!body.course_name || !body.course_name.trim()) {
      throw new BadRequestException('Course name is required');
    }

    // Auto-generate slug if not provided or format existing
    let slug = (body.slug || body.course_name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = await this.courseRepository.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Format learnings as JSON string if passed as array
    let learnings = body.learnings;
    if (Array.isArray(learnings)) {
      learnings = JSON.stringify(learnings.filter((item: string) => item && item.trim() !== ''));
    } else if (typeof learnings === 'string' && learnings.trim()) {
      try {
        JSON.parse(learnings);
      } catch {
        learnings = JSON.stringify([learnings.trim()]);
      }
    }

    let category: Category | undefined = undefined;
    if (body.category_id || body.main_category) {
      const catId = parseInt(body.category_id || body.main_category, 10);
      const found = await this.categoryRepository.findOne({ where: { id: catId } });
      if (found) category = found;
    }

    const course = this.courseRepository.create({
      course_name: body.course_name.trim(),
      slug,
      short_description: body.short_description || null,
      long_description: body.long_description || null,
      learnings: learnings || null,
      price: body.price !== undefined && body.price !== '' ? parseFloat(body.price) : 0,
      discount_price: body.discount_price !== undefined && body.discount_price !== '' ? parseFloat(body.discount_price) : undefined,
      course_duration: body.course_duration || null,
      course_mode: body.course_mode || 'online',
      course_type: body.course_type || 'basic',
      thumbnail: body.thumbnail || null,
      banner_images: body.banner_images || null,
      syllabus_file: body.syllabus_file || null,
      content_hour: body.content_hour ? parseInt(body.content_hour, 10) : undefined,
      is_free: body.is_free ? 1 : 0,
      status: body.status !== undefined ? parseInt(body.status, 10) : 1,
      sorting_order: body.sorting_order ? parseInt(body.sorting_order, 10) : 0,
      category: category,
      created_at: new Date(),
      updated_at: new Date(),
    } as any);

    return this.courseRepository.save(course);
  }

  // ─── PUT /api/admin/courses/:id ─────────────────────────────────────
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const courseId = parseInt(id, 10);
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['category'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Format learnings
    let learnings = body.learnings !== undefined ? body.learnings : course.learnings;
    if (Array.isArray(learnings)) {
      learnings = JSON.stringify(learnings.filter((item: string) => item && item.trim() !== ''));
    } else if (typeof learnings === 'string' && learnings.trim()) {
      try {
        JSON.parse(learnings);
      } catch {
        learnings = JSON.stringify([learnings.trim()]);
      }
    }

    let category = course.category;
    if (body.category_id !== undefined || body.main_category !== undefined) {
      const catId = parseInt(body.category_id || body.main_category, 10);
      if (catId) {
        const found = await this.categoryRepository.findOne({ where: { id: catId } });
        if (found) category = found;
      } else {
        category = null as any;
      }
    }

    // Slug check if slug is modified
    let slug = course.slug;
    if (body.slug && body.slug !== course.slug) {
      slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existing = await this.courseRepository.findOne({ where: { slug } });
      if (existing && existing.id !== courseId) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    (course as any).course_name = body.course_name !== undefined ? body.course_name.trim() : course.course_name;
    (course as any).slug = slug;
    (course as any).short_description = body.short_description !== undefined ? body.short_description : course.short_description;
    (course as any).long_description = body.long_description !== undefined ? body.long_description : course.long_description;
    (course as any).learnings = learnings;
    (course as any).price = body.price !== undefined && body.price !== '' ? parseFloat(body.price) : course.price;
    (course as any).discount_price = body.discount_price !== undefined && body.discount_price !== '' ? parseFloat(body.discount_price) : (body.discount_price === '' ? null : course.discount_price);
    (course as any).course_duration = body.course_duration !== undefined ? body.course_duration : course.course_duration;
    (course as any).course_mode = body.course_mode !== undefined ? body.course_mode : course.course_mode;
    (course as any).course_type = body.course_type !== undefined ? body.course_type : course.course_type;
    (course as any).thumbnail = body.thumbnail !== undefined ? body.thumbnail : course.thumbnail;
    (course as any).banner_images = body.banner_images !== undefined ? body.banner_images : course.banner_images;
    (course as any).syllabus_file = body.syllabus_file !== undefined ? body.syllabus_file : course.syllabus_file;
    (course as any).content_hour = body.content_hour !== undefined ? (body.content_hour ? parseInt(body.content_hour, 10) : null) : course.content_hour;
    (course as any).is_free = body.is_free !== undefined ? (body.is_free ? 1 : 0) : course.is_free;
    (course as any).status = body.status !== undefined ? parseInt(body.status, 10) : course.status;
    (course as any).sorting_order = body.sorting_order !== undefined ? parseInt(body.sorting_order, 10) : course.sorting_order;
    (course as any).category = category;
    (course as any).updated_at = new Date();

    return this.courseRepository.save(course);
  }

  // ─── DELETE /api/admin/courses/:id ──────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const courseId = parseInt(id, 10);
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    await this.courseRepository.delete(courseId);
    return { success: true, message: `Course "${course.course_name}" deleted successfully` };
  }

  // ─── PATCH /api/admin/courses/:id/status ────────────────────────────
  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string, @Body('status') status: number) {
    const courseId = parseInt(id, 10);
    const parsedStatus = status === 1 ? 1 : 0;
    await this.courseRepository.update(courseId, {
      status: parsedStatus,
      updated_at: new Date(),
    });
    return { success: true, status: parsedStatus };
  }
}
