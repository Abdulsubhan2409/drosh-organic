import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api("/api/admin/customers")
      .then(setItems)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, []);

  const shown = items.filter((c) =>
    `${c.name} ${c.email} ${c.phone} ${c.city}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Customers</h2>
        <p className="text-sm text-stone-500">{items.length} customers who have placed orders</p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2 max-w-sm">
        <Search className="h-4 w-4 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, city..."
          className="w-full text-sm focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-stone-500">Loading...</p>
        ) : shown.length === 0 ? (
          <p className="p-8 text-center text-stone-500">No customers yet. They appear after the first order.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">City</th>
                  <th className="px-6 py-3 font-medium">Orders</th>
                  <th className="px-6 py-3 font-medium">Total spent</th>
                  <th className="px-6 py-3 font-medium">Last order</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c, i) => (
                  <tr key={i} className="border-t border-stone-100">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-medium">
                          {c.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p>{c.email || "-"}</p>
                      <p className="text-xs text-stone-500">{c.phone}</p>
                    </td>
                    <td className="px-6 py-4">{c.city || "-"}</td>
                    <td className="px-6 py-4">{c.orders}</td>
                    <td className="px-6 py-4">Rs {c.spent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-stone-600">{new Date(c.lastOrder).toLocaleDateString()}</td>
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