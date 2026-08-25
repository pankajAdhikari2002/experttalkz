import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const CourseList = lazy(() => import('../pages/Courses/CourseList'));
const CourseDetail = lazy(() => import('../pages/Courses/CourseDetail'));
const BlogList = lazy(() => import('../pages/Blog/BlogList'));
const BlogDetail = lazy(() => import('../pages/Blog/BlogDetail'));
const Contact = lazy(() => import('../pages/Contact'));
const Events = lazy(() => import('../pages/Events'));
const Opportunities = lazy(() => import('../pages/Opportunities'));
const Buy = lazy(() => import('../pages/Buy'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Profile = lazy(() => import('../pages/Dashboard/Profile'));
const ProtectedRoute = lazy(() => import('../components/common/ProtectedRoute'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin pages
const AdminGuard = lazy(() => import('../pages/Admin/AdminGuard'));
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminCourses = lazy(() => import('../pages/Admin/AdminCourses'));
const AdminCourseForm = lazy(() => import('../pages/Admin/AdminCourseForm'));
const AdminBlogs = lazy(() => import('../pages/Admin/AdminBlogs'));
const AdminBlogForm = lazy(() => import('../pages/Admin/AdminBlogForm'));
// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    color: 'var(--primary)'
  }}>
    Loading...
  </div>
);


const Login = lazy(() => import('../pages/Auth/Login'));
const Signup = lazy(() => import('../pages/Auth/Signup'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'profile',
            element: <Profile />,
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminGuard />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'courses', element: <AdminCourses /> },
          { path: 'courses/new', element: <AdminCourseForm /> },
          { path: 'courses/:id/edit', element: <AdminCourseForm /> },
          { path: 'blogs', element: <AdminBlogs /> },
          { path: 'blogs/new', element: <AdminBlogForm /> },
          { path: 'blogs/:id/edit', element: <AdminBlogForm /> },
        ]
      }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <CourseList />
              </Suspense>
            ),
          },
          {
            path: ':slug',
            element: (
              <Suspense fallback={<Loading />}>
                <CourseDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <BlogList />
              </Suspense>
            ),
          },
          {
            path: ':slug',
            element: (
              <Suspense fallback={<Loading />}>
                <BlogDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<Loading />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<Loading />}>
            <Events />
          </Suspense>
        ),
      },
      {
        path: 'opportunities',
        element: (
          <Suspense fallback={<Loading />}>
            <Opportunities />
          </Suspense>
        ),
      },
      {
        path: 'buy/:slug',
        element: (
          <Suspense fallback={<Loading />}>
            <Buy />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
