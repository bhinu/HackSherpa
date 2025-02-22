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
    <section id={id} ref={ref} className={cn("py-32 flex items-center", reverse ? "flex-row-reverse" : "flex-row")}>
      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 50 : -50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-lg mx-auto">
          <div className="mb-8">{icon}</div>
          <h3 className="text-3xl font-bold mb-4">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? -50 : 50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="aspect-square bg-muted rounded-lg" />
      </motion.div>
    </section>
  )
}

