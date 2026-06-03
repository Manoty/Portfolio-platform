import { useState, useEffect } from "react";
import { settingsService } from "@/services/settings.service";
import { useSettingsStore } from "@/store/settings.store";
import type { SiteSettings } from "@/types";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";

export default function AdminSiteSettingsPage() {
  const { update } = useSettingsStore();
  const [form, setForm]       = useState<Partial<SiteSettings>>({});
  const [loaded, setLoaded]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    settingsService.get().then((data) => {
      setForm(data);
      if (data.profile_image) setPhotoPreview(data.profile_image);
      setLoaded(true);
    });
  }, []);

  const set = (field: keyof SiteSettings, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          fd.append(k, String(v));
        }
      });
      if (photoFile) fd.append("profile_image", photoFile);
      const updated = await settingsService.update(fd);
      update(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <PageSpinner />;

  const inputClass = (field: keyof SiteSettings) => ({
    value: String(form[field] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(field, e.target.value),
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all portfolio content — changes reflect immediately on the public site.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Identity */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Identity</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" {...inputClass("full_name")} required />
              <Input label="Tagline / Role" {...inputClass("tagline")} placeholder="Full Stack Engineer" required />
            </div>
            <Input label="Short Bio" {...inputClass("bio_short")} placeholder="One-liner shown in the hero section" />
            <Textarea label="Bio — Paragraph 1" value={String(form.bio_long ?? "")}
              onChange={(e) => set("bio_long", e.target.value)} rows={3}
              hint="First paragraph in the About section" />
            <Textarea label="Bio — Paragraph 2" value={String(form.bio_long_2 ?? "")}
              onChange={(e) => set("bio_long_2", e.target.value)} rows={3}
              hint="Second paragraph (optional)" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Location" {...inputClass("location")} placeholder="Nairobi, Kenya" />
              <Input label="Availability Text" {...inputClass("availability_text")} placeholder="Available for opportunities" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set("open_to_work", !form.open_to_work)}
                className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form.open_to_work ? "bg-blue-600" : "bg-gray-200"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.open_to_work ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Show "available for opportunities" badge
              </span>
            </label>
          </CardBody>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Stats (About Section)</h2></CardHeader>
          <CardBody className="grid grid-cols-2 gap-4">
            <Input label="Years Experience" {...inputClass("stat_experience")} placeholder="5+" />
            <Input label="Projects Shipped" {...inputClass("stat_projects")} placeholder="30+" />
            <Input label="Technologies" {...inputClass("stat_technologies")} placeholder="20+" />
            <Input label="Open Source PRs" {...inputClass("stat_open_source")} placeholder="50+" />
          </CardBody>
        </Card>

        {/* Contact & Social */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Contact & Social Links</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Email" type="email" {...inputClass("email")} />
            <Input label="GitHub URL" {...inputClass("github_url")} placeholder="https://github.com/yourhandle" />
            <Input label="LinkedIn URL" {...inputClass("linkedin_url")} placeholder="https://linkedin.com/in/yourhandle" />
            <Input label="Twitter URL" {...inputClass("twitter_url")} placeholder="https://twitter.com/yourhandle" />
          </CardBody>
        </Card>

        {/* Profile image */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Profile Image</h2></CardHeader>
          <CardBody className="space-y-4">
            {photoPreview && (
              <img src={photoPreview} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border border-gray-200" />
            )}
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer hover:border-blue-400 transition-colors">
              <span className="text-sm text-gray-500">
                {photoPreview ? "Click to replace photo" : "Click to upload profile photo"}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </CardBody>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">SEO</h2></CardHeader>
          <CardBody>
            <Textarea label="Meta Description" value={String(form.meta_description ?? "")}
              onChange={(e) => set("meta_description", e.target.value)} rows={2}
              hint="Shown in search engine results (150–160 chars recommended)" />
          </CardBody>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {saved && (
            <p className="text-sm text-green-600 font-semibold animate-fade-in-up">
              ✓ Settings saved successfully
            </p>
          )}
        </div>
      </form>
    </div>
  );
}