"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface PathProps {
  icons: {
    Icon: LucideIcon
    label: string
    sectionId: string
    description: string
  }[]
  onHover?: (sectionId: string | null, description: string | null) => void
}

export default function AnimatedPath(props: PathProps) {
  const { icons, onHover } = props
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      setPathLength(length)
    }
  }, [])

  useEffect(() => {
    // Find the description for the hovered section
    const hoveredIcon = icons.find((icon) => icon.sectionId === hoveredSection)
    // Notify parent component of hover changes
    if (onHover) {
      onHover(hoveredSection, hoveredIcon?.description || null)
    }
  }, [hoveredSection, icons, onHover])

  // Move the path up by adjusting y-coordinates
  const pathString = "M -100 150 H 200 L 200 300 H 400 L 400 50 H 600 L 600 200 H 800 H 1500"

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full text-gray-900 dark:text-white transition-colors duration-300"
    >
      <svg
        viewBox="0 0 1400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Background line (non-animated) */}
        <path d={pathString} stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Animated line */}
        <motion.path
          ref={pathRef}
          d={pathString}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        {/* Labels with Dark Mode Support */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <text x="200" y="340" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
            From Ideation
          </text>

          <text x="400" y="90" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
            To Discussion
          </text>

          <text x="600" y="240" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
            To Documentation
          </text>

          <text x="800" y="240" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
            To Victory
          </text>
        </motion.g>

        {/* Clickable Icons */}
        {[
          { x: 200, y: 300, id: "browse" },
          { x: 400, y: 50, id: "discuss" },
          { x: 600, y: 200, id: "readme" },
          { x: 800, y: 200, id: "why-use" },
        ].map((pos, index) => (
          <motion.a
            key={index}
            href={`#${pos.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 0.5 + index * 0.5, duration: 0.3 }}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredSection(pos.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <rect
              x={pos.x - 20}
              y={pos.y - 20}
              width="40"
              height="40"
              className="fill-current text-gray-900 dark:text-white transition-colors duration-300 hover:text-gray-500"
              style={{ shapeRendering: "crispEdges" }}
            />
          </motion.a>
        ))}
      </svg>
    </div>
  )
}

