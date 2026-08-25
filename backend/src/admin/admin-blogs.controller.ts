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
import { Repository, FindOptionsWhere } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/blogs')
@UseGuards(AdminAuthGuard)
export class AdminBlogsController {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  // ─── GET /api/admin/blogs ───────────────────────────────────────────
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: FindOptionsWhere<Blog> = {};
    if (status && status.trim() !== '') {
      where.status = status.trim();
    }

    let items: Blog[] = [];
    let total = 0;

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      const queryBuilder = this.blogRepository
        .createQueryBuilder('blog')
        .where('blog.title LIKE :q OR blog.slug LIKE :q OR blog.excerpt LIKE :q', { q });

      if (where.status) {
        queryBuilder.andWhere('blog.status = :status', { status: where.status });
      }

      queryBuilder
        .orderBy('blog.created_at', 'DESC')
        .skip(skip)
        .take(limitNum);

      [items, total] = await queryBuilder.getManyAndCount();
    } else {
      [items, total] = await this.blogRepository.findAndCount({
        where,
        order: { created_at: 'DESC' },
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

  // ─── GET /api/admin/blogs/:id ───────────────────────────────────────
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }
    return blog;
  }

  // ─── POST /api/admin/blogs ──────────────────────────────────────────
  @Post()
  async create(@Body() body: any) {
    if (!body.title || !body.title.trim()) {
      throw new BadRequestException('Blog title is required');
    }
    if (!body.content || !body.content.trim()) {
      throw new BadRequestException('Blog content is required');
    }

    // Auto-generate slug
    let slug = (body.slug || body.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await this.blogRepository.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const blog = this.blogRepository.create({
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt || null,
      content: body.content,
      featured_image: body.featured_image || null,
      banner_image: body.banner_image || null,
      published_at: body.status === 'published' ? (body.published_at ? new Date(body.published_at) : new Date()) : (body.published_at ? new Date(body.published_at) : null as any),
      status: body.status || 'draft',
      is_featured: body.is_featured ? 1 : 0,
      is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.blogRepository.save(blog);
  }

  // ─── PUT /api/admin/blogs/:id ───────────────────────────────────────
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const blogId = parseInt(id, 10);
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    let slug = blog.slug;
    if (body.slug && body.slug !== blog.slug) {
      slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existing = await this.blogRepository.findOne({ where: { slug } });
      if (existing && existing.id !== blogId) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    blog.title = body.title !== undefined ? body.title.trim() : blog.title;
    blog.slug = slug;
    blog.excerpt = body.excerpt !== undefined ? body.excerpt : blog.excerpt;
    blog.content = body.content !== undefined ? body.content : blog.content;
    blog.featured_image = body.featured_image !== undefined ? body.featured_image : blog.featured_image;
    blog.banner_image = body.banner_image !== undefined ? body.banner_image : blog.banner_image;
    blog.status = body.status !== undefined ? body.status : blog.status;
    blog.is_featured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : blog.is_featured;
    blog.is_active = body.is_active !== undefined ? (body.is_active ? 1 : 0) : blog.is_active;

    if (body.status === 'published' && !blog.published_at) {
      blog.published_at = new Date();
    } else if (body.published_at) {
      blog.published_at = new Date(body.published_at);
    }

    blog.updated_at = new Date();

    return this.blogRepository.save(blog);
  }

  // ─── DELETE /api/admin/blogs/:id ────────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const blogId = parseInt(id, 10);
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }
    await this.blogRepository.delete(blogId);
    return { success: true, message: `Blog post "${blog.title}" deleted successfully` };
  }

  // ─── PATCH /api/admin/blogs/:id/status ──────────────────────────────
  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string, @Body('status') status: string) {
    const blogId = parseInt(id, 10);
    const validStatuses = ['draft', 'published', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const updates: Partial<Blog> = {
      status,
      updated_at: new Date(),
    };

    if (status === 'published') {
      updates.published_at = new Date();
    }

    await this.blogRepository.update(blogId, updates);
    return { success: true, status };
  }
}
