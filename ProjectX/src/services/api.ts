import type { Course, Blog, Category, Award, ContactFormData } from '../types';
import { COURSES, BLOGS, CATEGORIES, AWARDS } from './mockData';

const rawApiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : '/api');
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const api = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/courses`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      if (data && data.length > 0) {
        const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
        return data.map((c: any) => ({
          ...c,
          thumbnail: c.thumbnail && !c.thumbnail.startsWith('http') ? `${baseUrl}/${c.thumbnail}` : c.thumbnail,
        }));
      }
      return COURSES;
    } catch (e) {
      console.warn('API getCourses offline, falling back to mock data:', e);
      return COURSES;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | undefined> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/courses/${slug}`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      if (data) {
        const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
        data.thumbnail = data.thumbnail && !data.thumbnail.startsWith('http') ? `${baseUrl}/${data.thumbnail}` : data.thumbnail;
        return data;
      }
      return COURSES.find(c => c.slug === slug);
    } catch (e) {
      console.warn(`API getCourseBySlug offline for slug "${slug}", falling back to mock data:`, e);
      return COURSES.find(c => c.slug === slug);
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/categories`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      return data && data.length > 0 ? data : CATEGORIES;
    } catch (e) {
      console.warn('API getCategories offline, falling back to mock data:', e);
      return CATEGORIES;
    }
  },

  getAwards: async (): Promise<Award[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/awards`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      return data && data.length > 0 ? data : AWARDS;
    } catch (e) {
      console.warn('API getAwards offline, falling back to mock data:', e);
      return AWARDS;
    }
  },

  getBlogs: async (): Promise<Blog[]> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/blogs`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      return data && data.length > 0 ? data : BLOGS;
    } catch (e) {
      console.warn('API getBlogs offline, falling back to mock data:', e);
      return BLOGS;
    }
  },

  getBlogBySlug: async (slug: string): Promise<Blog | undefined> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/blogs/${slug}`);
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();
      return data || BLOGS.find(b => b.slug === slug);
    } catch (e) {
      console.warn(`API getBlogBySlug offline for slug "${slug}", falling back to mock data:`, e);
      return BLOGS.find(b => b.slug === slug);
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
      if (!resp.ok) {
        let msg = 'Login failed';
        try { const err = await resp.json(); msg = err.message || msg; } catch (e) {}
        return { success: false, message: msg };
      }
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Network error or server unreachable' };
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!resp.ok) {
        let msg = 'Registration failed';
        try { const err = await resp.json(); msg = err.message || msg; } catch (e) {}
        return { success: false, message: msg };
      }
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Network error or server unreachable' };
    }
  },

  createPaypalOrder: async (courseSlug: string) => {
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(`${API_BASE_URL}/payments/create-paypal-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ slug: courseSlug })
      });
      if (!resp.ok) throw new Error('Order creation error');
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { id: null };
    }
  },

  capturePaypalOrder: async (orderID: string) => {
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(`${API_BASE_URL}/payments/capture-paypal-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ orderID })
      });
      if (!resp.ok) return { success: false };
      return await resp.json();
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }
};
