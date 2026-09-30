import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/lib/CartContext";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
    const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

    if (loading) {
    return <div className="pt-32 pb-24 text-center text-muted-foreground">Loading…</div>;
  }
  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-display text-3xl italic text-muted-foreground">
          That artifact could not be found.
        </p>
        <Link to="/shop" className="mt-6 inline-block text-[12px] uppercase tracking-[0.2em] font-semibold text-accent">
          Return to the Shop
        </Link>
      </div>
    );
  }

   const related = products.filter((p) => p.slug !== slug);
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  return (
    <div className="pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-6">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Split layout */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid md:grid-cols-12 gap-8 md:gap-16">
          {/* Gallery */}
          <div className="md:col-span-7 md:sticky md:top-28 md:self-start">
            <div className="aspect-[4/5] overflow-hidden bg-secondary">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <Image
                  src={gallery[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                  fittingType="fill"
                />
              </motion.div>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-24 w-20 overflow-hidden border transition-colors ${
                      activeImage === i ? "border-accent" : "border-border"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={g} alt="" className="h-full w-full object-cover" fittingType="fill" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground italic">
              Swap with video — 360° spin & texture loop
            </p>
          </div>

          {/* Info */}
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
              {product.category}
            </p>
            <h1 className="font-display font-light text-4xl md:text-6xl leading-[0.95]">
              {product.name}
            </h1>
            <p className="mt-3 font-display italic text-xl text-muted-foreground">
              {product.tagline}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">
              {product.shortDescription}
            </p>

            {/* Provenance map */}
            <div className="mt-8 border border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-accent mb-3">
                <MapPin className="h-4 w-4" />
                Provenance
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="font-display text-2xl">{product.origin.region}</p>
                  {product.origin.elevation !== "—" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Harvested at {product.origin.elevation}
                    </p>
                  )}
                </div>
                <svg viewBox="0 0 120 60" className="h-12 w-24 opacity-40" fill="none" aria-hidden="true">
                  <path d="M0 50 L20 30 L35 40 L55 15 L70 28 L90 10 L120 35" stroke="hsl(var(--accent))" strokeWidth="1" />
                  <path d="M0 50 L20 30 L35 40 L55 15 L70 28 L90 10 L120 35 L120 60 L0 60 Z" fill="hsl(var(--primary))" opacity="0.15" />
                </svg>
              </div>
            </div>

            {/* Price + qty */}
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {product.size}
                </p>
                <p className="font-display text-4xl mt-1">
                  Rs {product.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-accent"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-lg tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 hover:text-accent"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => addItem(product, qty)}
              className="group mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-foreground transition-colors"
            >
              Add to Cart — Rs {(product.price * qty).toLocaleString()}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Long description */}
            <div className="mt-12 space-y-8">
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-accent">
                  The Story
                </h2>
                <p className="leading-relaxed text-foreground/80">{product.longDescription}</p>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-accent">
                  Key Benefits
                </h2>
                <ul className="space-y-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-foreground/80">
                      <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-accent">
                  How to Use
                </h2>
                <p className="leading-relaxed text-foreground/80">{product.howToUse}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground italic">
                  Micro-animation — swap with ritual clip
                </p>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-accent">
                  Ingredients
                </h2>
                <p className="leading-relaxed text-foreground/80">{product.ingredients}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <h2 className="font-display font-light text-4xl md:text-5xl mb-12">
              Complete the ritual.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}