import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { Course } from '../entities/course.entity';
import { Blog } from '../entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Blog])],
  controllers: [AdminCoursesController, AdminBlogsController],
})
export class AdminModule {}
