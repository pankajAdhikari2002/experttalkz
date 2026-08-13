import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('courses')
  async getCourses() {
    const rawCourses = await this.appService.getCourses();
    return rawCourses.map(c => this.mapCourse(c));
  }

  @Get('courses/:slug')
  async getCourseBySlug(@Param('slug') slug: string) {
    const course = await this.appService.getCourseBySlug(slug);
    if (!course) return null;
    return this.mapCourse(course);
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

  private mapCourse(c: any) {
    let learnings: string[] = [];
    try {
      learnings = c.learnings ? JSON.parse(c.learnings) : [];
    } catch {
      learnings = [];
    }
    return {
      ...c,
      description: c.short_description || c.long_description, // Map to frontend 'description' key
      level: c.course_type?.charAt(0).toUpperCase() + c.course_type?.slice(1), // Map 'basic' to 'Basic'
      category: c.category?.category_title,
      learnings,
      installments: c.installments ? {
          total_installments: c.installments.length,
          installment_amount: c.installments[0]?.amount
      } : null
    };
  }
}
