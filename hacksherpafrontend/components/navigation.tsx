"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            HackSherpa
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="#browse" className="text-sm hover:text-primary transition-colors">
              Browse Winning Ideas
            </Link>
            <Link href="#discuss" className="text-sm hover:text-primary transition-colors">
              Discuss Ideas
            </Link>
            <Link href="#readme" className="text-sm hover:text-primary transition-colors">
              Create ReadMe
            </Link>
            <Link href="#slideshow" className="text-sm hover:text-primary transition-colors">
              Create Slideshow
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

