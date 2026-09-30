import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";
import { api } from "@/lib/api";

const statusStyle = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{title}</p>
        <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-stone-400">{note}</p>
    </div>
  );
}

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats")
      .then(setS)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>;
  if (!s) return <p className="text-stone-500">Loading...</p>;

  const max = Math.max(...s.weekly.map((w) => w.value), 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-stone-500">
          {s.pendingOrders} pending orders and {s.unreadMessages} unread messages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Revenue" value={`Rs ${s.revenue.toLocaleString()}`} note="Excludes cancelled orders" icon={TrendingUp} />
        <StatCard title="Orders" value={s.orders} note="Excludes cancelled orders" icon={ShoppingBag} />
        <StatCard title="Products" value={s.products} note="Live in your shop" icon={Package} />
        <StatCard title="Customers" value={s.customers} note="Unique emails from orders" icon={Users} />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <h3 className="font-semibold">Sales, last 7 days (Rs)</h3>
        <div className="mt-6 flex items-end justify-between gap-3 h-52">
          {s.weekly.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-stone-500">{w.value ? w.value.toLocaleString() : ""}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400"
                style={{ height: `${Math.max((w.value / max) * 85, w.value ? 4 : 1)}%` }}
              />
              <span className="text-xs text-stone-500">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="font-semibold">Recent orders</h3>
        </div>
        {s.recentOrders.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-stone-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {s.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-stone-100">
                    <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                    <td className="px-6 py-4">{o.customerName}</td>
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
    </div>
  );
}