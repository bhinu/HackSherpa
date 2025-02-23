"use client"

import type React from "react"

import { useState } from "react"
import AnimatedPath from "@/components/animated-path"
import Navigation from "@/components/navigation"
import CursorEffect from "@/components/cursor-effect"
import { motion } from "framer-motion"
import { Lightbulb, Bot, Presentation, Trophy } from "lucide-react"
import { ScrambleText } from "@/components/text-scramble"

// Enhanced icons data with descriptions
const icons = [
  {
    Icon: Lightbulb,
    label: "From Ideation",
    sectionId: "browse",
    description: "Get inspired by successful hackathon projects and learn from winners' experiences.",
  },
  {
    Icon: Bot,
    label: "To Discussion",
    sectionId: "discuss",
    description: "Connect with fellow hackers, share insights, and refine your concepts.",
  },
  {
    Icon: Presentation,
    label: "To Documentation",
    sectionId: "readme",
    description: "Generate professional documentation that helps your project stand out.",
  },
  {
    Icon: Trophy,
    label: "To Victory",
    sectionId: "why-use",
    description: "Transform your hackathon project into a winning venture with HackSherpa.",
  },
]

interface FeatureSectionProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  reverse?: boolean
}

function FeatureSection({ id, title, description, icon, reverse }: FeatureSectionProps) {
  return (
    <section id={id} className="py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className={`md:w-1/2 ${reverse ? "md:order-2" : ""}`}>{icon}</div>
        <div className="md:w-1/2">
          <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {title}
          </h3>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300/80">{description}</p>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null)

  // Create a mapping of section IDs to their titles
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

        <main className="container mx-auto px-4 relative">
          {/* Hero Section */}
          <section className="pt-32 pb-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-7xl md:text-8xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-primary"
            >
              Sherpa
            </motion.h1>

            <div className="relative h-[800px]">
                {/* Move the text div above */}
                <div className="absolute top-8 right-8 max-w-md text-right">
                  <ScrambleText
                    text={hoveredSection ? sectionTitles[hoveredSection] : "Your Guide in Scaling Your Next Hackathon"}
                    className="text-4xl md:text-5xl font-medium leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4"
                  />
                  <ScrambleText
                    text={hoveredDescription || "A comprehensive guide to help you scale your next hackathon."}
                    className="text-lg text-gray-700 dark:text-gray-300/80"
                  />
                </div>

                {/* AnimatedPath below the text */}
                <AnimatedPath icons={icons} onHover={handleHover} />
              </div>
          </section>
        </main>
      </div>

      {/* Rest of the page content remains unchanged */}
      <div className="relative bg-dot-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        <div className="relative">
          <FeatureSection
            id="browse"
            title="Browse Winning Ideas"
            description="Get inspired by successful hackathon projects and learn from winners' experiences."
            icon={<Lightbulb className="w-16 h-16 text-primary" />}
          />
          <FeatureSection
            id="discuss"
            title="Discuss Ideas"
            description="Connect with fellow hackers, share insights, and refine your concepts."
            icon={<Bot className="w-16 h-16 text-primary" />}
            reverse
          />
          <FeatureSection
            id="readme"
            title="Create Startup ReadMe"
            description="Generate professional documentation that helps your project stand out."
            icon={<Presentation className="w-16 h-16 text-primary" />}
          />
          <section id="why-use" className="py-32 text-center relative">
            <div className="max-w-4xl mx-auto px-4">
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
                HackSherpa is your all-in-one platform for hackathon success. From ideation to presentation, we provide
                the tools and guidance you need to transform your hackathon project into a winning venture. Join
                thousands of successful hackers who've scaled their projects with HackSherpa.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

