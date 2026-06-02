import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MailOpen, Archive, Trash2 } from "lucide-react";
import { contactService } from "@/services/contact.service";
import type { ContactMessage } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/lib/utils";

const STATUS_FILTERS = ["all", "unread", "read", "archived"] as const;

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { page, setPage } = usePagination();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter as ContactMessage["status"], page } : { page };
      const data = await contactService.list(params);
      setMessages(data.results);
      setTotal(data.count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleStatusChange = async (msg: ContactMessage, status: ContactMessage["status"]) => {
    await contactService.updateStatus(msg.id, status);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status: ContactMessage["status"]) => {
    const map = { unread: "danger", read: "success", archived: "default" } as const;
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              filter === f
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <EmptyState title="No messages" description="Your inbox is empty." />
      ) : (
        <Card>
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                  msg.status === "unread" ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {msg.status === "unread"
                    ? <Mail size={18} className="text-blue-500" />
                    : <MailOpen size={18} className="text-gray-400" />
                  }
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/admin/messages/${msg.id}`)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">{msg.name}</span>
                    <span className="text-sm text-gray-400">{msg.email}</span>
                    {statusBadge(msg.status)}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{msg.subject}</p>
                  <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(msg.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {msg.status !== "archived" && (
                    <button
                      onClick={() => handleStatusChange(msg, "archived")}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      title="Archive"
                    >
                      <Archive size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {Math.ceil(total / 20) > 1 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination page={page} totalPages={Math.ceil(total / 20)} onPageChange={setPage} />
            </div>
          )}
        </Card>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}