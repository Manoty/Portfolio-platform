import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { Technology } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

const EMPTY_FORM = { name: "", color: "#3b82f6", icon_url: "" };

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Technology | null>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Technology | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await projectsService.getTechnologies();
    setTechnologies(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (t: Technology) => {
    setEditing(t);
    setForm({ name: t.name, color: t.color || "#3b82f6", icon_url: t.icon_url || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await projectsService.updateTechnology(editing.id, form);
      } else {
        await projectsService.createTechnology(form);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsService.deleteTechnology(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technologies</h1>
          <p className="text-sm text-gray-500 mt-1">{technologies.length} total · used to tag projects</p>
        </div>
        <Button onClick={openNew}><Plus size={16} /> Add Technology</Button>
      </div>

      {technologies.length === 0 ? (
        <EmptyState title="No technologies yet" action={<Button onClick={openNew}><Plus size={16} /> Add Technology</Button>} />
      ) : (
        <Card>
          <div className="divide-y divide-gray-50">
            {technologies.map((tech) => (
              <div key={tech.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Color swatch */}
                <div
                  className="w-8 h-8 rounded-lg border border-gray-200 shrink-0 shadow-sm"
                  style={{ backgroundColor: tech.color || "#e5e7eb" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{tech.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{tech.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(tech)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(tech)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Technology" : "Add Technology"} size="sm">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. dbt, DuckDB, Streamlit" required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <span className="text-sm text-gray-500 font-mono">{form.color}</span>
            </div>
          </div>
          <Input label="Icon URL" value={form.icon_url} onChange={(e) => set("icon_url", e.target.value)} placeholder="https://cdn.example.com/icon.svg" hint="Optional — link to a brand SVG icon" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Add Technology"}</Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Technology"
        message={`Delete "${deleteTarget?.name}"? Projects using this technology will lose this tag.`}
      />
    </div>
  );
}