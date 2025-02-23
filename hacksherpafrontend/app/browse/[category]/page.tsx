// app/browse/[category]/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import Navigation from "@/components/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
}

async function fetchProjectsByCategory(category: string): Promise<Project[]> {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [],
        data: {
          projectDetails: {
            title: category,
            description: "",
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project recommendations");
    }

    const data = await response.json();

    // Limit the returned projects to 4 items (or any desired limit)
    return data.slice(0, 4).map((doc: any) => ({
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

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  // Memoize the decoded category so it doesn't trigger repeated requests
  const category = useMemo(
    () => (params.category ? decodeURIComponent(params.category as string) : ""),
    [params.category]
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!category) return;
    async function getProjects() {
      setIsLoading(true);
      const fetchedProjects = await fetchProjectsByCategory(category);
      setProjects(fetchedProjects);
      setIsLoading(false);
    }
    getProjects();
  }, [category]);

  return (
    <>
      <Navigation />
      <div className="relative min-h-screen bg-background dark:bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <main className="relative container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-8 hover:bg-primary/10"
              onClick={() => router.push("/browse")}
            >
              Back to Categories
            </Button>
            <h1 className="text-4xl font-bold mb-8 gradient-text text-center">{category}</h1>
            {isLoading ? (
              <div className="text-center text-muted-foreground py-12">Loading projects...</div>
            ) : (
              <motion.div
                className="grid lg:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {projects.length > 0 ? (
                  projects.map((project, index) => (
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
                  <div className="text-center text-muted-foreground py-12 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                    No projects found in this category yet.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
