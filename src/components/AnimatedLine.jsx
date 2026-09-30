import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLine({ className = "", vertical = false }) {
  return (
    <motion.div
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-gradient-to-r from-transparent via-accent to-transparent origin-center ${vertical ? "origin-top" : ""} ${className}`}
      style={vertical ? { transformOrigin: "top" } : undefined}
      aria-hidden="true"
    />
  );
}