import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/courses')
@UseGuards(AdminAuthGuard)
export class AdminCoursesController {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await this.courseRepository.findAndCount({
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
    return this.courseRepository.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Post()
  async create(@Body() createData: Partial<Course>) {
    const course = this.courseRepository.create({
      ...createData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return this.courseRepository.save(course);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Course>) {
    await this.courseRepository.update(parseInt(id, 10), {
      ...updateData,
      updated_at: new Date(),
    });
    return this.courseRepository.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.courseRepository.delete(parseInt(id, 10));
    return { success: true };
  }

  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string, @Body('status') status: number) {
    await this.courseRepository.update(parseInt(id, 10), {
      status,
      updated_at: new Date(),
    });
    return { success: true, status };
  }
}
