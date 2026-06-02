import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { Project, Technology } from "@/types";
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

export default function AdminProjectFormPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    github_url: "",
    live_url: "",
    status: "draft",
    is_featured: false,
    project_start: "",
    project_end: "",
    technology_ids: [] as number[],
  });

  useEffect(() => {
    const init = async () => {
      const techs = await projectsService.getTechnologies();
      setTechnologies(techs);

      if (isEditing && slug) {
        const project = await projectsService.get(slug) as Project;
        setForm({
          title: project.title,
          summary: project.summary,
          description: project.description,
          github_url: project.github_url,
          live_url: project.live_url,
          status: project.status,
          is_featured: project.is_featured,
          project_start: project.project_start ?? "",
          project_end: project.project_end ?? "",
          technology_ids: project.technologies.map((t) => t.id),
        });
        if (project.cover_image) setCoverPreview(project.cover_image);
      }
      setLoading(false);
    };
    init();
  }, [slug, isEditing]);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTech = (id: number) => {
    setForm((prev) => ({
      ...prev,
      technology_ids: prev.technology_ids.includes(id)
        ? prev.technology_ids.filter((t) => t !== id)
        : [...prev.technology_ids, id],
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
      Object.entries(form).forEach(([key, value]) => {
        if (key === "technology_ids") {
          (value as number[]).forEach((id) => fd.append("technology_ids", String(id)));
        } else {
          fd.append(key, String(value));
        }
      });
      if (coverFile) fd.append("cover_image", coverFile);

      if (isEditing && slug) {
        await projectsService.update(slug, fd);
      } else {
        await projectsService.create(fd);
      }
      navigate("/admin/projects");
    } catch (err: unknown) {
      setError("Failed to save project. Please check all fields and try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/projects")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Project" : "New Project"}
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
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Project Details</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
                <Textarea
                  label="Summary"
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  placeholder="Short description shown on project cards (max 500 chars)"
                  rows={2}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={8}
                    placeholder="Full project description (Markdown or plain text for now — Tiptap editor wires in next)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
                    required
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Links</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="GitHub URL"
                  type="url"
                  value={form.github_url}
                  onChange={(e) => set("github_url", e.target.value)}
                  placeholder="https://github.com/you/repo"
                />
                <Input
                  label="Live Demo URL"
                  type="url"
                  value={form.live_url}
                  onChange={(e) => set("live_url", e.target.value)}
                  placeholder="https://yourproject.com"
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Technologies</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => {
                    const selected = form.technology_ids.includes(tech.id);
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => toggleTech(tech.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {tech.name}
                      </button>
                    );
                  })}
                  {technologies.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No technologies yet. Add them in Settings.
                    </p>
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("is_featured", !form.is_featured)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full transition-colors ${
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
                </label>
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
                      alt="Cover preview"
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

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Timeline</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={form.project_start}
                  onChange={(e) => set("project_start", e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={form.project_end}
                  onChange={(e) => set("project_end", e.target.value)}
                  hint="Leave blank if ongoing"
                />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? "Save Changes" : "Create Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/projects")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}