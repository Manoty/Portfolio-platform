import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Github, Linkedin, Twitter,
  Mail, MapPin, Download, Send, CheckCircle,
  ExternalLink, Code2, Server, Database,
} from "lucide-react";
import { projectsService } from "@/services/projects.service";
import { blogService } from "@/services/blog.service";
import { testimonialsService } from "@/services/testimonials.service";
import { contactService } from "@/services/contact.service";
import { resumeService } from "@/services/resume.service";
import type { ProjectSummary, PostSummary, Testimonial, Skill, Experience } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Spinner";
import { formatDate, formatDateShort, cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// HERO — Compact, punchy, shows content below fold
// ---------------------------------------------------------------------------
function HeroSection() {
  const techStack = ["Django", "React", "TypeScript", "PostgreSQL", "Docker", "Python"];

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gray-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Gradient fade at bottom — shows next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="max-w-4xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="text-green-300 font-medium">Open to new opportunities</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400">Nairobi, Kenya</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Hi, I'm{" "}
            <span className="gradient-text">Kevin Manoti</span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mt-2">
              Full Stack Engineer
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
            I design and build production-grade web applications — from database schema
            to pixel-perfect UI. Specialising in{" "}
            <span className="text-blue-400 font-medium">Django</span>,{" "}
            <span className="text-cyan-400 font-medium">React</span>, and{" "}
            <span className="text-indigo-400 font-medium">PostgreSQL</span>.
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800/80 text-gray-300 border border-gray-700/60 hover:border-blue-500/50 hover:text-blue-300 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Link to="/projects">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/40 transition-all duration-300 active:scale-[0.98] group">
                View My Work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href={resumeService.downloadUrl()} download>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-semibold hover:border-gray-500 hover:text-white hover:bg-gray-800/50 transition-all duration-200 active:scale-[0.98]">
                <Download size={16} /> Download CV
              </button>
            </a>
            <a href="/#contact">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-400 text-sm font-semibold hover:text-white transition-colors duration-200">
                Let's Talk <Mail size={16} />
              </button>
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: "https://github.com/kevinmanoti", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/kevinmanoti", label: "LinkedIn" },
              { icon: Twitter, href: "https://twitter.com/kevinmanoti", label: "Twitter" },
              { icon: Mail, href: "mailto:kevin@kevinmanoti.dev", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 transition-all duration-200"
              >
                <Icon size={17} />
              </a>
            ))}
            <span className="ml-2 text-sm text-gray-600">Find me online</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-600 z-20">
          <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-gray-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
function AboutSection() {
  const stats = [
    { label: "Years Experience", value: "5+" },
    { label: "Projects Shipped", value: "30+" },
    { label: "Technologies", value: "20+" },
    { label: "Open Source PRs", value: "50+" },
  ];

  const highlights = [
    { icon: Code2, label: "Frontend", desc: "React, TypeScript, Tailwind CSS" },
    { icon: Server, label: "Backend", desc: "Python, Django, REST, Celery" },
    { icon: Database, label: "Database", desc: "PostgreSQL, Redis, migrations" },
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main card */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-8 border border-blue-100/50">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-xl shadow-blue-500/30">
                    KM
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">Kevin Manoti</h3>
                  <p className="text-blue-600 text-sm font-medium">Full Stack Engineer</p>
                </div>
                <div className="space-y-2.5">
                  {highlights.map(({ icon: Icon, label, desc }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-3 border border-white shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="text-sm font-semibold text-gray-800">Available Now</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gray-950 rounded-2xl shadow-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-white">5+</p>
                <p className="text-xs text-gray-400">Yrs Exp.</p>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="order-1 lg:order-2">
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              About Me
            </p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">
              Turning complex problems into{" "}
              <span className="gradient-text">elegant solutions</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
              I'm a full-stack engineer with over 5 years of experience building
              scalable web applications. I specialise in Python/Django backends
              and React frontends with a strong focus on clean architecture,
              testability, and developer experience.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">
              I've worked across startups and mid-size companies, shipping products
              from zero to production. I care deeply about code quality, API design,
              and building systems that teams can maintain and extend with confidence.
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-8 font-medium">
              <MapPin size={15} className="text-blue-500 shrink-0" />
              Nairobi, Kenya · Open to Remote Roles
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
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
// FEATURED PROJECTS
// ---------------------------------------------------------------------------
function FeaturedProjectsSection({ projects, loading }: { projects: ProjectSummary[]; loading: boolean }) {
  return (
    <section id="projects" className="py-24 bg-gray-50 relative">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,60 L0,20 Q360,60 720,20 Q1080,-20 1440,20 L1440,60 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              My Work
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              Featured Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, i) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 ease-out"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Cover */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                          <Code2 size={28} className="text-blue-400" />
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    {project.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-sm">
                          ★ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {project.project_start ? formatDateShort(project.project_start) : ""}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Project <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------
function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
            Tech Arsenal
          </p>
          <h2 className="text-4xl font-black text-gray-900">
            Skills & Technologies
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-[15px]">
            Tools and technologies I work with daily to ship production-ready software.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {cat}
                </h3>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="flex flex-wrap gap-3">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/80 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 cursor-default group"
                    >
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                        {skill.name}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                              i < skill.proficiency
                                ? "bg-blue-500 group-hover:bg-blue-600"
                                : "bg-gray-200"
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
// EXPERIENCE
// ---------------------------------------------------------------------------
function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-24 bg-gray-50 relative">
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,0 Q360,40 720,0 Q1080,-40 1440,0 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
            Work History
          </p>
          <h2 className="text-4xl font-black text-gray-900">Experience</h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={exp.id} className="relative flex gap-6 sm:gap-8">
                {/* Timeline dot */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      "w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center font-black text-sm shadow-md transition-all duration-200",
                      i === 0
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                        : "bg-white text-gray-600 border-2 border-gray-200"
                    )}
                  >
                    {exp.company.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 hover:shadow-md hover:border-blue-100 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{exp.role}</h3>
                      <p className="text-blue-600 font-semibold text-sm">{exp.company}</p>
                      {exp.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                          <MapPin size={11} /> {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold whitespace-nowrap">
                        {formatDateShort(exp.start_date)} —{" "}
                        {exp.is_current
                          ? "Present"
                          : exp.end_date
                          ? formatDateShort(exp.end_date)
                          : ""}
                      </span>
                      {exp.is_current && (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
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
// LATEST BLOG POSTS
// ---------------------------------------------------------------------------
function LatestPostsSection({ posts, loading }: { posts: PostSummary[]; loading: boolean }) {
  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              Writing
            </p>
            <h2 className="text-4xl font-black text-gray-900">Latest Posts</h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            All Posts
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 ease-out"
                >
                  <div className="h-44 bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden relative">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                          📝
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <Badge variant="info" className="mb-2.5 text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>{post.published_at ? formatDate(post.published_at) : ""}</span>
                      <span className="flex items-center gap-1">{post.read_time} min read</span>
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
// TESTIMONIALS
// ---------------------------------------------------------------------------
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,0 L1440,0 L1440,30 Q720,60 0,30 Z" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-14">
          <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest mb-3">
            Social Proof
          </p>
          <h2 className="text-4xl font-black text-white">What People Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={cn(
                "rounded-2xl p-6 border transition-all duration-300 hover:border-blue-700/50",
                i === 0
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-800 hover:bg-gray-800/80"
              )}
            >
              {/* Quote mark */}
              <div className={cn(
                "text-5xl font-black leading-none mb-4 -mt-1",
                i === 0 ? "text-blue-300/60" : "text-gray-700"
              )}>
                "
              </div>
              <p className={cn(
                "text-sm leading-relaxed mb-6",
                i === 0 ? "text-blue-50" : "text-gray-300"
              )}>
                {t.testimonial}
              </p>
              <div className="flex items-center gap-3">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                    i === 0 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                  )}>
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className={cn(
                    "font-semibold text-sm",
                    i === 0 ? "text-white" : "text-white"
                  )}>
                    {t.name}
                  </p>
                  <p className={cn(
                    "text-xs",
                    i === 0 ? "text-blue-200" : "text-gray-500"
                  )}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/testimonials">
            <button className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-semibold hover:border-gray-500 hover:text-white transition-all duration-200">
              All Testimonials <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
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
      setError("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200";

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-gray-950">
          <path d="M0,30 Q720,60 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              Let's build something{" "}
              <span className="gradient-text">great together</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">
              I'm open to senior engineering roles and interesting freelance projects.
              Whether you have a question, a project idea, or just want to say hi —
              my inbox is always open.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "kevin@kevinmanoti.dev", href: "mailto:kevin@kevinmanoti.dev", color: "bg-blue-100 text-blue-600" },
                { icon: Linkedin, label: "linkedin.com/in/kevinmanoti", href: "https://linkedin.com", color: "bg-indigo-100 text-indigo-600" },
                { icon: Github, label: "github.com/kevinmanoti", href: "https://github.com", color: "bg-gray-100 text-gray-700" },
              ].map(({ icon: Icon, label, href, color }) => (
                
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
                    <Icon size={17} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {label}
                  </span>
                  <ExternalLink size={13} className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6 max-w-xs">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-6 sm:p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-5">Send me a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</label>
                      <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="John Doe" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                      <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</label>
                    <input value={form.subject} onChange={(e) => set("subject", e.target.value)} required placeholder="What's this about?" className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
                    <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required rows={5} placeholder="Tell me about your project or opportunity..." className={cn(inputClass, "resize-none")} />
                  </div>
                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOME PAGE — assembled
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    projectsService.list({ ordering: "featured" }).then((d) => {
      setFeaturedProjects(d.results.slice(0, 6));
      setProjectsLoading(false);
    });
    blogService.list({ ordering: "latest" }).then((d) => {
      setLatestPosts(d.results.slice(0, 3));
      setPostsLoading(false);
    });
    testimonialsService.list({ featured: true }).then((d) =>
      setTestimonials(d.slice(0, 3))
    );
    projectsService.getSkills().then(setSkills);
    projectsService.getExperience().then(setExperience);
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedProjectsSection projects={featuredProjects} loading={projectsLoading} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <LatestPostsSection posts={latestPosts} loading={postsLoading} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </>
  );
}