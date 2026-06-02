import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FolderGit, ExternalLink, ArrowLeft, Calendar, Eye } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import { analyticsService } from "@/services/analytics.service";
import { getSessionKey } from "@/lib/session";
import type { Project } from "@/types";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDateShort } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    projectsService.get(slug).then((p) => {
      setProject(p);
      setLoading(false);
      // Track event
      analyticsService.trackEvent("project_view", getSessionKey(), p.id, p.title);
    });
  }, [slug]);

  if (loading) return <PageSpinner />;
  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Project not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-br from-gray-900 to-blue-950 overflow-hidden">
        {project.cover_image && (
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Projects
            </Link>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge variant={project.status === "published" ? "success" : "warning"}>
                {project.status}
              </Badge>
              {project.is_featured && <Badge variant="info">Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white">{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>

            {/* Screenshot gallery */}
            {project.images.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setLightboxImg(img.image)}
                      className="aspect-video rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img
                        src={img.image}
                        alt={img.caption || "Screenshot"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture diagram */}
            {project.architecture_diagram && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture</h2>
                <img
                  src={project.architecture_diagram}
                  alt="Architecture diagram"
                  className="w-full rounded-xl border border-gray-200"
                />
              </div>
            )}

            {/* Related */}
            {project.related_projects && project.related_projects.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Related Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.related_projects.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/projects/${rel.slug}`}
                      className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-32 bg-gray-100 overflow-hidden">
                        {rel.cover_image ? (
                          <img
                            src={rel.cover_image}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🚀</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {rel.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Links */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <FolderGit size={18} /> View Source Code
                </a>
              )}
              {project.live_url && (
                <a
                
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink size={18} /> View Live Demo
                </a>
              )}
            </div>

            {/* Tech stack */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
              {(project.project_start || project.project_end) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={15} className="text-gray-400" />
                  {project.project_start && formatDateShort(project.project_start)}
                  {project.project_end && ` — ${formatDateShort(project.project_end)}`}
                  {!project.project_end && " — Present"}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye size={15} className="text-gray-400" />
                {project.view_count.toLocaleString()} views
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Screenshot"
            className="max-w-full max-h-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}