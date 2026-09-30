import React, { useState } from "react";
import { Mail, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";

const faqs = [
  {
    q: "How fast do you ship?",
    a: "Orders within Pakistan ship in 2–4 business days. International orders take 7–14 days depending on customs.",
  },
  {
    q: "Are your products lab-tested?",
    a: "Yes — every batch of saffron and shilajit is tested for purity before it leaves the studio.",
  },
  {
    q: "Can I visit the studio?",
    a: "We're a small team in Hunza Valley, not a storefront — but write to us and we'll do our best to arrange a visit.",
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await api("/api/messages", { method: "POST", body: JSON.stringify(form) });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              Contact
            </p>
            <h1 className="font-display font-light text-5xl md:text-8xl leading-[0.92] text-balance">
              Say hello to the valley.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Questions about a product, an order, or a ritual? We answer every
              message ourselves — usually within a day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-secondary/40 grain py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5 space-y-10">
            <Reveal className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@droshorganic.com" },
                { icon: Phone, label: "Phone", value: "+92 300 0000000" },
                { icon: MapPin, label: "Studio", value: "Hunza Valley, Gilgit-Baltistan" },
                { icon: Clock, label: "Hours", value: "Mon – Sat, 10am – 6pm PKT" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <c.icon className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="font-display text-2xl mt-1">{c.value}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="pt-8 border-t border-border">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Follow along
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Drosh Organic on Instagram"
                    className="flex h-10 w-10 items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Drosh Organic on Facebook"
                    className="flex h-10 w-10 items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.15}>
              {sent ? (
                <div className="border border-border p-12 text-center bg-background">
                  <p className="font-display text-3xl italic">
                    Thank you — your message is on its way up the mountain.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6 bg-background p-8 md:p-10 border border-border">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={update("name")}
                        className="w-full bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        className="w-full bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={update("message")}
                      className="w-full bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-accent resize-none"
                    />
                  </div>
                                    {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-8 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-foreground transition-colors disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <p className="text-sm text-muted-foreground pt-2">
                    We reply within one business day, Monday through Saturday.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display font-light text-4xl md:text-5xl leading-tight">
                Before you write
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                A few answers we give most often — in case yours is already here.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 divide-y divide-border">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.08}>
                <div className="py-6">
                  <p className="font-display text-2xl">{f.q}</p>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}