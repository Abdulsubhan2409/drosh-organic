import React from "react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/Reveal";

const ingredients = [
  {
    name: "Saffron",
    latin: "Crocus sativus",
    origin: "Pampore Valley, Kashmir — 1,600m",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/1d2ee440c_generated_3ddb8f5f.jpg",
    text: "Each flower yields just three crimson stigmas. They are hand-plucked at dawn and sun-dried within hours to preserve the crocin and safranal responsible for saffron's color, aroma, and mood-lifting character."
  },
  {
    name: "Shilajit",
    latin: "Mineral resin",
    origin: "Gilgit-Baltistan, Himalaya — 3,000m+",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/64fe5eaa4_generated_6c4971cb.jpg",
    text: "Formed over centuries from compressed plant matter within Himalayan rock. We wild-harvest by hand and purify gently with spring water — never heat-extracted, never standardized with fillers."
  },
  {
    name: "Apricot Kernel Oil",
    latin: "Prunus armeniaca",
    origin: "Hunza Valley, Karakoram — 2,400m",
    image: "https://media.base44.com/images/public/6aa392bd7a517137ca6165de/def5491fb_generated_83d351ad.jpg",
    text: "Cold-pressed from wild apricot kernels to preserve vitamins A and E alongside oleic and linoleic acids. Featherlight and fast-absorbing, it carries a faint, nutty warmth."
  }
];

export default function Ingredients() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
              Ingredients & Sourcing
            </p>
            <h1 className="font-display font-light text-5xl md:text-8xl leading-[0.92] text-balance">
              Traced from rock to ritual.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Every ingredient carries a place and a pair of hands. Here is where
              each one begins — and why it matters.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 space-y-24 md:space-y-40">
          {ingredients.map((ing, i) => (
            <div
              key={ing.name}
              className={`grid md:grid-cols-12 gap-8 md:gap-16 items-center ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <Reveal className={`md:col-span-6 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <Image
                    src={ing.image}
                    alt={`Macro detail of ${ing.name}`}
                    className="h-full w-full object-cover"
                    fittingType="fill"
                  />
                </div>
              </Reveal>
              <Reveal
                delay={0.15}
                className={`md:col-span-6 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">
                  {ing.origin}
                </p>
                <h2 className="font-display font-light text-4xl md:text-6xl leading-tight">
                  {ing.name}
                </h2>
                <p className="mt-2 font-display italic text-xl text-muted-foreground">
                  {ing.latin}
                </p>
                <p className="mt-6 text-lg text-foreground/80 leading-relaxed max-w-lg">
                  {ing.text}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}