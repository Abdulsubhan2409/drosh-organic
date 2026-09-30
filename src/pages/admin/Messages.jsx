import { useEffect, useState } from "react";
import { Trash2, MailOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api("/api/messages")
      .then(setItems)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api(`/api/messages/${id}/read`, { method: "PUT" });
    setItems((m) => m.map((x) => (x.id === id ? { ...x, isRead: true } : x)));
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api(`/api/messages/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Messages</h2>
        <p className="text-sm text-stone-500">
          {items.filter((m) => !m.isRead).length} unread of {items.length}
        </p>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border p-5 ${m.isRead ? "border-stone-200" : "border-amber-300"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {m.name}{" "}
                    {!m.isRead && <span className="ml-2 text-[10px] uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full">New</span>}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-amber-700">{m.email}</a>
                  {m.subject && <p className="text-sm font-medium mt-2">{m.subject}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-stone-500">{new Date(m.createdAt).toLocaleString()}</p>
                  <div className="flex justify-end gap-1 mt-2">
                    {!m.isRead && (
                      <button onClick={() => markRead(m.id)} className="p-2 rounded-lg hover:bg-stone-100" title="Mark as read">
                        <MailOpen className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => remove(m.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-stone-700 mt-3 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}