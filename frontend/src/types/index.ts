// =============================================================================
// GLOBAL TYPES — mirrors backend models exactly
// =============================================================================

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "admin" | "editor";
  date_joined: string;
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------
export interface Technology {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
  color: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image: string | null;
  architecture_diagram: string | null;
  github_url: string;
  live_url: string;
  technologies: Technology[];
  images: ProjectImage[];
  status: "draft" | "published";
  is_featured: boolean;
  project_start: string | null;
  project_end: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  related_projects?: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image: string | null;
  technologies: Technology[];
  status: "draft" | "published";
  is_featured: boolean;
  project_start: string | null;
  project_end: string | null;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: "Languages" | "Frameworks" | "Databases" | "Tools" | "DevOps" | "Other";
  proficiency: number;
  icon_url: string;
  order: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_current: boolean;
  order: number;
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  post_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: Category | null;
  tags: Tag[];
  author_name: string;
  status: "draft" | "published";
  is_featured: boolean;
  published_at: string | null;
  view_count: number;
  read_time: number;
}

export interface Post extends PostSummary {
  content: string;
  created_at: string;
  updated_at: string;
  related_posts?: PostSummary[];
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  id: string;
  status: "unread" | "read" | "archived";
  ip_address: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------
export interface Resume {
  id: number;
  file: string;
  label: string;
  is_active: boolean;
  download_count: number;
  last_downloaded_at: string | null;
  uploaded_by_name: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  photo: string | null;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
export interface AnalyticsSummary {
  total_views: number;
  unique_visitors: number;
  recent_views_30d: number;
  resume_downloads: number;
  contact_submissions: number;
}

export interface DailyView {
  date: string;
  count: number;
}

export interface TopItem {
  object_id: string;
  object_title: string;
  count: number;
}

// ---------------------------------------------------------------------------
// API Pagination wrapper
// ---------------------------------------------------------------------------
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ---------------------------------------------------------------------------
// Shared query params
// ---------------------------------------------------------------------------
export interface ProjectQueryParams {
  search?: string;
  technology?: string;
  ordering?: "latest" | "oldest" | "featured";
  page?: number;
  all?: boolean;
}

export interface PostQueryParams {
  search?: string;
  category?: string;
  tag?: string;
  ordering?: "latest" | "oldest" | "popular";
  page?: number;
  all?: boolean;
}

export interface MessageQueryParams {
  status?: "unread" | "read" | "archived";
  page?: number;
}