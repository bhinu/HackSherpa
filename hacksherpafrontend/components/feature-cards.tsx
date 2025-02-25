"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Lightbulb, Bot, FileText, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function FeatureCards() {
  const [isExpanded, setIsExpanded] = useState(false)

  const features = [
    {
      title: "Browse Projects",
      description: "Discover winning hackathon projects and get inspired by successful implementations.",
      icon: Lightbulb,
      href: "/browse",
      gradient: "from-primary to-purple-600",
    },
    {
      title: "Discuss Ideas",
      description: "Connect with fellow hackers, share insights, and refine your concepts.",
      icon: Bot,
      href: "/discuss",
      gradient: "from-purple-600 to-primary",
    },
    {
      title: "Create ReadMe",
      description: "Generate professional documentation that helps your project stand out.",
      icon: FileText,
      href: "/create_readme",
      gradient: "from-primary via-purple-600 to-primary",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "0" }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                        />
                        <feature.icon className="w-8 h-8 text-primary mb-2" />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="group-hover:bg-primary/10">
                          Explore
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-center mt-4">
        <Button variant="ghost" size="lg" onClick={() => setIsExpanded(!isExpanded)} className="group">
          <span className="mr-2">{isExpanded ? "Hide Features" : "Explore Features"}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:transform group-hover:translate-y-1 transition-transform" />
          )}
        </Button>
      </div>
    </div>
  )
}

