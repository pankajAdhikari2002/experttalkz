import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { AdminUsersController } from './admin-users.controller';
import { Course } from '../entities/course.entity';
import { Blog } from '../entities/blog.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Blog, Category, User])],
  controllers: [AdminCoursesController, AdminBlogsController, AdminUsersController],
})
export class AdminModule {}
