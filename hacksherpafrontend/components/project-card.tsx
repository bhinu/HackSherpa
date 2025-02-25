import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export interface Project {
  id: string;
  title: string;
  summary: string;
  primary_category: string;
  secondary_category: string;
  url: string;
  image_url: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <p className="text-muted-foreground">{project.summary}</p>
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
  );
};

export default ProjectCard;
