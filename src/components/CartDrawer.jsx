import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { products } from "@/lib/products";
import { Image } from "@/components/ui/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const lineItems = items.map((i) => ({ ...i, ...products.find((p) => p.id === i.id) }));
  const firstItem = lineItems[0];
  const upsell = firstItem
    ? products.find((p) => p.id !== firstItem.id && p.category !== firstItem.category)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-background/90 backdrop-blur-2xl border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-[12px] uppercase tracking-[0.2em] font-semibold">
                Your Ritual
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 hover:text-accent">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lineItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="font-display text-2xl italic text-muted-foreground">
                    Your vessel is empty.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="mt-6 text-[12px] uppercase tracking-[0.15em] font-semibold text-accent hover:text-foreground"
                  >
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {lineItems.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <Link to={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-20 object-cover"
                          fittingType="fill"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-lg leading-tight hover:text-accent transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                          {item.size}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:text-accent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:text-accent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-medium">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {upsell && lineItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Complete the ritual
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={upsell.image}
                      alt={upsell.name}
                      className="h-14 w-12 object-cover"
                      fittingType="fill"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base leading-tight">{upsell.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        Rs {upsell.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to={`/product/${upsell.slug}`}
                      onClick={closeCart}
                      className="text-[11px] uppercase tracking-[0.1em] font-semibold text-accent hover:text-foreground"
                    >
                      Add
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {lineItems.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl">
                    Rs {subtotal.toLocaleString()}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="group flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-foreground transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}