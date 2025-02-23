"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface ProjectCardProps {
  project: {
    title: string
    image_url: string
    primary_category: string
    secondary_category: string
    summary: string
    winner: boolean
    project_url: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => window.open(project.project_url, "_blank")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden
        bg-white/10 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${project.winner ? "ring-4 hover:ring-8 ring-yellow-500/50" : ""}
      `}
    >
      {project.winner && (
        <div
          className={`
          absolute top-0 left-1/2 -translate-x-1/2
          bg-yellow-500 text-black font-semibold
          px-4 py-1 rounded-b-lg
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          Winner
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-full text-xs bg-white/20 text-white">{project.primary_category}</span>
            <span className="px-2 py-1 rounded-full text-xs bg-white/20 text-white">{project.secondary_category}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white">{project.title}</h3>

        {project.image_url && (
          <div className="relative w-full h-48">
            <Image
              src={project.image_url || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <p
          className={`
          text-gray-300 transition-all duration-300
          ${isHovered ? "line-clamp-none" : "line-clamp-3"}
        `}
        >
          {project.summary}
        </p>
      </div>
    </motion.div>
  )
}

