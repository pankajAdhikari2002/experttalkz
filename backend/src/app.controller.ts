import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('courses')
  async getCourses() {
    const rawCourses = await this.appService.getCourses();
    // Map category to just its title to match the frontend mock expectation, or leave as object
    return rawCourses.map(c => ({
      ...c,
      category: c.category?.category_title,
    }));
  }

  @Get('courses/:slug')
  async getCourseBySlug(@Param('slug') slug: string) {
    const course = await this.appService.getCourseBySlug(slug);
    if (!course) return null;
    return {
      ...course,
      category: course.category?.category_title,
    };
  }

  @Get('categories')
  getCategories() {
    return this.appService.getCategories();
  }

  @Get('awards')
  getAwards() {
    return this.appService.getAwards();
  }

  @Get('blogs')
  getBlogs() {
    return this.appService.getBlogs();
  }
}
