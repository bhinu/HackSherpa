"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureSectionProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  reverse?: boolean
}

export default function FeatureSection({ id, title, description, icon, reverse = false }: FeatureSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id={id}
      ref={ref}
      className={cn("py-32 flex items-center relative", reverse ? "flex-row-reverse" : "flex-row")}
    >
      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 50 : -50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-lg mx-auto">
          <motion.div
            className="mb-8 relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl -z-10" />
          </motion.div>
          <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? -50 : 50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl backdrop-blur-3xl border border-white/10 p-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        </div>
      </motion.div>
    </section>
  )
}

