import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventCategory } from '../entities/event-category.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

@Controller('api/admin')
@UseGuards(AdminAuthGuard)
export class AdminEventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCategory)
    private readonly categoryRepository: Repository<EventCategory>,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  @Get('events')
  async findAllEvents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category');

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      qb.andWhere(
        '(event.title LIKE :q OR event.description LIKE :q OR event.badge LIKE :q)',
        { q },
      );
    }

    if (categoryId && categoryId !== 'all') {
      qb.andWhere('event.category_id = :catId', { catId: parseInt(categoryId, 10) });
    }

    if (status !== undefined && status !== 'all' && status !== '') {
      qb.andWhere('event.status = :status', { status: parseInt(status, 10) });
    }

    qb.orderBy('event.created_at', 'DESC').skip(skip).take(limitNum);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  @Get('events/:id')
  async findOneEvent(@Param('id') id: string) {
    const event = await this.eventRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['category'],
    });
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return event;
  }

  @Post('events')
  async createEvent(@Body() body: any) {
    if (!body.title || !body.title.trim()) {
      throw new BadRequestException('Event title is required');
    }
    if (!body.date_text || !body.date_text.trim()) {
      throw new BadRequestException('Event date/schedule is required');
    }
    if (!body.description || !body.description.trim()) {
      throw new BadRequestException('Event description is required');
    }

    const baseSlug = slugify(body.slug || body.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await this.eventRepository.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const event = this.eventRepository.create({
      title: body.title.trim(),
      slug: finalSlug,
      category_id: body.category_id ? parseInt(body.category_id, 10) : null,
      date_text: body.date_text.trim(),
      description: body.description.trim(),
      image: body.image || null,
      badge: body.badge?.trim() || 'NEW',
      color: body.color || 'blue',
      link_url: body.link_url || null,
      link_text: body.link_text?.trim() || 'Learn More',
      is_featured: body.is_featured ? 1 : 0,
      status: body.status !== undefined ? Number(body.status) : 1,
    });

    const saved = await this.eventRepository.save(event);
    return this.eventRepository.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });
  }

  @Put('events/:id')
  async updateEvent(@Param('id') id: string, @Body() body: any) {
    const event = await this.eventRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }

    if (body.title !== undefined) event.title = body.title.trim();
    if (body.slug !== undefined) {
      const s = slugify(body.slug || body.title);
      event.slug = s;
    }
    if (body.category_id !== undefined) {
      event.category_id = body.category_id ? parseInt(body.category_id, 10) : null;
    }
    if (body.date_text !== undefined) event.date_text = body.date_text.trim();
    if (body.description !== undefined) event.description = body.description.trim();
    if (body.image !== undefined) event.image = body.image || null;
    if (body.badge !== undefined) event.badge = body.badge?.trim() || 'NEW';
    if (body.color !== undefined) event.color = body.color || 'blue';
    if (body.link_url !== undefined) event.link_url = body.link_url || null;
    if (body.link_text !== undefined) event.link_text = body.link_text?.trim() || 'Learn More';
    if (body.is_featured !== undefined) event.is_featured = body.is_featured ? 1 : 0;
    if (body.status !== undefined) event.status = Number(body.status);

    await this.eventRepository.save(event);
    return this.eventRepository.findOne({
      where: { id: event.id },
      relations: ['category'],
    });
  }

  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string) {
    const event = await this.eventRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    await this.eventRepository.remove(event);
    return { success: true, message: `Event #${id} deleted` };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  @Get('event-categories')
  async findAllCategories() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.eventCount', 'category.events')
      .orderBy('category.sort_order', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getMany();

    return categories;
  }

  @Post('event-categories')
  async createCategory(@Body() body: any) {
    if (!body.name || !body.name.trim()) {
      throw new BadRequestException('Category name is required');
    }

    const baseSlug = slugify(body.slug || body.name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await this.categoryRepository.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const cat = this.categoryRepository.create({
      name: body.name.trim(),
      slug: finalSlug,
      color: body.color || 'blue',
      sort_order: parseInt(body.sort_order, 10) || 0,
      status: body.status !== undefined ? Number(body.status) : 1,
    });

    return this.categoryRepository.save(cat);
  }

  @Put('event-categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    const cat = await this.categoryRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!cat) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (body.name !== undefined) cat.name = body.name.trim();
    if (body.slug !== undefined) cat.slug = slugify(body.slug || body.name);
    if (body.color !== undefined) cat.color = body.color;
    if (body.sort_order !== undefined) cat.sort_order = parseInt(body.sort_order, 10) || 0;
    if (body.status !== undefined) cat.status = Number(body.status);

    return this.categoryRepository.save(cat);
  }

  @Delete('event-categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const cat = await this.categoryRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!cat) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    await this.categoryRepository.remove(cat);
    return { success: true, message: `Category #${id} deleted` };
  }
}
