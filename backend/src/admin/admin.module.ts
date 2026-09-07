import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminContactsController } from './admin-contacts.controller';
import { AdminEventsController } from './admin-events.controller';
import { Course } from '../entities/course.entity';
import { Blog } from '../entities/blog.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { Contact } from '../entities/contact.entity';
import { Event } from '../entities/event.entity';
import { EventCategory } from '../entities/event-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Blog,
      Category,
      User,
      Contact,
      Event,
      EventCategory,
    ]),
  ],
  controllers: [
    AdminCoursesController,
    AdminBlogsController,
    AdminUsersController,
    AdminContactsController,
    AdminEventsController,
  ],
})
export class AdminModule {}
