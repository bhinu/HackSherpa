"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import { projectsData } from "@/lib/placeholder-data"
import Navigation from "@/components/navigation"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const category = decodeURIComponent(params.category)

  // Filter projects that match the category
  const categoryProjects = projectsData.filter(
    (project) => project.primary_category === category || project.secondary_category === category,
  )

  return (
    <>
      <Navigation />
      <div className="relative min-h-screen bg-background dark:bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative container px-4 pt-32 pb-12 mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="hover:bg-primary/10" onClick={() => router.push("/browse")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </div>

          <div className="space-y-6 text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">{category}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore projects in {category}</p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {categoryProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          {categoryProjects.length === 0 && (
            <div className="text-center text-muted-foreground py-12 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              No projects found in this category yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

