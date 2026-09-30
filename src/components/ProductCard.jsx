import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => addItem(product, 1), 250);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: "easeOut" } }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-white">
        <div className="relative aspect-square overflow-hidden bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-foreground/70 bg-background/70 backdrop-blur px-2.5 py-1">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h2 className="font-display text-2xl leading-tight hover:text-accent transition-colors">
              {product.name}
            </h2>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground max-w-[28ch]">
            {product.shortDescription}
          </p>
        </div>
        <span className="font-display text-xl whitespace-nowrap">
          Rs {product.price.toLocaleString()}
        </span>
      </div>
      <button
        onClick={handleAdd}
        disabled={adding}
        className="mt-4 relative pb-1 text-[12px] uppercase tracking-[0.2em] font-semibold text-foreground group/btn"
      >
        <span className="relative z-10">{adding ? "Added" : "Add to Cart"}</span>
        <span className="absolute left-0 bottom-0 h-px bg-accent transition-all duration-500 w-0 group-hover/btn:w-full" />
        {adding && <span className="absolute left-0 bottom-0 h-px bg-foreground w-full" />}
      </button>
    </motion.article>
  );
}