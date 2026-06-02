import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { ContactMessage } from "@/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card, { CardBody } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";

export default function AdminMessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    contactService.get(id).then((msg) => {
      setMessage(msg);
      setLoading(false);
    });
  }, [id]);

  const handleArchive = async () => {
    if (!message) return;
    await contactService.updateStatus(message.id, "archived");
    navigate("/admin/messages");
  };

  const handleDelete = async () => {
    if (!message) return;
    setDeleting(true);
    await contactService.delete(message.id);
    navigate("/admin/messages");
  };

  if (loading) return <PageSpinner />;
  if (!message) return null;

  const statusVariant = {
    unread: "danger", read: "success", archived: "default",
  } as const;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/messages")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Message</h1>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{message.subject}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                From <strong>{message.name}</strong> ({message.email})
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(message.created_at)}</p>
            </div>
            <Badge variant={statusVariant[message.status]}>{message.status}</Badge>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
              <Button size="sm">Reply via Email</Button>
            </a>
            {message.status !== "archived" && (
              <Button size="sm" variant="outline" onClick={handleArchive}>
                <Archive size={14} /> Archive
              </Button>
            )}
            <Button size="sm" variant="danger" onClick={() => setShowDelete(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </CardBody>
      </Card>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Message"
        message="Delete this message permanently?"
      />
    </div>
  );
}