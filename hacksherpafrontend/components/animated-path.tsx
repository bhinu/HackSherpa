"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Bot, Presentation, Trophy } from "lucide-react";

// Map string names to actual Lucide icons
const iconMap = {
  lightbulb: Lightbulb,
  bot: Bot,
  presentation: Presentation,
  trophy: Trophy,
};

interface PathProps {
  icons: {
    iconName: keyof typeof iconMap;
    label: string;
    sectionId: string;
  }[];
}

export default function AnimatedPath({ icons }: PathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${length} ${length}`;
    pathRef.current.style.strokeDashoffset = `${length}`;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg
        viewBox="0 0 1400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Background line (non-animated) */}
        <path
          d="M -100 300 H 200 L 200 400 H 400 L 400 300 H 600 L 600 200 H 800 H 1500"
          stroke="#E5E7EB"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated line */}
        <motion.path
          ref={pathRef}
          d="M -100 300 H 200 L 200 400 H 400 L 400 300 H 600 L 600 200 H 800 H 1500"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        {/* Labels and Icons */}
        {icons.map(({ iconName, label, sectionId }, index) => {
          const IconComponent = iconMap[iconName]; // Get the component from the map
          const positions = [
            { x: 200, y: 400 },
            { x: 400, y: 300 },
            { x: 600, y: 200 },
            { x: 800, y: 200 },
          ][index];

          return (
            <motion.g key={sectionId} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.5 + index * 0.5, duration: 0.5 }}>
              <text x={positions.x} y={positions.y + 40} className="text-lg font-medium" textAnchor="middle" fill="black">
                {label}
              </text>

              <motion.a href={`#${sectionId}`} initial={{ scale: 0, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={{ delay: 0.5 + index * 0.5, duration: 0.3 }} className="cursor-pointer">
                <rect x={positions.x - 20} y={positions.y - 20} width="40" height="40" className="fill-black hover:fill-gray-800 transition-colors" style={{ shapeRendering: "crispEdges" }} />
                {IconComponent && <IconComponent x={positions.x - 10} y={positions.y - 10} className="w-6 h-6 text-white absolute" />}
              </motion.a>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
