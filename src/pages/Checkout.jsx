import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";

const field =
  "w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent";

export default function Checkout() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const [payment, setPayment] = useState("cod");
  const [placed, setPlaced] = useState(null); // holds the order number
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [shippingFee, setShippingFee] = useState(350);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    postal: "",
    country: "",
  });

  useEffect(() => {
    api("/api/settings")
      .then((s) => {
        if (s.shippingFee !== undefined && s.shippingFee !== "") {
          setShippingFee(Number(s.shippingFee));
        }
      })
      .catch(() => {});
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = subtotal > 0 ? shippingFee : 0;
  const total = subtotal + shipping;

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const address = [form.address1, form.address2, form.postal, form.country]
        .filter(Boolean)
        .join(", ");
      const res = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          address,
          city: form.city,
          paymentMethod: payment === "cod" ? "Cash on Delivery" : "Card",
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      clear();
      setPlaced(res.orderNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (placed) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="mx-auto max-w-xl px-5">
          <ShieldCheck className="h-12 w-12 text-accent mx-auto" />
          <h1 className="mt-6 font-display font-light text-5xl md:text-6xl">
            Your ritual is confirmed.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Thank you. We've received your order and will contact you shortly.
          </p>
          <p className="mt-4 font-display text-2xl">Order number: {placed}</p>
          <Link
            to="/shop"
            className="mt-10 inline-block px-8 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-foreground transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="font-display text-3xl italic text-muted-foreground">
          Your vessel is empty.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.2em] font-semibold text-accent"
        >
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <h1 className="font-display font-light text-5xl md:text-6xl mb-12">Checkout</h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-5">
                Contact
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <input required placeholder="Full name" value={form.name} onChange={update("name")} className={field} />
                <input required type="tel" placeholder="Phone number" value={form.phone} onChange={update("phone")} className={field} />
                <input required type="email" placeholder="Email address" value={form.email} onChange={update("email")} className={`${field} sm:col-span-2`} />
              </div>
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-5">
                Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <input required placeholder="Address line 1" value={form.address1} onChange={update("address1")} className={`${field} sm:col-span-2`} />
                <input placeholder="Address line 2 (optional)" value={form.address2} onChange={update("address2")} className={`${field} sm:col-span-2`} />
                <input required placeholder="City" value={form.city} onChange={update("city")} className={field} />
                <input required placeholder="Postal code" value={form.postal} onChange={update("postal")} className={field} />
                <input required placeholder="Country" value={form.country} onChange={update("country")} className={`${field} sm:col-span-2`} />
              </div>
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-5">
                Payment Method
              </h2>
              <label className="flex items-center gap-3 border border-accent p-4 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="accent-[hsl(var(--accent))]"
                />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-border p-6 md:p-8 sticky top-28">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-5">
                Order Summary
              </h2>
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <Image src={item.image} alt={item.name} className="h-20 w-16 object-cover" fittingType="fill" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg leading-tight">{item.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:text-accent" aria-label="Decrease">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:text-accent" aria-label="Increase">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="mt-1 text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:text-destructive">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Rs {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-display text-2xl">
                  <span>Total</span>
                  <span>Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full mt-6 bg-primary text-primary-foreground py-4 text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-foreground transition-colors disabled:opacity-60"
              >
                {sending ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}