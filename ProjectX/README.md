# ExpertTalkz - Learning Management System

A modern, full-featured Learning Management System (LMS) built with React, TypeScript, and Tailwind CSS. ExpertTalkz provides a comprehensive platform for online education with course management, user authentication, career guidance, and more.

## 🚀 Features

### Core Functionality

- **User Authentication** - Login/Signup with session management (localStorage-based)
- **Course Catalog** - Browse and filter courses by category, level, and price
- **Course Details** - Comprehensive course information with enrollment options
- **Student Dashboard** - Track learning progress, stats, and upcoming tasks
- **User Profile** - Manage personal information, bio, phone, and location
- **Checkout System** - Complete course purchase flow with payment form

### Additional Pages

- **Events** - Upcoming course sales, new launches, and special sessions
- **Opportunities** - Career roles, required courses, and learning roadmaps
- **Blog** - Educational content and articles
- **Contact** - Get in touch with support

### Design Features

- Modern, responsive UI with dark theme
- Glassmorphism effects and smooth animations
- Mobile-friendly navigation
- SEO-optimized with meta tags

## 📁 Project Structure

```
ProjectX/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (Button, Input, etc.)
│   │   └── layout/         # Layout components (Navbar, Footer)
│   ├── context/            # React Context providers
│   ├── layouts/            # Page layouts (MainLayout, DashboardLayout)
│   ├── pages/              # Application pages
│   │   ├── Auth/          # Login and Signup pages
│   │   ├── Blog/          # Blog list and detail pages
│   │   ├── Courses/       # Course list and detail pages
│   │   └── Dashboard/     # Dashboard and Profile pages
│   ├── router/             # React Router configuration
│   ├── services/           # API services and mock data
│   ├── types/              # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
└── figma_design/          # Original Figma design files
```

## 📂 Detailed File Navigation

### Components (`src/components/`)

#### Common Components (`src/components/common/`)

- **`Button.tsx`** - Reusable button component with variants (primary, outline, ghost)
- **`Card.tsx`** - Card wrapper component for content sections
- **`Input.tsx`** - Form input component with validation support
- **`TextArea.tsx`** - Multi-line text input component
- **`Meta.tsx`** - SEO meta tags component for page titles and descriptions
- **`Section.tsx`** - Page section wrapper with consistent spacing
- **`ProtectedRoute.tsx`** - Route guard for authenticated pages
- **`WhatsAppButton.tsx`** - Floating WhatsApp contact button

#### Layout Components (`src/components/layout/`)

- **`Navbar.tsx`** - Main navigation bar with responsive menu and auth state
- **`Footer.tsx`** - Site footer with links and information

### Context (`src/context/`)

- **`AuthContext.tsx`** - Authentication state management with login, signup, logout, and profile update functions

### Layouts (`src/layouts/`)

- **`MainLayout.tsx`** - Main layout wrapper with Navbar and Footer for public pages
- **`DashboardLayout.tsx`** - Dashboard layout with sidebar navigation for authenticated users

### Pages (`src/pages/`)

#### Public Pages

- **`Home.tsx`** - Landing page with hero section, featured courses, and categories
- **`About.tsx`** - About us page with company information
- **`Contact.tsx`** - Contact form page
- **`Events.tsx`** - Events page showcasing sales, new courses, sessions, and workshops
- **`Opportunities.tsx`** - Career opportunities page with roles and learning roadmaps
- **`NotFound.tsx`** - 404 error page

#### Authentication (`src/pages/Auth/`)

- **`Login.tsx`** - User login page with form validation
- **`Signup.tsx`** - User registration page

#### Courses (`src/pages/Courses/`)

- **`CourseList.tsx`** - Course catalog with filtering and search
- **`CourseDetail.tsx`** - Individual course details with enrollment button
- **`Buy.tsx`** - Course checkout page with payment form

#### Blog (`src/pages/Blog/`)

- **`BlogList.tsx`** - Blog posts listing page
- **`BlogDetail.tsx`** - Individual blog post page

#### Dashboard (`src/pages/Dashboard/`)

- **`Dashboard.tsx`** - Student dashboard with stats, progress, and upcoming tasks
- **`Profile.tsx`** - User profile management page with personal information form

### Router (`src/router/`)

- **`index.tsx`** - React Router configuration with all application routes

### Services (`src/services/`)

- **`api.ts`** - API service layer for data fetching
- **`mockData.ts`** - Mock data for courses, categories, and instructors

### Types (`src/types/`)

- **`index.ts`** - TypeScript type definitions for Course, Category, Instructor, etc.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Material Symbols, Lucide React
- **Build Tool:** Vite
- **State Management:** React Context API
- **Form Handling:** Controlled components with React hooks

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pankajAdhikari2002/experttalkz.git
cd experttalkz
```

2. Navigate to the project directory:

```bash
cd ProjectX
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

Currently uses localStorage for mock authentication. In production, replace with:

- Backend API integration
- JWT tokens
- Secure session management

## 🎨 Design System

### Colors

- **Primary:** Royal Blue (`#4169E1`)
- **Background:** Dark (`#050914`)
- **Card:** Dark (`#0f1419`)
- **Surface:** Dark (`#1c2127`)

### Typography

- **Font Family:** 'Plus Jakarta Sans', system fonts

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

The project can be deployed to:

- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact through the Contact page or open an issue on GitHub.

---

Built with ❤️ by Pankaj Adhikari
