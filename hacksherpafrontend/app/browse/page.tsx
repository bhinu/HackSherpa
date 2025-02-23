"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Smartphone,
  Globe,
  Monitor,
  Gamepad,
  Glasses,
  Camera,
  Brain,
  Database,
  MessageSquare,
  BotIcon as Robot,
  Wifi,
  Watch,
  Heart,
  Banknote,
  GraduationCap,
  Link,
  Shield,
  BarChart2,
  Cloud,
  HardDrive,
  Leaf,
  Palette,
  Users,
  Cpu,
  CircuitBoardIcon as Circuit,
  Atom,
  PrinterIcon as Printer3d,
  MessageCircle,
  Map,
  Truck,
  Scale,
  Landmark,
  TrendingUp,
  MousePointer2,
  Video,
  Wheat,
  Zap,
  Car,
} from "lucide-react"
import { Input } from "@/components/ui/input"

const categories = [
  { icon: Smartphone, name: "Mobile Apps", description: "Build innovative mobile applications" },
  { icon: Globe, name: "Web Apps", description: "Create modern web applications" },
  { icon: Monitor, name: "Desktop Apps", description: "Develop powerful desktop software" },
  { icon: Gamepad, name: "Game Development", description: "Design and build engaging games" },
  { icon: Glasses, name: "Virtual Reality (VR)", description: "Create immersive VR experiences" },
  { icon: Camera, name: "Augmented Reality (AR)", description: "Build AR applications" },
  { icon: Brain, name: "AI/Artificial Intelligence", description: "Develop AI-powered solutions" },
  { icon: Database, name: "Machine Learning (ML)", description: "Build ML models and applications" },
  { icon: MessageSquare, name: "Natural Language Processing", description: "Work with language AI" },
  { icon: Robot, name: "Robotics", description: "Build and program robots" },
  { icon: Wifi, name: "IoT (Internet of Things)", description: "Connect smart devices" },
  { icon: Watch, name: "Wearables", description: "Create wearable technology" },
  { icon: Heart, name: "Bio-Tech/Health-Tech", description: "Innovate in healthcare" },
  { icon: Banknote, name: "FinTech", description: "Transform financial services" },
  { icon: GraduationCap, name: "EduTech", description: "Revolutionize education" },
  { icon: Link, name: "Blockchain/Web3", description: "Build decentralized applications" },
  { icon: Shield, name: "Cybersecurity", description: "Protect digital assets" },
  { icon: BarChart2, name: "Data Science/Analytics", description: "Analyze and visualize data" },
  { icon: Cloud, name: "Cloud Computing", description: "Build cloud solutions" },
  { icon: HardDrive, name: "Big Data", description: "Handle large-scale data" },
  { icon: Leaf, name: "Environmental Tech", description: "Create sustainable solutions" },
  { icon: Palette, name: "Digital Art", description: "Create digital artwork" },
  { icon: Users, name: "Social Impact", description: "Build for social good" },
  { icon: Cpu, name: "Hardware Development", description: "Work with Arduino & Raspberry Pi" },
  { icon: Circuit, name: "Embedded Systems", description: "Program embedded devices" },
  { icon: Atom, name: "Quantum Computing", description: "Explore quantum technologies" },
  { icon: Printer3d, name: "3D Printing", description: "Create 3D-printed solutions" },
  { icon: MessageCircle, name: "Chatbots", description: "Build conversational AI" },
  { icon: Map, name: "Geospatial Data/GIS", description: "Work with location data" },
  { icon: Truck, name: "Supply Chain/Logistics", description: "Optimize supply chains" },
  { icon: Scale, name: "LegalTech", description: "Innovate legal services" },
  { icon: Landmark, name: "GovTech", description: "Transform government services" },
  { icon: TrendingUp, name: "Marketing Tech", description: "Enhance marketing solutions" },
  { icon: MousePointer2, name: "Human-Computer Interaction", description: "Design better interfaces" },
  { icon: Video, name: "Content Creation", description: "Create digital content" },
  { icon: Wheat, name: "AgriTech", description: "Innovate in agriculture" },
  { icon: Zap, name: "Energy Tech", description: "Transform energy systems" },
  { icon: Car, name: "Transportation Tech", description: "Revolutionize transportation" },
]

export default function BrowsePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/browse/${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="space-y-6 text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Browse Categories</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore different technology categories and find the perfect track for your next project
          </p>
          <div className="max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search categories..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-white/10 p-6 hover:bg-white/[0.15] transition-colors duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 group-hover:bg-white/20 transition-colors duration-300">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="text-gray-300">{category.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg group-hover:border-white/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

