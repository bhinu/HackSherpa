// app/discuss/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { AIChat } from "@/components/ai-chat";
import Navigation from "@/components/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
}

async function fetchRelatedProjects(title: string, description: string): Promise<Project[]> {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [],
        data: {
          projectDetails: {
            title,
            description,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project recommendations");
    }

    const data = await response.json();
    console.log("Fetched Projects:", data);

    return data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      description: doc.summary,
      category: `${doc.primary_category} / ${doc.secondary_category}`,
      url: doc.url,
      image_url: doc.image_url,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default function HackathonRecommendation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResults(false);

    const fetchedProjects = await fetchRelatedProjects(title, description);
    setRelatedProjects(fetchedProjects);
    setIsLoading(false);
    setShowResults(true);
  };

  return (
    <>
      <Navigation />
      <div className="relative min-h-screen bg-background dark:bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <main className="relative container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text text-center">
              Hackathon Project Recommendation
            </h1>
            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-foreground">
                      Project Title
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your project title"
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-foreground">
                      Project Description
                    </label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project idea"
                      className="bg-background/50 min-h-[100px]"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Find Related Projects"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  <h2 className="text-xl font-semibold text-center text-foreground">
                    Here are some projects you might want to take a look at:
                  </h2>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {relatedProjects.length > 0 ? (
                        relatedProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors duration-300">
                              <CardHeader>
                                <CardTitle className="text-foreground">{project.title}</CardTitle>
                                <CardDescription>{project.category}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <p className="text-muted-foreground">{project.description}</p>
                              </CardContent>
                              <CardFooter>
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Project
                                </a>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No recommendations found. Try adjusting your project details.
                        </p>
                      )}
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4">
                      <AIChat
                        projectDetails={{ title, description, category: "" }}
                        relatedProjects={relatedProjects}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
