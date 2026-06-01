// =============================================================================
// APP — Root router with public and admin route trees
// =============================================================================
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTracking } from "@/hooks/usePageTracking";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import BlogPage from "@/pages/public/BlogPage";
import BlogDetailPage from "@/pages/public/BlogDetailPage";
import TestimonialsPage from "@/pages/public/TestimonialsPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

// Admin Pages
import LoginPage from "@/pages/admin/LoginPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminProjectsPage from "@/pages/admin/ProjectsPage";
import AdminProjectFormPage from "@/pages/admin/ProjectFormPage";
import AdminBlogPage from "@/pages/admin/BlogPage";
import AdminBlogFormPage from "@/pages/admin/BlogFormPage";
import AdminMessagesPage from "@/pages/admin/MessagesPage";
import AdminMessageDetailPage from "@/pages/admin/MessageDetailPage";
import AdminResumePage from "@/pages/admin/ResumePage";
import AdminTestimonialsPage from "@/pages/admin/TestimonialsPage";
import AdminAnalyticsPage from "@/pages/admin/AnalyticsPage";
import AdminProfilePage from "@/pages/admin/ProfilePage";

// Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";

// Page tracking lives inside BrowserRouter — needs useLocation
function AppRoutes() {
  usePageTracking();
  const { fetchMe } = useAuth();

  useEffect(() => {
    // On app mount try to restore session from cookie
    fetchMe();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      {/* ------------------------------------------------------------------ */}
      {/* PUBLIC                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Route element={<PublicLayout />}>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/projects"            element={<ProjectsPage />} />
        <Route path="/projects/:slug"      element={<ProjectDetailPage />} />
        <Route path="/blog"                element={<BlogPage />} />
        <Route path="/blog/:slug"          element={<BlogDetailPage />} />
        <Route path="/testimonials"        element={<TestimonialsPage />} />
        <Route path="*"                    element={<NotFoundPage />} />
      </Route>

      {/* ------------------------------------------------------------------ */}
      {/* AUTH (no layout wrapper)                                             */}
      {/* ------------------------------------------------------------------ */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ------------------------------------------------------------------ */}
      {/* ADMIN (protected)                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index                          element={<AdminDashboardPage />} />
        <Route path="projects"                element={<AdminProjectsPage />} />
        <Route path="projects/new"            element={<AdminProjectFormPage />} />
        <Route path="projects/:slug/edit"     element={<AdminProjectFormPage />} />
        <Route path="blog"                    element={<AdminBlogPage />} />
        <Route path="blog/new"                element={<AdminBlogFormPage />} />
        <Route path="blog/:slug/edit"         element={<AdminBlogFormPage />} />
        <Route path="messages"                element={<AdminMessagesPage />} />
        <Route path="messages/:id"            element={<AdminMessageDetailPage />} />
        <Route path="resume"                  element={<AdminResumePage />} />
        <Route path="testimonials"            element={<AdminTestimonialsPage />} />
        <Route path="analytics"               element={<AdminAnalyticsPage />} />
        <Route path="profile"                 element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}