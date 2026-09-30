import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const input =
  "mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function Settings() {
  const [store, setStore] = useState({
    storeName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    shippingFee: "",
  });
  const [storeMsg, setStoreMsg] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    api("/api/settings")
      .then((s) => setStore((prev) => ({ ...prev, ...s })))
      .catch(() => {});
  }, []);

  const saveStore = async (e) => {
    e.preventDefault();
    setStoreMsg("Saving...");
    try {
      await api("/api/settings", { method: "PUT", body: JSON.stringify(store) });
      setStoreMsg("Saved.");
    } catch (err) {
      setStoreMsg(err.message);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    try {
      await api("/api/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: pw.currentPassword,
          newPassword: pw.newPassword,
        }),
      });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwMsg({ type: "ok", text: "Password changed." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message });
    }
  };

  const setS = (k, v) => setStore((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-stone-500">Store details and your admin account.</p>
      </div>

      <form onSubmit={saveStore} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold">Store information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-stone-600">Store name</label>
            <input className={input} value={store.storeName} onChange={(e) => setS("storeName", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-stone-600">Contact email</label>
            <input type="email" className={input} value={store.email} onChange={(e) => setS("email", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-stone-600">Phone</label>
            <input className={input} value={store.phone} onChange={(e) => setS("phone", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-stone-600">WhatsApp number</label>
            <input className={input} value={store.whatsapp} onChange={(e) => setS("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-stone-600">Shipping fee (Rs)</label>
            <input type="number" min="0" className={input} value={store.shippingFee} onChange={(e) => setS("shippingFee", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm text-stone-600">Address</label>
          <textarea rows={2} className={input} value={store.address} onChange={(e) => setS("address", e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-lg text-sm bg-stone-950 text-white hover:bg-stone-800">
            Save changes
          </button>
          {storeMsg && <span className="text-sm text-stone-600">{storeMsg}</span>}
        </div>
      </form>

      <form onSubmit={savePassword} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold">Change admin password</h3>
        {pwMsg.text && (
          <div className={`text-sm rounded-lg px-3 py-2 ${pwMsg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {pwMsg.text}
          </div>
        )}
        <div>
          <label className="text-sm text-stone-600">Current password</label>
          <input type="password" required className={input} value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-stone-600">New password (min 8 characters)</label>
            <input type="password" required className={input} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-stone-600">Confirm new password</label>
            <input type="password" required className={input} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </div>
        </div>
        <button className="px-5 py-2 rounded-lg text-sm bg-stone-950 text-white hover:bg-stone-800">
          Update password
        </button>
      </form>
    </div>
  );
}