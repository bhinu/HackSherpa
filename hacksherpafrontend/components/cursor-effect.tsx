"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Check if the cursor is over a clickable element
      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button",
      )
    }

    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        style={{ mixBlendMode: "difference" }}
      >
        <motion.div
          className="absolute bg-white rounded-full"
          animate={{
            x: mousePosition.x - (isPointer ? 32 : 8),
            y: mousePosition.y - (isPointer ? 32 : 8),
            scale: isPointer ? 2 : 1,
            width: isPointer ? "64px" : "16px",
            height: isPointer ? "64px" : "16px",
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

