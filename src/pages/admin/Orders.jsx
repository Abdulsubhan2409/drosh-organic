import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
const statusStyle = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState(null);

  const load = () =>
    api("/api/orders")
      .then(setOrders)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api(`/api/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
      setView((v) => (v && v.id === id ? { ...v, status } : v));
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (o) => {
    if (!confirm(`Delete order ${o.orderNumber}?`)) return;
    try {
      await api(`/api/orders/${o.id}`, { method: "DELETE" });
      setView(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const shown = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="text-sm text-stone-500">{orders.length} orders in total</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === s ? "bg-stone-950 text-white" : "bg-white border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-stone-500">Loading...</p>
        ) : shown.length === 0 ? (
          <p className="p-8 text-center text-stone-500">No orders here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.id} onClick={() => setView(o)} className="border-t border-stone-100 cursor-pointer hover:bg-stone-50">
                    <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                    <td className="px-6 py-4">
                      {o.customerName}
                      <p className="text-xs text-stone-500">{o.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">Rs {o.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[o.status]}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {view && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl max-w-xl mx-auto my-8 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Order {view.orderNumber}</h3>
              <button onClick={() => setView(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm space-y-1">
              <p><span className="text-stone-500">Customer:</span> {view.customerName}</p>
              <p><span className="text-stone-500">Phone:</span> {view.phone || "-"}</p>
              <p><span className="text-stone-500">Email:</span> {view.email || "-"}</p>
              <p><span className="text-stone-500">Address:</span> {view.address || "-"}, {view.city}</p>
              <p><span className="text-stone-500">Payment:</span> {view.paymentMethod}</p>
              {view.notes && <p><span className="text-stone-500">Notes:</span> {view.notes}</p>}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-3">
              {view.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-stone-100" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.name}</p>
                    <p className="text-xs text-stone-500">Qty {it.quantity} x Rs {it.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm">Rs {(it.price * it.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t border-stone-100">
                <span>Total</span>
                <span>Rs {view.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <select
                value={view.status}
                onChange={(e) => changeStatus(view.id, e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button onClick={() => remove(view)} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" /> Delete order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}