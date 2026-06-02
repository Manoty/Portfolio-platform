import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { testimonialsService } from "@/services/testimonials.service";
import type { Testimonial } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

const EMPTY_FORM = {
  name: "", role: "", company: "", testimonial: "",
  is_featured: false, is_published: true, order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await testimonialsService.list({ all: true });
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name, role: t.role, company: t.company,
      testimonial: t.testimonial, is_featured: t.is_featured,
      is_published: t.is_published, order: t.order,
    });
    setPhotoFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (photoFile) fd.append("photo", photoFile);

      if (editing) {
        await testimonialsService.update(editing.id, fd);
      } else {
        await testimonialsService.create(fd);
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
      await testimonialsService.delete(deleteTarget.id);
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
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">{testimonials.length} total</p>
        </div>
        <Button onClick={openNew}><Plus size={16} /> Add Testimonial</Button>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          action={<Button onClick={openNew}><Plus size={16} /> Add Testimonial</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="relative">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {t.is_featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                    {!t.is_published && <Badge variant="warning">Hidden</Badge>}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">"{t.testimonial}"</p>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(t)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Input label="Role" value={form.role} onChange={(e) => set("role", e.target.value)} required />
          </div>
          <Input label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} required />
          <Textarea
            label="Testimonial"
            value={form.testimonial}
            onChange={(e) => set("testimonial", e.target.value)}
            rows={4}
            required
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving}>
              {editing ? "Save Changes" : "Add Testimonial"}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Testimonial"
        message={`Delete testimonial from "${deleteTarget?.name}"?`}
      />
    </div>
  );
}