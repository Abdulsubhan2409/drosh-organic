import bcrypt from "bcryptjs";
import pool from "./db.js";

const products = [
  {
    slug: "pure-saffron",
    name: "Pure Saffron",
    category: "Wellness",
    tagline: "100% Original & Organic Product",
    short_description:
      "Hand-harvested saffron threads, sun-dried to preserve every strand of aroma and color.",
    long_description:
      "Our saffron is gathered at dawn from the high valleys, where the thin mountain air and cold nights concentrate the crocin and safranal that give each thread its deep crimson hue and honeyed, hay-warm fragrance. Every stigma is hand-plucked, sun-dried within hours, and sealed in amber glass to guard its potency. A pinch dissolved in warm milk or water releases a golden tide of aroma — a daily ritual for mood, glow, and quiet vitality.",
    price: 4200,
    size: "1g — Glass Jar",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ae7c7b184_generated_cb06b901.jpg",
    gallery: [
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ae7c7b184_generated_cb06b901.jpg",
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1d2ee440c_generated_3ddb8f5f.jpg",
    ],
    benefits: [
      "Supports mood balance and emotional calm",
      "Promotes a natural, luminous skin glow",
      "Rich in antioxidants that protect against oxidative stress",
      "Aids digestion and restful sleep",
    ],
    how_to_use:
      "Steep 3–4 threads in warm milk or water for 5 minutes until the liquid turns golden. Sweeten with honey if desired. Enjoy morning or evening as a ritual.",
    ingredients: "100% pure Crocus sativus stigma threads. Nothing added, nothing removed.",
    origin_region: "Pampore Valley, Kashmir",
    origin_elevation: "1,600m",
    accent: "amber",
  },
  {
    slug: "himalayan-shilajit-resin",
    name: "Pure Himalayan Shilajit Resin",
    category: "Wellness",
    tagline: "Wild-Harvested & Potent Ancient Superfood",
    short_description:
      "Nature's ultimate source of fulvic acid and 84+ minerals, harvested from high-altitude rock faces.",
    long_description:
      "Formed over centuries from decomposed plant matter compressed within the cracks of Himalayan rock, our shilajit is wild-harvested by hand at altitude, then gently purified with spring water — never heat-extracted, never standardized with fillers. The result is a sticky, tar-dark resin with a smoky, earthy mineral scent. A rice-grain-sized portion dissolves slowly in warm water or milk, delivering a dense payload of fulvic acid and trace minerals the body recognizes as its own.",
    price: 5800,
    size: "30g — Premium Jar",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/60b2fc987_generated_506390f2.jpg",
    gallery: [
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/60b2fc987_generated_506390f2.jpg",
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/64fe5eaa4_generated_6c4971cb.jpg",
    ],
    benefits: [
      "Naturally rich in fulvic acid and 84+ trace minerals",
      "Supports sustained energy and stamina",
      "Aids nutrient absorption and cellular function",
      "Adaptogenic — helps the body manage stress",
    ],
    how_to_use:
      "Dissolve a rice-grain-sized amount (approx. 300mg) in a glass of warm water or milk. Stir until fully dispersed. Take once daily, ideally in the morning.",
    ingredients: "Wild-harvested Himalayan shilajit resin. Purified with spring water. No additives.",
    origin_region: "Gilgit-Baltistan, Himalaya",
    origin_elevation: "3,000m+",
    accent: "obsidian",
  },
  {
    slug: "apricot-kernel-oil",
    name: "Pure & Nourishing Apricot Kernel Oil",
    category: "Skincare",
    tagline: "Cold-Pressed & Unrefined Elixir for Radiant Skin & Hair",
    short_description:
      "Cold-pressed from wild apricot kernels — a featherlight oil that sinks in to soften and revive.",
    long_description:
      "Pressed slowly from the kernels of wild mountain apricots, this golden oil carries vitamins A and E alongside oleic and linoleic acids. Cold-pressing preserves the delicate aroma and nutrient profile that heat refining would destroy. Featherlight and fast-absorbing, it leaves no greasy residue — only a quiet, dewy softness. A few drops on damp skin or hair ends restore suppleness and a faint, nutty warmth.",
    price: 2400,
    size: "30ml — Dropper Bottle",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ad368109e_generated_078a3064.jpg",
    gallery: [
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ad368109e_generated_078a3064.jpg",
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/def5491fb_generated_83d351ad.jpg",
    ],
    benefits: [
      "Deeply moisturizes without a greasy finish",
      "Rich in vitamins A & E for skin repair",
      "Softens hair and adds a healthy sheen",
      "Suitable for sensitive and mature skin",
    ],
    how_to_use:
      "Apply 3–4 drops to cleansed, damp skin and press gently until absorbed. For hair, work a few drops into the lengths and ends. Use morning and night.",
    ingredients: "100% cold-pressed, unrefined Prunus armeniaca (apricot) kernel oil.",
    origin_region: "Hunza Valley, Karakoram",
    origin_elevation: "2,400m",
    accent: "forest",
  },
  {
    slug: "lavi-perfume",
    name: "LAVI Perfume",
    category: "Fragrance",
    tagline: "A Minimalist Signature Scent",
    short_description:
      "A clean, modern fragrance built on quiet woods and soft white florals — understated, lasting, yours.",
    long_description:
      "LAVI is a study in restraint. A bright opening settles into a heart of soft white florals over a base of pale woods and warm skin musk. Composed to wear close — a personal aura rather than a statement — it lingers through the day without shouting. The bottle is a clear square of glass with a matte black cap and a clean label: nothing extra, nothing wasted.",
    price: 3600,
    size: "30ml — Glass Bottle",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1e41d4f69_generated_993490b6.jpg",
    gallery: [
      "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1e41d4f69_generated_993490b6.jpg",
    ],
    benefits: [
      "Long-lasting, skin-close sillage",
      "Clean, modern, unisex composition",
      "Layer-friendly with other ritual products",
      "Minimalist, refillable glass vessel",
    ],
    how_to_use:
      "Spritz onto pulse points — wrists, neck, behind the ears — from a distance of 15cm. Reapply as desired through the day.",
    ingredients: "Alcohol denat., fragrance (parfum), aqua. Free from parabens and phthalates.",
    origin_region: "Composed in-house",
    origin_elevation: "—",
    accent: "cream",
  },
];

// Change these two lines to your own admin login
const ADMIN_EMAIL = "admin@drosh.com";
const ADMIN_PASSWORD = "Admin@12345";

async function run() {
  const [existing] = await pool.query("SELECT COUNT(*) AS n FROM products");
  if (existing[0].n === 0) {
    for (const p of products) {
      await pool.query(
        `INSERT INTO products
        (slug,name,category,tagline,short_description,long_description,price,size,image,gallery,benefits,how_to_use,ingredients,origin_region,origin_elevation,accent)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          p.slug, p.name, p.category, p.tagline, p.short_description, p.long_description,
          p.price, p.size, p.image, JSON.stringify(p.gallery), JSON.stringify(p.benefits),
          p.how_to_use, p.ingredients, p.origin_region, p.origin_elevation, p.accent,
        ]
      );
    }
    console.log(`Imported ${products.length} products`);
  } else {
    console.log("Products already exist, skipped");
  }

  const [admins] = await pool.query("SELECT id FROM users WHERE email = ?", [ADMIN_EMAIL]);
  if (admins.length === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?, 'admin')",
      ["Admin", ADMIN_EMAIL, hash]
    );
    console.log(`Admin created: ${ADMIN_EMAIL}`);
  } else {
    console.log("Admin already exists, skipped");
  }

  process.exit(0);
}

run().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});