import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              Our Story
            </p>
            <h1 className="font-display font-light text-5xl md:text-8xl leading-[0.92] text-balance">
              From the valley, with patience.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="relative">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://media.base44.com/images/public/6aa392bd7a517137ca6165de/2984acb42_generated_2b8ac384.jpg"
          className="w-full aspect-[21/9] object-cover"
          aria-label="Himalayan mountain landscape at dawn"
        >
          <source src="/videos/ourstory.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display font-light text-4xl md:text-5xl leading-tight">
                The origin
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <Reveal>
              <p>
                Drosh Organic was born among the high valleys of the Himalaya — a
                place where the air is thin, the nights are long, and the land
                gives only to those who wait. Our name carries the weight of that
                landscape: heavy, ancient, and quietly powerful.
              </p>
              <p className="mt-5">
                We work directly with harvesters who have tended these slopes for
                generations. Saffron is plucked stigma by stigma at first light.
                Shilajit is scraped from sun-warmed rock faces. Apricot kernels
                are pressed slowly, in small batches, so the oil keeps its golden
                warmth.
              </p>
              <p className="mt-5">
                What we sell is what the mountain made — nothing more, nothing
                less. We believe purity is not a claim but a texture you can feel,
                a scent you can trace, and a ritual that earns its place in your
                day.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-secondary/40 grain">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal>
            <Image
              src="https://media.base44.com/images/public/6aa392bd7a517137ca6165de/898e78fb2_generated_b5076ce2.jpg"
              alt="Hands holding raw apricot kernels"
              className="w-full aspect-[4/5] object-cover"
              fittingType="fill"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              The Philosophy
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl leading-tight">
              Tradition meets modern skincare science.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We pair ancestral harvesting with low-heat purification, cold-pressing,
              and rigorous testing. Every batch is small, traceable, and handled with
              the same care the mountain demands. The result is a collection that feels
              as honest as the hands that made it.
            </p>
            <Link
              to="/ingredients"
              className="group inline-flex items-center gap-2 mt-8 text-[12px] uppercase tracking-[0.2em] font-semibold"
            >
              Explore Our Ingredients
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}