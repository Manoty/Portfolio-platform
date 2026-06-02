import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { ProjectSummary } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/lib/utils";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { page, setPage } = usePagination();
  const totalPages = Math.ceil(total / 12);

  const load = async () => {
    setLoading(true);
    try {
      const data = await projectsService.list({ all: true, page });
      setProjects(data.results);
      setTotal(data.count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsService.delete(deleteTarget.slug);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (project: ProjectSummary) => {
    await projectsService.update(project.slug, {
      status: project.status === "published" ? "draft" : "published",
    } as never);
    load();
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <Link to="/admin/projects/new">
          <Button>
            <Plus size={16} /> New Project
          </Button>
        </Link>
      </div>

      {/* Table */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
          action={
            <Link to="/admin/projects/new">
              <Button><Plus size={16} /> New Project</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 font-medium text-gray-500">Project</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Technologies</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Featured</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Created</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">
                            {project.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((t) => (
                          <Badge key={t.id} variant="default">{t.name}</Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge>+{project.technologies.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={project.status === "published" ? "success" : "warning"}
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {project.is_featured && (
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => togglePublish(project)}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          title={project.status === "published" ? "Unpublish" : "Publish"}
                        >
                          {project.status === "published"
                            ? <EyeOff size={16} />
                            : <Eye size={16} />
                          }
                        </button>
                        <Link
                          to={`/admin/projects/${project.slug}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </Card>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}