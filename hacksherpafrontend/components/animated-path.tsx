"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PathProps {
  icons: {
    Icon: LucideIcon;
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
    <div ref={containerRef} className="relative w-full h-full text-gray-900 dark:text-white transition-colors duration-300">
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
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        {/* Labels with Dark Mode Support */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <text x="200" y="440" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
            From Ideation
          </text>

          <text x="400" y="340" className="text-lg font-medium" textAnchor="middle" fill="currentColor">
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
          { x: 200, y: 400, id: "browse" },
          { x: 400, y: 300, id: "discuss" },
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
  );
}
