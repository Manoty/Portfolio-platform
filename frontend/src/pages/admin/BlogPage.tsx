import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { blogService } from "@/services/blog.service";
import type { PostSummary } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PostSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { page, setPage } = usePagination();
  const totalPages = Math.ceil(total / 9);

  const load = async () => {
    setLoading(true);
    try {
      const data = await blogService.list({ all: true, page });
      setPosts(data.results);
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
      await blogService.delete(deleteTarget.slug);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (post: PostSummary) => {
    await blogService.update(post.slug, {
      status: post.status === "published" ? "draft" : "published",
    } as never);
    load();
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <Link to="/admin/blog/new">
          <Button><Plus size={16} /> New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Create your first blog post to get started."
          action={
            <Link to="/admin/blog/new">
              <Button><Plus size={16} /> New Post</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 font-medium text-gray-500">Post</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Views</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-gray-900">{post.title}</p>
                            {post.is_featured && (
                              <Star size={12} className="text-yellow-500 fill-yellow-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{post.read_time} min read</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category ? (
                        <Badge variant="info">{post.category.name}</Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={post.status === "published" ? "success" : "warning"}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{post.view_count}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {post.published_at ? formatDate(post.published_at) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => togglePublish(post)}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          title={post.status === "published" ? "Unpublish" : "Publish"}
                        >
                          {post.status === "published"
                            ? <EyeOff size={16} />
                            : <Eye size={16} />
                          }
                        </button>
                        <Link
                          to={`/admin/blog/${post.slug}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(post)}
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
        title="Delete Post"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}