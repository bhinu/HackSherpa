"use client"

import type React from "react"

import { useState, useRef } from "react"
import AnimatedPath from "@/components/animated-path"
import Navigation from "@/components/navigation"
import CursorEffect from "@/components/cursor-effect"
import { motion, useScroll, useTransform } from "framer-motion"
import { Lightbulb, Bot, Presentation, Trophy } from "lucide-react"
import { ScrambleText } from "@/components/text-scramble"

// Enhanced icons data with descriptions and routes
const icons = [
  {
    Icon: Lightbulb,
    label: "From Ideation",
    sectionId: "browse",
    description: "Get inspired by successful hackathon projects and learn from winners' experiences.",
    route: "/browse",
    elevation: 60, // Higher elevation in the mountain
  },
  {
    Icon: Bot,
    label: "To Discussion",
    sectionId: "discuss",
    description: "Connect with fellow hackers, share insights, and refine your concepts.",
    route: "/discuss",
    elevation: 20, // Valley point
  },
  {
    Icon: Presentation,
    label: "To Documentation",
    sectionId: "readme",
    description: "Generate professional documentation that helps your project stand out.",
    route: "/create_readme",
    elevation: 80, // Peak point
  },
  {
    Icon: Trophy,
    label: "To Victory",
    sectionId: "why-use",
    description: "Transform your hackathon project into a winning venture with HackSherpa.",
    route: "#why-use",
    elevation: 40, // Mid elevation
  },
]

interface FeatureSectionProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  reverse?: boolean
  elevation?: number // 0-100 for parallax effect intensity
}

function FeatureSection({ id, title, description, icon, reverse, elevation = 50 }: FeatureSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, elevation])

  return (
    <section ref={ref} id={id} className="py-24 relative overflow-hidden">
      <motion.div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-purple-600/5" style={{ y }} />
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative">
        <div className={`md:w-1/2 ${reverse ? "md:order-2" : ""}`}>
          <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, elevation * 0.5]) }}>{icon}</motion.div>
        </div>
        <div className="md:w-1/2">
          <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, elevation * 0.3]) }}>
            <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {title}
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300/80">{description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()

  const sectionTitles: Record<string, string> = {
    browse: "From Ideation",
    discuss: "To Discussion",
    readme: "To Documentation",
    "why-use": "To Victory",
  }

  const handleHover = (sectionId: string | null, description: string | null) => {
    setHoveredSection(sectionId)
    setHoveredDescription(description)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-dot-pattern">
      <CursorEffect />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-600/5 to-background blur-3xl" />

        <Navigation />

        <main className="relative">
          {/* Hero Section */}
          <section className="pt-32 pb-32 container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-7xl md:text-8xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-primary"
            >
              Sherpa
            </motion.h1>

            <div className="relative h-[800px]">
              <AnimatedPath icons={icons} onHover={handleHover} />

              <div className="absolute bottom-8 right-8 max-w-md text-right">
                <ScrambleText
                  text={hoveredSection ? sectionTitles[hoveredSection] : "Your Guide in Scaling Your Next Hackathon"}
                  className="text-4xl md:text-5xl font-medium leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4"
                />
                <ScrambleText
                  text={hoveredDescription || "A comprehensive guide to help you scale your next hackathon."}
                  className="text-lg text-gray-700 dark:text-gray-300/80"
                />
              </div>
            </div>
          </section>

          {/* Feature Sections with Parallax */}
          <div className="relative bg-dot-pattern">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
            <div className="relative">
              <FeatureSection
                id="browse"
                title="Browse Winning Ideas"
                description="Get inspired by successful hackathon projects and learn from winners' experiences."
                icon={<Lightbulb className="w-16 h-16 text-primary" />}
                elevation={60}
              />
              <FeatureSection
                id="discuss"
                title="Discuss Ideas"
                description="Connect with fellow hackers, share insights, and refine your concepts."
                icon={<Bot className="w-16 h-16 text-primary" />}
                reverse
                elevation={40}
              />
              <FeatureSection
                id="readme"
                title="Create Startup ReadMe"
                description="Generate professional documentation that helps your project stand out."
                icon={<Presentation className="w-16 h-16 text-primary" />}
                elevation={80}
              />

              {/* Why Use Section */}
              <section id="why-use" className="py-32 text-center relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-primary/5 to-purple-600/5"
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [0, 100]),
                  }}
                />
                <div className="max-w-4xl mx-auto px-4 relative">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Trophy className="w-20 h-20 mx-auto mb-8 text-primary" />
                  </motion.div>
                  <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Why Use HackSherpa?
                  </h2>
                  <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300/80">
                    HackSherpa is your all-in-one platform for hackathon success. From ideation to presentation, we
                    provide the tools and guidance you need to transform your hackathon project into a winning venture.
                    Join thousands of successful hackers who've scaled their projects with HackSherpa.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

