import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Logo from "./Logo";
import { products } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-10 grain">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Logo variant="light" />
            <p className="mt-6 max-w-sm font-display text-2xl italic leading-snug text-background/80">
              Where Nature Meets Aesthetics.
            </p>
            <p className="mt-4 text-sm text-background/55 max-w-sm leading-relaxed">
              Wild-harvested, purity-first wellness & beauty from the high
              valleys. Crafted in small batches, honored in ritual.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="text-background/60 hover:text-accent transition-colors"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[12px] uppercase tracking-[0.15em] font-semibold text-accent mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-sm text-background/70 hover:text-background transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[12px] uppercase tracking-[0.15em] font-semibold text-accent mb-5">
              House
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-background/70 hover:text-background transition-colors">Our Story</Link></li>
              <li><Link to="/ingredients" className="text-sm text-background/70 hover:text-background transition-colors">Ingredients & Sourcing</Link></li>
              <li><Link to="/contact" className="text-sm text-background/70 hover:text-background transition-colors">Contact</Link></li>
              <li><a href="#" className="text-sm text-background/70 hover:text-background transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm text-background/70 hover:text-background transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-background/15 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-background/45">
          <p>© {new Date().getFullYear()} Drosh Organic. All rights reserved.</p>
          <p className="tracking-[0.1em] uppercase">Hand-harvested · Cold-pressed · Unrefined</p>
        </div>
      </div>
    </footer>
  );
}