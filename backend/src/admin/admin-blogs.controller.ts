import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/blogs')
@UseGuards(AdminAuthGuard)
export class AdminBlogsController {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await this.blogRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip,
      take: limitNum,
    });

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogRepository.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Post()
  async create(@Body() createData: Partial<Blog>) {
    const blog = this.blogRepository.create({
      ...createData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return this.blogRepository.save(blog);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Blog>) {
    await this.blogRepository.update(parseInt(id, 10), {
      ...updateData,
      updated_at: new Date(),
    });
    return this.blogRepository.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogRepository.delete(parseInt(id, 10));
    return { success: true };
  }

  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string, @Body('status') status: string) {
    await this.blogRepository.update(parseInt(id, 10), {
      status,
      updated_at: new Date(),
    });
    return { success: true, status };
  }
}
