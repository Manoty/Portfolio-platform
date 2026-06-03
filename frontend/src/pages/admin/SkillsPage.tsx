import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { Skill } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  { value: "Languages",  label: "Languages"  },
  { value: "Frameworks", label: "Frameworks" },
  { value: "Databases",  label: "Databases"  },
  { value: "Tools",      label: "Tools"      },
  { value: "DevOps",     label: "DevOps"     },
  { value: "Other",      label: "Other"      },
];

type SkillForm = Omit<Skill, "id">;

const EMPTY_FORM: SkillForm = { name: "", category: "Languages", proficiency: 3, icon_url: "", order: 0 };

export default function AdminSkillsPage() {
  const [skills, setSkills]             = useState<Skill[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Skill | null>(null);
  const [form, setForm]                 = useState<SkillForm>(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await projectsService.getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: skills.length });
    setModalOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, icon_url: s.icon_url || "", order: s.order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await projectsService.updateSkill(editing.id, form);
      } else {
        await projectsService.createSkill(form as Omit<Skill, "id">);
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
      await projectsService.deleteSkill(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const set = (field: keyof SkillForm, value: SkillForm[keyof SkillForm]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
          <p className="text-sm text-gray-500 mt-1">{skills.length} skills across {categories.length} categories</p>
        </div>
        <Button onClick={openNew}><Plus size={16} /> Add Skill</Button>
      </div>

      {skills.length === 0 ? (
        <EmptyState title="No skills yet" description="Add your technical skills to display on the homepage."
          action={<Button onClick={openNew}><Plus size={16} /> Add Skill</Button>} />
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <Card key={cat}>
              <CardHeader>
                <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">{cat}</h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-50">
                  {skills.filter((s) => s.category === cat).map((skill) => (
                    <div key={skill.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{skill.name}</p>
                      </div>
                      {/* Proficiency dots */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            i < skill.proficiency ? "bg-blue-500" : "bg-gray-200"
                          )} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 w-16 text-right">
                        {["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"][skill.proficiency]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(skill)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(skill)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Skill" : "Add Skill"} size="sm">
        <div className="space-y-4">
          <Input label="Skill Name" value={form.name} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. dbt, DuckDB, Streamlit, Cypress" required />
          <Select label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} options={CATEGORY_OPTIONS} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Proficiency — {["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"][form.proficiency]}
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} value={form.proficiency}
                onChange={(e) => set("proficiency", parseInt(e.target.value))}
                className="flex-1 accent-blue-600" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={cn("w-3 h-3 rounded-full", i < form.proficiency ? "bg-blue-500" : "bg-gray-200")} />
                ))}
              </div>
            </div>
          </div>
          <Input label="Display Order" type="number" value={String(form.order)}
            onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            hint="Lower = shown first within category" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Add Skill"}</Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Skill"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}