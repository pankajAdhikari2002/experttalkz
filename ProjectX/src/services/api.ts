import { COURSES, BLOGS } from './mockData';
import type { Course, Blog, ContactFormData } from '../types';

const DELAY = 500;

export const api = {
  getCourses: (): Promise<Course[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(COURSES), DELAY);
    });
  },

  getCourseBySlug: (slug: string): Promise<Course | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = COURSES.find((c) => c.slug === slug);
        resolve(course);
      }, DELAY);
    });
  },

  getBlogs: (): Promise<Blog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(BLOGS), DELAY);
    });
  },

  getBlogBySlug: (slug: string): Promise<Blog | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blog = BLOGS.find((b) => b.slug === slug);
        resolve(blog);
      }, DELAY);
    });
  },

  submitLead: (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Lead Submitted:', data);
        resolve({ success: true, message: 'Message sent successfully!' });
      }, DELAY);
    });
  },
};
