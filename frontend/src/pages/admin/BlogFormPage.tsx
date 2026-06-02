import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import { blogService } from "@/services/blog.service";
import type { Category, Tag } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { PageSpinner } from "@/components/ui/Spinner";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export default function AdminBlogFormPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    is_featured: false,
    category_id: "",
    tag_ids: [] as number[],
  });

  useEffect(() => {
    const init = async () => {
      const [cats, tgs] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags(),
      ]);
      setCategories(cats);
      setTags(tgs);

      if (isEditing && slug) {
        const post = await blogService.get(slug);
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          is_featured: post.is_featured,
          category_id: post.category ? String(post.category.id) : "",
          tag_ids: post.tags.map((t) => t.id),
        });
        if (post.cover_image) setCoverPreview(post.cover_image);
      }
      setLoading(false);
    };
    init();
  }, [slug, isEditing]);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTag = (id: number) => {
    setForm((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(id)
        ? prev.tag_ids.filter((t) => t !== id)
        : [...prev.tag_ids, id],
    }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("status", form.status);
      fd.append("is_featured", String(form.is_featured));
      if (form.category_id) fd.append("category_id", form.category_id);
      form.tag_ids.forEach((id) => fd.append("tag_ids", String(id)));
      if (coverFile) fd.append("cover_image", coverFile);

      if (isEditing && slug) {
        await blogService.update(slug, fd);
      } else {
        await blogService.create(fd);
      }
      navigate("/admin/blog");
    } catch {
      setError("Failed to save post. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  const categoryOptions = [
    { value: "", label: "No category" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? `Editing: ${form.title}` : "Fill in the details below"}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Post Content</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Your post title"
                  required
                />
                <Textarea
                  label="Excerpt"
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Brief summary shown on listing cards"
                  rows={2}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    rows={16}
                    placeholder="Write your post content here..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Rich text editor (Tiptap) wires in next sprint
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Tags</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const selected = form.tag_ids.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                  {tags.length === 0 && (
                    <p className="text-sm text-gray-400">No tags yet.</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Publish</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  options={STATUS_OPTIONS}
                />
                <Select
                  label="Category"
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  options={categoryOptions}
                />
                <div
                  onClick={() => set("is_featured", !form.is_featured)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    form.is_featured
                      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Star
                    size={16}
                    className={form.is_featured ? "fill-yellow-500 text-yellow-500" : ""}
                  />
                  <span className="text-sm font-medium">
                    {form.is_featured ? "Featured" : "Mark as Featured"}
                  </span>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Cover Image</h2>
              </CardHeader>
              <CardBody>
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-gray-500 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition-colors">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? "Save Changes" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}