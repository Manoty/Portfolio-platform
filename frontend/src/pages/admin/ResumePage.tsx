import { useEffect, useState } from "react";
import { Upload, Download, Trash2, CheckCircle } from "lucide-react";
import { resumeService } from "@/services/resume.service";
import type { Resume } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";

export default function AdminResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [label, setLabel] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await resumeService.list();
      setResumes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !label.trim()) {
      alert("Please enter a label before uploading.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("label", label);
      fd.append("is_active", "true");
      await resumeService.upload(fd);
      setLabel("");
      load();
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (resume: Resume) => {
    await resumeService.update(resume.id, { is_active: true });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumeService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage your resume PDF
        </p>
      </div>

      {/* Upload card */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Upload New Resume</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <input
            type="text"
            placeholder="Label e.g. Resume — June 2025"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className={`flex items-center gap-3 border-2 border-dashed rounded-lg px-6 py-5 cursor-pointer transition-colors ${
            uploading
              ? "border-gray-200 opacity-50"
              : "border-gray-200 hover:border-blue-400"
          }`}>
            <Upload size={20} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {uploading ? "Uploading..." : "Click to upload PDF"}
              </p>
              <p className="text-xs text-gray-400">PDF files only</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </CardBody>
      </Card>

      {/* Existing resumes */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">All Resumes</h2>
        </CardHeader>
        <CardBody className="p-0">
          {resumes.length === 0 ? (
            <p className="text-sm text-gray-400 px-6 py-4">No resumes uploaded yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{resume.label}</p>
                      {resume.is_active && (
                        <Badge variant="success">
                          <CheckCircle size={11} className="mr-1" /> Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {resume.download_count} downloads · Uploaded {formatDate(resume.created_at)}
                      {resume.last_downloaded_at && ` · Last downloaded ${formatDate(resume.last_downloaded_at)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!resume.is_active && (
                      <Button size="sm" variant="outline" onClick={() => setActive(resume)}>
                        Set Active
                      </Button>
                    )}
                    <a href={resume.file} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost">
                        <Download size={14} />
                      </Button>
                    </a>
                    <button
                      onClick={() => setDeleteTarget(resume)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Resume"
        message={`Delete "${deleteTarget?.label}"? This cannot be undone.`}
      />
    </div>
  );
}