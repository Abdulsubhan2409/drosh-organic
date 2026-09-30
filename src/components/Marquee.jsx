import React from "react";
import { motion } from "framer-motion";

export default function Marquee({ items = [] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-2xl md:text-3xl italic text-background/85 px-6">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}