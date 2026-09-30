import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pool from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

/* ---------- helpers ---------- */
const parseJson = (v, fallback = []) => {
  if (v == null) return fallback;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }
  return v;
};

const formatProduct = (r) => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  tagline: r.tagline,
  shortDescription: r.short_description,
  longDescription: r.long_description,
  price: Number(r.price),
  size: r.size,
  image: r.image,
  gallery: parseJson(r.gallery),
  benefits: parseJson(r.benefits),
  howToUse: r.how_to_use,
  ingredients: r.ingredients,
  origin: { region: r.origin_region, elevation: r.origin_elevation },
  accent: r.accent,
  inStock: !!r.in_stock,
});

const formatOrder = (r) => ({
  id: r.id,
  orderNumber: r.order_number,
  customerName: r.customer_name,
  email: r.email,
  phone: r.phone,
  address: r.address,
  city: r.city,
  items: parseJson(r.items),
  total: Number(r.total),
  paymentMethod: r.payment_method,
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at,
});

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ---------- auth ---------- */
const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not logged in" });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") return res.status(403).json({ error: "Admins only" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
};

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
      return res.status(401).json({ error: "Wrong email or password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/auth/me", requireAdmin, (req, res) => res.json(req.user));
app.post("/api/auth/refresh", requireAdmin, (req, res) => {
  const { id, email, name, role } = req.user;
  const token = jwt.sign({ id, email, name, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

/* ---------- image upload ---------- */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
  },
});

app.post("/api/upload", requireAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file received" });
    res.json({ url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` });
  });
});

/* ---------- products ---------- */
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(rows.map(formatProduct));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE slug = ?", [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json(formatProduct(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const productValues = (b) => [
  b.name,
  b.category,
  b.tagline || "",
  b.shortDescription || "",
  b.longDescription || "",
  Number(b.price) || 0,
  b.size || "",
  b.image || "",
  JSON.stringify(b.gallery || []),
  JSON.stringify(b.benefits || []),
  b.howToUse || "",
  b.ingredients || "",
  b.origin?.region || "",
  b.origin?.elevation || "",
  b.accent || "cream",
  b.inStock === false ? 0 : 1,
];

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    if (!b.name || !b.category) return res.status(400).json({ error: "Name and category are required" });
    let slug = slugify(b.slug || b.name);
    const [dupe] = await pool.query("SELECT id FROM products WHERE slug = ?", [slug]);
    if (dupe.length) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    const [r] = await pool.query(
      `INSERT INTO products
      (slug,name,category,tagline,short_description,long_description,price,size,image,gallery,benefits,how_to_use,ingredients,origin_region,origin_elevation,accent,in_stock)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [slug, ...productValues(b)]
    );
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [r.insertId]);
    res.status(201).json(formatProduct(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    await pool.query(
      `UPDATE products SET
      name=?,category=?,tagline=?,short_description=?,long_description=?,price=?,size=?,image=?,gallery=?,benefits=?,how_to_use=?,ingredients=?,origin_region=?,origin_elevation=?,accent=?,in_stock=?
      WHERE id=?`,
      [...productValues(b), req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json(formatProduct(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- orders ---------- */
app.post("/api/orders", async (req, res) => {
  try {
    const b = req.body;
    if (!b.customerName || !Array.isArray(b.items) || b.items.length === 0) {
      return res.status(400).json({ error: "Customer name and at least one item are required" });
    }
    // Recalculate the total on the server so prices cannot be faked
    let total = 0;
    const items = [];
    for (const it of b.items) {
      const [rows] = await pool.query("SELECT id, name, price, image FROM products WHERE id = ?", [it.id]);
      if (!rows[0]) continue;
      const qty = Math.max(1, Number(it.quantity) || 1);
      total += Number(rows[0].price) * qty;
      items.push({
        id: rows[0].id,
        name: rows[0].name,
        price: Number(rows[0].price),
        image: rows[0].image,
        quantity: qty,
      });
    }
    if (items.length === 0) return res.status(400).json({ error: "No valid products in order" });
    const [feeRows] = await pool.query(
      "SELECT setting_value FROM settings WHERE setting_key = 'shippingFee'"
    );
    const shippingFee =
      feeRows[0] && feeRows[0].setting_value !== "" ? Number(feeRows[0].setting_value) : 350;
    total += shippingFee;

    const orderNumber = `DR-${Date.now().toString().slice(-7)}`;
    await pool.query(
      `INSERT INTO orders (order_number,customer_name,email,phone,address,city,items,total,payment_method,notes)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        orderNumber,
        b.customerName,
        b.email || "",
        b.phone || "",
        b.address || "",
        b.city || "",
        JSON.stringify(items),
        total,
        b.paymentMethod || "Cash on Delivery",
        b.notes || "",
      ]
    );
    res.status(201).json({ ok: true, orderNumber, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(rows.map(formatOrder));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- messages (contact form) ---------- */
app.post("/api/messages", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "Name, email and message are required" });
    await pool.query("INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)", [
      name,
      email,
      subject || "",
      message,
    ]);
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        subject: r.subject,
        message: r.message,
        isRead: !!r.is_read,
        createdAt: r.created_at,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/messages/:id/read", requireAdmin, async (req, res) => {
  try {
    await pool.query("UPDATE messages SET is_read = 1 WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/messages/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- dashboard stats ---------- */
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [[rev]] = await pool.query(
      "SELECT COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders FROM orders WHERE status <> 'Cancelled'"
    );
    const [[prod]] = await pool.query("SELECT COUNT(*) AS n FROM products");
    const [[cust]] = await pool.query(
      "SELECT COUNT(DISTINCT email) AS n FROM orders WHERE email <> ''"
    );
    const [[unread]] = await pool.query("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0");
    const [[pending]] = await pool.query("SELECT COUNT(*) AS n FROM orders WHERE status = 'Pending'");

    const [daily] = await pool.query(
      `SELECT DATE(created_at) AS d, COALESCE(SUM(total),0) AS value
       FROM orders
       WHERE status <> 'Cancelled' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)`
    );
    const map = {};
    daily.forEach((r) => {
      map[new Date(r.d).toDateString()] = Number(r.value);
    });
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      weekly.push({
        day: dt.toLocaleDateString("en-US", { weekday: "short" }),
        value: map[dt.toDateString()] || 0,
      });
    }

    const [recent] = await pool.query("SELECT * FROM orders ORDER BY id DESC LIMIT 5");
    res.json({
      revenue: Number(rev.revenue),
      orders: rev.orders,
      products: prod.n,
      customers: cust.n,
      unreadMessages: unread.n,
      pendingOrders: pending.n,
      weekly,
      recentOrders: recent.map(formatOrder),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- customers ---------- */
app.get("/api/admin/customers", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT MAX(customer_name) AS name, MAX(email) AS email, MAX(phone) AS phone,
              MAX(city) AS city, COUNT(*) AS orders,
              COALESCE(SUM(CASE WHEN status <> 'Cancelled' THEN total ELSE 0 END),0) AS spent,
              MAX(created_at) AS last_order
       FROM orders
       GROUP BY COALESCE(NULLIF(email,''), phone, customer_name)
       ORDER BY last_order DESC`
    );
    res.json(
      rows.map((r) => ({
        name: r.name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        orders: r.orders,
        spent: Number(r.spent),
        lastOrder: r.last_order,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- change password ---------- */
app.put("/api/auth/password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!rows[0] || !(await bcrypt.compare(currentPassword || "", rows[0].password_hash))) {
      return res.status(400).json({ error: "Current password is wrong" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- store settings ---------- */
const settingKeys = ["storeName", "email", "phone", "whatsapp", "address", "shippingFee"];

app.get("/api/settings", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
    const out = {};
    rows.forEach((r) => (out[r.setting_key] = r.setting_value));
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/settings", requireAdmin, async (req, res) => {
  try {
    for (const k of settingKeys) {
      if (req.body[k] === undefined) continue;
      await pool.query(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [k, String(req.body[k])]
      );
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- health ---------- */
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS products FROM products");
    res.json({ ok: true, database: "connected", products: rows[0].products });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));