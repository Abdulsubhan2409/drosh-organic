import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { api } from "@/lib/api";

const emptyForm = {
  name: "",
  category: "Wellness",
  tagline: "",
  shortDescription: "",
  longDescription: "",
  price: "",
  size: "",
  image: "",
  galleryText: "",
  benefitsText: "",
  howToUse: "",
  ingredients: "",
  region: "",
  elevation: "",
  accent: "cream",
  inStock: true,
};

const input =
  "mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null); // null = modal closed
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    api("/api/products")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setForm({ ...emptyForm });

  const openEdit = (p) =>
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      tagline: p.tagline || "",
      shortDescription: p.shortDescription || "",
      longDescription: p.longDescription || "",
      price: p.price,
      size: p.size || "",
      image: p.image || "",
      galleryText: (p.gallery || []).join("\n"),
      benefitsText: (p.benefits || []).join("\n"),
      howToUse: p.howToUse || "",
      ingredients: p.ingredients || "",
      region: p.origin?.region || "",
      elevation: p.origin?.elevation || "",
      accent: p.accent || "cream",
      inStock: p.inStock,
    });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const lines = (t) =>
    t
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { url } = await api("/api/upload", { method: "POST", body: fd });
      set("image", url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name,
      category: form.category,
      tagline: form.tagline,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      price: Number(form.price),
      size: form.size,
      image: form.image,
      gallery: lines(form.galleryText),
      benefits: lines(form.benefitsText),
      howToUse: form.howToUse,
      ingredients: form.ingredients,
      origin: { region: form.region, elevation: form.elevation },
      accent: form.accent,
      inStock: form.inStock,
    };
    try {
      if (form.id) {
        await api(`/api/products/${form.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/products", { method: "POST", body: JSON.stringify(body) });
      }
      setForm(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/products/${p.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-stone-500">{items.length} products in your shop</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-stone-950 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-stone-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-stone-500">No products yet. Click "Add product".</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-stone-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-stone-100" />
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-stone-500">{p.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">Rs {p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-stone-100" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(p)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
          <form
            onSubmit={save}
            className="bg-white rounded-2xl max-w-3xl mx-auto my-8 p-6 md:p-8 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{form.id ? "Edit product" : "Add product"}</h3>
              <button type="button" onClick={() => setForm(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-stone-600">Name *</label>
                <input required className={input} value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Category *</label>
                <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option>Skincare</option>
                  <option>Wellness</option>
                  <option>Fragrance</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-stone-600">Price (Rs) *</label>
                <input required type="number" min="0" className={input} value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Size</label>
                <input className={input} placeholder="30ml — Glass Bottle" value={form.size} onChange={(e) => set("size", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm text-stone-600">Tagline</label>
              <input className={input} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-stone-600">Short description</label>
              <textarea rows={2} className={input} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-stone-600">Long description</label>
              <textarea rows={4} className={input} value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
            </div>

            {/* Image */}
            <div>
              <label className="text-sm text-stone-600">Main image *</label>
              <div className="mt-1 flex items-center gap-3">
                {form.image && <img src={form.image} alt="" className="h-16 w-16 rounded-lg object-cover bg-stone-100" />}
                <label className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg text-sm cursor-pointer hover:bg-stone-50">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload image"}
                  <input type="file" accept="image/*" className="hidden" onChange={upload} />
                </label>
              </div>
              <input
                className={input}
                placeholder="...or paste an image URL"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-stone-600">Gallery images (one URL per line)</label>
              <textarea rows={3} className={input} value={form.galleryText} onChange={(e) => set("galleryText", e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-stone-600">Benefits (one per line)</label>
              <textarea rows={4} className={input} value={form.benefitsText} onChange={(e) => set("benefitsText", e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-stone-600">How to use</label>
              <textarea rows={2} className={input} value={form.howToUse} onChange={(e) => set("howToUse", e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-stone-600">Ingredients</label>
              <textarea rows={2} className={input} value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-stone-600">Origin region</label>
                <input className={input} value={form.region} onChange={(e) => set("region", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Elevation</label>
                <input className={input} value={form.elevation} onChange={(e) => set("elevation", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Accent</label>
                <select className={input} value={form.accent} onChange={(e) => set("accent", e.target.value)}>
                  <option>cream</option>
                  <option>amber</option>
                  <option>obsidian</option>
                  <option>forest</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} />
              In stock
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 rounded-lg text-sm border border-stone-300 hover:bg-stone-50">
                Cancel
              </button>
              <button disabled={saving || uploading} className="px-5 py-2 rounded-lg text-sm bg-stone-950 text-white hover:bg-stone-800 disabled:opacity-60">
                {saving ? "Saving..." : "Save product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}