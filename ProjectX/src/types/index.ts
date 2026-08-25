export interface NavItem {
  label: string;
  path: string;
}

export interface Category {
  id: string;
  category_title: string; // Was title
  slug: string;
  count?: number;
}

export interface Award {
  id: string;
  award_title: string;
  award_image: string;
}

export interface InstallmentPlan {
  id: string;
  course_id: string;
  total_installments: number;
  installment_amount: number;
}

export interface Course {
  id: string;
  course_name: string;
  slug: string;
  description: string;
  short_description?: string;
  long_description?: string;
  learnings?: string[]; // Dynamic "What You'll Learn" bullet points
  price: number;
  discount_price?: number;
  course_duration: string;
  course_mode: 'Online' | 'Offline'; // New field
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  category?: string; // This might need to link to Category ID in real DB, but keeping string for now
  rating?: number;
  is_featured?: boolean;
  installments?: InstallmentPlan; // Mocking the relationship
}

export interface Blog {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  banner_image?: string;
  status?: 'draft' | 'published' | 'archived' | string;
  is_featured?: number | boolean;
  is_active?: number | boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  date?: string; // Formatted date for frontend display
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
