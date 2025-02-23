// app/browse/[category]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import Navigation from "@/components/navigation";

interface Project {
  id: string;
  title: string;
  summary: string;
  primary_category: string;
  secondary_category: string;
  url: string;
  image_url: string;
}

async function fetchProjectsByCategory(category: string): Promise<Project[]> {
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
            // Use the category as the title for vector search
            title: category,
            description: "",
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch category projects");
    }

    const data = await response.json();
    console.log("Fetched Category Projects:", data);

    return data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      summary: doc.summary,
      primary_category: doc.primary_category,
      secondary_category: doc.secondary_category,
      url: doc.url,
      image_url: doc.image_url,
    }));
  } catch (error) {
    console.error("Error fetching category projects:", error);
    return [];
  }
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent(params.category as string);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
        <div className="relative container px-4 pt-32 pb-12 mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="hover:bg-primary/10" onClick={() => router.push("/browse")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </div>

          <div className="space-y-6 text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">{category}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore projects in {category}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-12">Loading projects...</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
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
      </div>
    </>
  );
}
