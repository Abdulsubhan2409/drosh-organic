import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Leaf, Mountain, Droplet, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useProducts } from "@/hooks/useProducts";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import AnimatedLine from "@/components/AnimatedLine";

const trustBadges = [
  { icon: Leaf, label: "100% Original & Organic" },
  { icon: Mountain, label: "Wild-Harvested" },
  { icon: Droplet, label: "Cold-Pressed & Unrefined" },
  { icon: Sparkles, label: "Nature's Ultimate Superfood" }
];

const testimonials = [
  {
    quote:
      "The saffron is unlike anything I've bought before — a single pinch turns my morning milk into a golden ritual. You can taste the altitude.",
    name: "Ayesha R.",
    role: "Lahore"
  },
  {
    quote:
      "I bought the shilajit skeptical and stayed for the stamina. The texture video sold me — you can tell it's the real, uncut thing.",
    name: "Daniel K.",
    role: "London"
  },
  {
    quote:
      "Apricot oil replaced three products in my routine. It sinks in instantly and my skin has never looked this calm.",
    name: "Mira S.",
    role: "Dubai"
  }
];

const ingredientSpotlight = [
  {
    name: "Saffron",
    benefit: "Hand-picked stigmas, sun-dried to lock in aroma, color and calm.",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1d2ee440c_generated_3ddb8f5f.jpg"
  },
  {
    name: "Shilajit",
    benefit: "A sticky, mineral-dense resin purified from Himalayan rock.",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/64fe5eaa4_generated_6c4971cb.jpg"
  },
  {
    name: "Apricot Kernel",
    benefit: "Cold-pressed from wild kernels into a featherlight golden elixir.",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/def5491fb_generated_83d351ad.jpg"
  }
];

const ugcImages = [
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1d2ee440c_generated_3ddb8f5f.jpg",
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ad368109e_generated_078a3064.jpg",
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/64fe5eaa4_generated_6c4971cb.jpg",
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1e41d4f69_generated_993490b6.jpg",
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/ae7c7b184_generated_cb06b901.jpg",
  "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/def5491fb_generated_83d351ad.jpg"
];

export default function Home() {
    const { products } = useProducts();
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 180]);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] w-full flex items-center justify-center">
        <motion.div className="absolute inset-0 -top-[10%] h-[120%]" style={{ y: heroY }}>
          <video
            src="https://media.base44.com/videos/public/6aa392bd7a517137ca6165de/a7c0a8afa_WhatsAppVideo2026-09-11at105558AM.mp4"
            poster="https://media.base44.com/images/public/6aa392bd7a517137ca6165de/2984acb42_generated_2b8ac384.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
        </motion.div>

        <div className="relative z-10 text-center px-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-white/80 mb-6"
          >
            Wild-Harvested Apothecary
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="font-display font-light text-white text-[18vw] md:text-[12rem] leading-[0.85] tracking-tight"
          >
            DROSH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 font-display italic text-xl md:text-2xl text-white/90"
          >
            Where Nature Meets Aesthetics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/product/pure-saffron"
              className="group inline-flex items-center gap-2 bg-white text-foreground px-8 py-4 text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-accent transition-colors"
            >
              Shop Pure Saffron
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-white px-8 py-4 text-[12px] uppercase tracking-[0.2em] font-semibold border border-white/40 hover:bg-white/10 transition-colors"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Descend</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="block h-8 w-px bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-foreground text-background py-5 overflow-hidden border-y border-accent/20">
        <Marquee items={["Wild-Harvested", "Cold-Pressed", "Unrefined", "Purity-First", "Small-Batch", "Himalayan Origin"]} />
      </div>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {trustBadges.map((b, i) => (
              <div key={i} className="flex items-center justify-center gap-3 py-6 px-4">
                <b.icon className="h-5 w-5 text-accent shrink-0" />
                <span className="text-[11px] md:text-[12px] uppercase tracking-[0.12em] font-medium text-foreground/80 text-center">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              The Collection
            </p>
            <h2 className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-balance">
              Four artifacts from the high valleys.
            </h2>
          </Reveal>

          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* GOLDEN THREAD DIVIDER */}
      <AnimatedLine className="h-px w-full opacity-80" />

      {/* OUR STORY */}
      <section className="py-24 md:py-40 bg-secondary/40 grain">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-7 order-2 md:order-1">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
                  Our Story
                </p>
                <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05] text-balance">
                  Born of rock, sun, and patient hands.
                </h2>
                <div className="mt-8 space-y-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
                  <p>
                    Drosh began in the valleys — where the air thins, the nights
                    bite, and the land gives slowly. Every saffron thread is
                    plucked at dawn. Every jar of shilajit is scraped from stone
                    by hands that know the mountain.
                  </p>
                  <p>
                    We pair that ancient patience with modern skincare science —
                    cold-pressing, low-heat purification, and small batches that
                    honor what the earth spent centuries making. Nothing rushed,
                    nothing added, nothing stripped away.
                  </p>
                </div>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 mt-10 text-[12px] uppercase tracking-[0.2em] font-semibold"
                >
                  Read the Full Story
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Reveal>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <Reveal delay={0.15}>
                <div className="relative overflow-hidden aspect-[4/5] bg-secondary">
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
                  >
                    <Image
                      src="https://media.base44.com/images/public/6aa392bd7a517137ca6165de/898e78fb2_generated_b5076ce2.jpg"
                      alt="Weathered hands holding raw apricot kernels in mountain light"
                      className="h-full w-full object-cover"
                      fittingType="fill"
                    />
                  </motion.div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENT SPOTLIGHT */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              Ingredient Spotlight
            </p>
            <h2 className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-balance">
              The texture tells the truth.
            </h2>
          </Reveal>

          <div className="mt-16 md:mt-24 grid md:grid-cols-3 gap-8 md:gap-12">
            {ingredientSpotlight.map((ing, i) => (
              <Reveal key={ing.name} delay={i * 0.1}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Image
                      src={ing.image}
                      alt={`Macro detail of ${ing.name}`}
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                      fittingType="fill"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-3xl">{ing.name}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{ing.benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatedLine className="h-px w-full opacity-60" />

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-foreground text-background grain">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4 text-center">
              Voices from the Ritual
            </p>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="flex flex-col h-full">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="font-display text-2xl italic leading-snug text-background/90 flex-1">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-[12px] uppercase tracking-[0.15em] text-background/55">
                    {t.name} — {t.role}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UGC / INSTAGRAM STRIP */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
              @droshorganic
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl">
              Rituals in the wild.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {ugcImages.map((src, i) => (
              <a
                key={i}
                href="#"
                aria-label="View on Instagram"
                className="relative aspect-square overflow-hidden bg-secondary group"
              >
                <Image
                  src={src}
                  alt="Drosh Organic lifestyle"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  fittingType="fill"
                />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}