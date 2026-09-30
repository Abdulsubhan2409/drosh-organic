import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { categories } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(searchParams.get("cat") || "All");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setActive(searchParams.get("cat") || "All");
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = active === "All" || p.category === active;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
    }, [active, query, products]);

  const setCat = (c) => {
    setActive(c);
    const next = new URLSearchParams(searchParams);
    if (c === "All") next.delete("cat");
    else next.set("cat", c);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              The Apothecary
            </p>
            <h1 className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-balance">
              Every jar, a mountain in miniature.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-[12px] uppercase tracking-[0.12em] font-medium transition-colors ${
                  active === c
                    ? "text-foreground border-b border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border-b border-border md:w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                    {loading ? (
            <p className="text-center py-24 text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center font-display text-2xl italic text-muted-foreground py-24">
              Nothing matches that search — try another thread.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}