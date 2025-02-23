"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import { projectsData } from "@/lib/placeholder-data"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const category = decodeURIComponent(params.category)

  // Filter projects that match the category
  const categoryProjects = projectsData.filter(
    (project) => project.primary_category === category || project.secondary_category === category,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => router.push("/browse")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        <div className="space-y-6 text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{category}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Explore projects in {category}</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {categoryProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>

        {categoryProjects.length === 0 && (
          <div className="text-center text-gray-300 py-12">No projects found in this category yet.</div>
        )}
      </div>
    </div>
  )
}

