"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIChat } from "@/components/ai-chat"
import Navigation from "@/components/navigation"

interface Project {
  id: string
  title: string
  description: string
  category: string
}

async function fetchRelatedProjects(title: string, description: string, category: string): Promise<Project[]> {
  // Replace with your actual API endpoint and logic
  // This is a placeholder to satisfy the type checker
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network request
  return [
    { id: "1", title: "Sample Project 1", description: "Description 1", category: "web" },
    { id: "2", title: "Sample Project 2", description: "Description 2", category: "mobile" },
  ]
}

export default function HackathonRecommendation() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowResults(false)
    const fetchedProjects = await fetchRelatedProjects(title, description, category)
    setRelatedProjects(fetchedProjects)
    setIsLoading(false)
    setShowResults(true)
  }

  return (
    <>
      <Navigation />
      <div className="relative min-h-screen bg-background dark:bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <main className="relative container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Hackathon Project Recommendation</h1>
            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-foreground">
                      Project Title
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your project title"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-foreground">
                      Project Description
                    </label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project idea"
                      className="bg-background/50 min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-foreground">
                      Category
                    </label>
                    <Select onValueChange={setCategory} required>
                      <SelectTrigger id="category" className="bg-background/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="ai">Artificial Intelligence</SelectItem>
                        <SelectItem value="iot">Internet of Things</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Find Related Projects"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-semibold text-center text-foreground">
                    Here are some projects you might want to take a look at:
                  </h2>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {relatedProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors duration-300">
                            <CardHeader>
                              <CardTitle className="text-foreground">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground">{project.description}</p>
                              <p className="text-sm text-primary/80 mt-2">Category: {project.category}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4">
                      <AIChat projectDetails={{ title, description, category }} relatedProjects={relatedProjects} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  )
}

