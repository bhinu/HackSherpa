"use client"

import { motion } from "framer-motion"

export default function Logo() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mountain peaks forming an 'S' */}
      <motion.path
        d="M30 90 L45 60 L60 80 L75 40 L90 90 L30 90"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Circle around the mountain */}
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        stroke="url(#gradient)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}

