export const products = [
  {
    id: "pure-saffron",
    slug: "pure-saffron",
    name: "Pure Saffron",
    category: "Wellness",
    tagline: "100% Original & Organic Product",
    shortDescription:
      "Hand-harvested saffron threads, sun-dried to preserve every strand of aroma and color.",
    longDescription:
      "Our saffron is gathered at dawn from the high valleys, where the thin mountain air and cold nights concentrate the crocin and safranal that give each thread its deep crimson hue and honeyed, hay-warm fragrance. Every stigma is hand-plucked, sun-dried within hours, and sealed in amber glass to guard its potency. A pinch dissolved in warm milk or water releases a golden tide of aroma — a daily ritual for mood, glow, and quiet vitality.",
    price: 4200,
    size: "1g — Glass Jar",
    image: "/images/products/pure-saffron.jpeg",
    gallery: [
      "/images/products/pure-saffron.jpeg"
    ],
    benefits: [
      "Supports mood balance and emotional calm",
      "Promotes a natural, luminous skin glow",
      "Rich in antioxidants that protect against oxidative stress",
      "Aids digestion and restful sleep"
    ],
    howToUse:
      "Steep 3–4 threads in warm milk or water for 5 minutes until the liquid turns golden. Sweeten with honey if desired. Enjoy morning or evening as a ritual.",
    ingredients: "100% pure Crocus sativus stigma threads. Nothing added, nothing removed.",
    origin: {
      region: "Pampore Valley, Kashmir",
      elevation: "1,600m"
    },
    accent: "amber"
  },
  {
    id: "himalayan-shilajit-resin",
    slug: "himalayan-shilajit-resin",
    name: "Pure Himalayan Shilajit Resin",
    category: "Wellness",
    tagline: "Wild-Harvested & Potent Ancient Superfood",
    shortDescription:
      "Nature's ultimate source of fulvic acid and 84+ minerals, harvested from high-altitude rock faces.",
    longDescription:
      "Formed over centuries from decomposed plant matter compressed within the cracks of Himalayan rock, our shilajit is wild-harvested by hand at altitude, then gently purified with spring water — never heat-extracted, never standardized with fillers. The result is a sticky, tar-dark resin with a smoky, earthy mineral scent. A rice-grain-sized portion dissolves slowly in warm water or milk, delivering a dense payload of fulvic acid and trace minerals the body recognizes as its own.",
    price: 5800,
    size: "30g — Premium Jar",
    image: "/images/products/shilajit-resin.jpeg",
    gallery: [
      "/images/products/shilajit-resin.jpeg"
    ],
    benefits: [
      "Naturally rich in fulvic acid and 84+ trace minerals",
      "Supports sustained energy and stamina",
      "Aids nutrient absorption and cellular function",
      "Adaptogenic — helps the body manage stress"
    ],
    howToUse:
      "Dissolve a rice-grain-sized amount (approx. 300mg) in a glass of warm water or milk. Stir until fully dispersed. Take once daily, ideally in the morning.",
    ingredients: "Wild-harvested Himalayan shilajit resin. Purified with spring water. No additives.",
    origin: {
      region: "Gilgit-Baltistan, Himalaya",
      elevation: "3,000m+"
    },
    accent: "obsidian"
  },
  {
    id: "apricot-kernel-oil",
    slug: "apricot-kernel-oil",
    name: "Pure & Nourishing Apricot Kernel Oil",
    category: "Skincare",
    tagline: "Cold-Pressed & Unrefined Elixir for Radiant Skin & Hair",
    shortDescription:
      "Cold-pressed from wild apricot kernels — a featherlight oil that sinks in to soften and revive.",
    longDescription:
      "Pressed slowly from the kernels of wild mountain apricots, this golden oil carries vitamins A and E alongside oleic and linoleic acids. Cold-pressing preserves the delicate aroma and nutrient profile that heat refining would destroy. Featherlight and fast-absorbing, it leaves no greasy residue — only a quiet, dewy softness. A few drops on damp skin or hair ends restore suppleness and a faint, nutty warmth.",
    price: 2400,
    size: "30ml — Dropper Bottle",
    image: "/images/products/apricot-kernel-oil.jpeg",
    gallery: [
      "/images/products/apricot-kernel-oil.jpeg"
    ],
    benefits: [
      "Deeply moisturizes without a greasy finish",
      "Rich in vitamins A & E for skin repair",
      "Softens hair and adds a healthy sheen",
      "Suitable for sensitive and mature skin"
    ],
    howToUse:
      "Apply 3–4 drops to cleansed, damp skin and press gently until absorbed. For hair, work a few drops into the lengths and ends. Use morning and night.",
    ingredients: "100% cold-pressed, unrefined Prunus armeniaca (apricot) kernel oil.",
    origin: {
      region: "Hunza Valley, Karakoram",
      elevation: "2,400m"
    },
    accent: "forest"
  },
  {
    id: "lavi-perfume",
    slug: "lavi-perfume",
    name: "LAVI Perfume",
    category: "Fragrance",
    tagline: "A Minimalist Signature Scent",
    shortDescription:
      "A clean, modern fragrance built on quiet woods and soft white florals — understated, lasting, yours.",
    longDescription:
      "LAVI is a study in restraint. A bright opening settles into a heart of soft white florals over a base of pale woods and warm skin musk. Composed to wear close — a personal aura rather than a statement — it lingers through the day without shouting. The bottle is a clear square of glass with a matte black cap and a clean label: nothing extra, nothing wasted.",
    price: 3600,
    size: "30ml — Glass Bottle",
    image: "/images/products/lavi-perfume.jpeg",
    gallery: [
      "/images/products/lavi-perfume.jpeg"
    ],
    benefits: [
      "Long-lasting, skin-close sillage",
      "Clean, modern, unisex composition",
      "Layer-friendly with other ritual products",
      "Minimalist, refillable glass vessel"
    ],
    howToUse:
      "Spritz onto pulse points — wrists, neck, behind the ears — from a distance of 15cm. Reapply as desired through the day.",
    ingredients: "Alcohol denat., fragrance (parfum), aqua. Free from parabens and phthalates.",
    origin: {
      region: "Composed in-house",
      elevation: "—"
    },
    accent: "cream"
  }
];

export const categories = ["All", "Skincare", "Wellness", "Fragrance"];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug) {
  return products.filter((p) => p.slug !== slug);
}