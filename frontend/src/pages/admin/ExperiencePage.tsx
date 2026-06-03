import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { Experience } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { formatDateShort } from "@/lib/utils";

const EMPTY_FORM = {
  company: "", role: "", location: "", description: "",
  start_date: "", end_date: "", is_current: false, order: 0,
};

export default function AdminExperiencePage() {
  const [experience, setExperience]     = useState<Experience[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Experience | null>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await projectsService.getExperience();
    setExperience(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: experience.length });
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company: exp.company, role: exp.role, location: exp.location,
      description: exp.description,
      start_date: exp.start_date, end_date: exp.end_date ?? "",
      is_current: exp.is_current, order: exp.order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        end_date: form.is_current ? null : form.end_date || null,
      };
      if (editing) {
        await projectsService.updateExperience(editing.id, payload);
      } else {
        await projectsService.createExperience(payload as Omit<Experience, "id">);
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
      await projectsService.deleteExperience(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
          <p className="text-sm text-gray-500 mt-1">{experience.length} entries · shown on homepage timeline</p>
        </div>
        <Button onClick={openNew}><Plus size={16} /> Add Experience</Button>
      </div>

      {experience.length === 0 ? (
        <EmptyState title="No experience entries yet" description="Add your work history to display on the homepage timeline."
          action={<Button onClick={openNew}><Plus size={16} /> Add Experience</Button>} />
      ) : (
        <Card>
          <div className="divide-y divide-gray-50">
            {experience.map((exp) => (
              <div key={exp.id} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
                <GripVertical size={16} className="text-gray-300 mt-1 shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-gray-900">{exp.role}</p>
                    {exp.is_current && <Badge variant="success">Current</Badge>}
                  </div>
                  <p className="text-blue-600 font-semibold text-sm">{exp.company}</p>
                  {exp.location && <p className="text-xs text-gray-400 mt-0.5">{exp.location}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDateShort(exp.start_date)} — {exp.is_current ? "Present" : exp.end_date ? formatDateShort(exp.end_date) : ""}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEdit(exp)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(exp)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Experience" : "Add Experience"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company / Organization" value={form.company} onChange={(e) => set("company", e.target.value)} required />
            <Input label="Role / Title" value={form.role} onChange={(e) => set("role", e.target.value)} required />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Nairobi, Kenya · Remote" />
          <Textarea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={5} required hint="Use bullet points starting with • for achievements" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required />
            <Input label="End Date" type="date" value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              disabled={form.is_current} hint="Leave blank if current" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => { set("is_current", !form.is_current); if (!form.is_current) set("end_date", ""); }}
              className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form.is_current ? "bg-blue-600" : "bg-gray-200"}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_current ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">This is my current role</span>
          </label>
          <Input label="Display Order" type="number" value={String(form.order)}
            onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            hint="Lower number = shown first (0 = top)" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Add Experience"}</Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Experience"
        message={`Delete "${deleteTarget?.role} at ${deleteTarget?.company}"? This cannot be undone.`}
      />
    </div>
  );
}