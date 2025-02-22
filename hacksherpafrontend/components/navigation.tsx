"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = ["browse", "discuss", "readme", "why-use"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/60 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold gradient-text">
            HackSherpa
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Browse", path: "/" },
              { name: "Discuss", path: "/discuss" },
              { name: "Create ReadMe", path: "/create_readme" },
              { name: "Presentation", path: "/presentation" },
            ].map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className={cn(
                  "relative text-sm transition-colors group",
                  activeSection.toLowerCase() === path.replace("/", "") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="capitalize">{name}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                  initial={false}
                  animate={{
                    width: activeSection === path.replace("/", "") ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
