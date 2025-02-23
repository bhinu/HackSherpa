"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIChat } from "@/components/ai-chat";
import Navigation from "@/components/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function HackathonRecommendation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResults(false);
    const fetchedProjects = await fetchRelatedProjects(
      title,
      description,
      category
    );
    setRelatedProjects(fetchedProjects);
    setIsLoading(false);
    setShowResults(true);
  };

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 relative pt-24">
        <h1 className="text-2xl font-bold mb-4">
          Hackathon Project Recommendation
        </h1>
        <form onSubmit={handleProjectSubmit} className="space-y-4 mb-8">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            required
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            required
          />
          <Select onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent
              style={{
                position: "absolute",
                zIndex: 9999,
                backgroundColor: "rgba(255, 255, 255, 1)",
              }}
            >
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
              <SelectItem value="ai">Artificial Intelligence</SelectItem>
              <SelectItem value="iot">Internet of Things</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Find Related Projects"}
          </Button>
        </form>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-center">
                OK, here are some projects you might want to take a look at:
              </h2>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 space-y-4">
                  {relatedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{project.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Category: {project.category}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="lg:w-1/2">
                  <AIChat
                    projectDetails={{ title, description, category }}
                    relatedProjects={relatedProjects}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

async function fetchRelatedProjects(
  title: string,
  description: string,
  category: string
): Promise<Project[]> {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: "1",
      title: "Project A",
      description: "A related project",
      category: "web",
    },
    {
      id: "2",
      title: "Project B",
      description: "Another related project",
      category: "mobile",
    },
    {
      id: "3",
      title: "Project C",
      description: "Yet another related project",
      category: "ai",
    },
    {
      id: "4",
      title: "Project D",
      description: "One more related project",
      category: "iot",
    },
  ];
}
