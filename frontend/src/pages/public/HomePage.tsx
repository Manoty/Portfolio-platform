import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Mail, MapPin, Download, Send, CheckCircle, ExternalLink,
} from "lucide-react";
import { projectsService } from "@/services/projects.service";
import { blogService } from "@/services/blog.service";
import { testimonialsService } from "@/services/testimonials.service";
import { contactService } from "@/services/contact.service";
import { resumeService } from "@/services/resume.service";
import type { ProjectSummary, PostSummary, Testimonial, Skill, Experience } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate, formatDateShort, cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for new opportunities
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Your Name
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 font-medium mb-4">
            Full Stack Engineer · Django · React · PostgreSQL
          </p>

          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
            I build production-grade web applications with clean architecture,
            great UX, and a focus on maintainability. Currently open to senior
            and lead engineering roles.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link to="/projects">
              <Button size="lg">
                View My Work <ArrowRight size={18} />
              </Button>
            </Link>
            <a href={resumeService.downloadUrl()} download>
              <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Download size={18} /> Download CV
              </Button>
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { icon: ExternalLink, href: "https://github.com/yourhandle", label: "GitHub" },
              { icon: ExternalLink, href: "https://linkedin.com/in/yourhandle", label: "LinkedIn" },
              { icon: ExternalLink, href: "https://twitter.com/yourhandle", label: "Twitter" },
              { icon: Mail, href: "mailto:your@email.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About Section
// ---------------------------------------------------------------------------
function AboutSection() {
  const stats = [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Shipped", value: "30+" },
    { label: "Technologies", value: "20+" },
    { label: "Coffee / Day", value: "∞" },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="w-full aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <span className="text-8xl">👨‍💻</span>
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <p className="text-3xl font-bold text-blue-600">5+</p>
              <p className="text-sm text-gray-500">Years of Experience</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
              About Me
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Turning complex problems into elegant solutions
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              I'm a full-stack engineer with over 5 years of experience building
              scalable web applications. I specialize in Python/Django backends
              and React frontends with a strong focus on clean architecture,
              testability, and developer experience.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              I've worked across startups and mid-size companies, shipping products
              from zero to production. I care deeply about code quality, API design,
              and building systems that teams can maintain and extend confidently.
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-8">
              <MapPin size={16} className="text-blue-500 shrink-0" />
              Nairobi, Kenya · Open to Remote
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(({ label, value }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Featured Projects Section
// ---------------------------------------------------------------------------
function FeaturedProjectsSection({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
              My Work
            </p>
            <h2 className="text-4xl font-bold text-gray-900">Featured Projects</h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
          >
            All Projects <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Cover */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🚀</div>
                )}
                {project.is_featured && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="info">Featured</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech.id}
                      className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link to="/projects">
            <Button variant="outline">View All Projects <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Skills Section
// ---------------------------------------------------------------------------
function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            What I Work With
          </p>
          <h2 className="text-4xl font-bold text-gray-900">Skills & Technologies</h2>
        </div>

        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {cat}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              i < skill.proficiency ? "bg-blue-500" : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Experience Section
// ---------------------------------------------------------------------------
function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            My Journey
          </p>
          <h2 className="text-4xl font-bold text-gray-900">Work Experience</h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <div key={exp.id} className="relative flex gap-8">
                {/* Dot */}
                <div className={cn(
                  "relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-sm",
                  i === 0 ? "bg-blue-600" : "bg-gray-400"
                )}>
                  {exp.company.slice(0, 2).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={13} /> {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        {formatDateShort(exp.start_date)} —{" "}
                        {exp.is_current ? "Present" : exp.end_date ? formatDateShort(exp.end_date) : ""}
                      </span>
                      {exp.is_current && (
                        <p className="text-xs text-green-600 font-medium mt-1">Current</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-4 text-sm whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Latest Blog Posts Section
// ---------------------------------------------------------------------------
function LatestPostsSection({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Thoughts & Learnings
            </p>
            <h2 className="text-4xl font-bold text-gray-900">Latest Posts</h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
          >
            All Posts <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                )}
              </div>
              <div className="p-5">
                {post.category && (
                  <Badge variant="info" className="mb-2">{post.category.name}</Badge>
                )}
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.published_at ? formatDate(post.published_at) : ""}</span>
                  <span>{post.read_time} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials Section
// ---------------------------------------------------------------------------
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Social Proof
          </p>
          <h2 className="text-4xl font-bold text-white">What People Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-blue-800 transition-colors"
            >
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{t.testimonial}"
              </p>
              <div className="flex items-center gap-3">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/testimonials">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              All Testimonials <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact Section
// ---------------------------------------------------------------------------
function ContactSection() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await contactService.submit(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again or email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              I'm currently open to senior engineering roles and interesting
              freelance projects. Whether you have a question, a project idea,
              or just want to say hi — my inbox is always open.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "your@email.com", href: "mailto:your@email.com" },
                { icon: ExternalLink, label: "linkedin.com/in/yourhandle", href: "https://linkedin.com" },
                { icon: ExternalLink, label: "github.com/yourhandle", href: "https://github.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon size={18} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-blue-600 text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Subject *</label>
                  <input
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    required
                    placeholder="Project inquiry / Job opportunity / ..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                    rows={6}
                    placeholder="Tell me about your project or opportunity..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <Button type="submit" loading={sending} size="lg" className="w-full">
                  <Send size={16} /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOME PAGE — Assembles all sections
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    Promise.all([
      projectsService.list({ ordering: "featured" }),
      blogService.list({ ordering: "latest" }),
      testimonialsService.list({ featured: true }),
      projectsService.getSkills(),
      projectsService.getExperience(),
    ]).then(([projects, posts, testimonials, skills, experience]) => {
      setFeaturedProjects(projects.results.slice(0, 6));
      setLatestPosts(posts.results.slice(0, 3));
      setTestimonials(testimonials.slice(0, 3));
      setSkills(skills);
      setExperience(experience);
    });
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedProjectsSection projects={featuredProjects} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <LatestPostsSection posts={latestPosts} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </>
  );
}