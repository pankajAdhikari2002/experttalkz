import type { Course, Blog, Category, Award, ContactFormData } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/courses`);
      if (!resp.ok) throw new Error('Network error');
      return await resp.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | undefined> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/courses/${slug}`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      return data || undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/categories`);
      if (!resp.ok) throw new Error('Network error');
      return await resp.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getAwards: async (): Promise<Award[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/awards`);
      if (!resp.ok) throw new Error('Network error');
      return await resp.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getBlogs: async (): Promise<Blog[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/blogs`);
      if (!resp.ok) throw new Error('Network error');
      return await resp.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  submitLead: async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Lead pseudo-submitted:', data);
      return { success: true, message: 'Message sent successfully!' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Failed to send message.' };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!resp.ok) return { success: false };
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!resp.ok) return { success: false };
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }
};
