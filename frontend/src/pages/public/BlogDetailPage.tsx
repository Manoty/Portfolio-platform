import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Eye, Tag as TagIcon } from "lucide-react";
import { blogService } from "@/services/blog.service";
import { analyticsService } from "@/services/analytics.service";
import { getSessionKey } from "@/lib/session";
import type { Post } from "@/types";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogService.get(slug).then((p) => {
      setPost(p);
      setLoading(false);
      analyticsService.trackEvent("blog_view", getSessionKey(), p.id, p.title);
    });
  }, [slug]);

  if (loading) return <PageSpinner />;
  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Post not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 to-purple-950 py-20 overflow-hidden">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && <Badge variant="info">{post.category.name}</Badge>}
            {post.is_featured && <Badge variant="warning">Featured</Badge>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.published_at ? formatDate(post.published_at) : "Draft"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.read_time} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {post.view_count.toLocaleString()} views
            </span>
            <span>By {post.author_name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg prose-gray max-w-none leading-relaxed text-gray-700 whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon size={15} className="text-gray-400" />
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/blog?tag=${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {post.related_posts && post.related_posts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {post.related_posts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
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
                      <div className="w-full h-full flex items-center justify-center text-3xl">📝</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rel.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{rel.read_time} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}