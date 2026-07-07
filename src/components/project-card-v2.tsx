/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import Link from "next/link";

export interface ProjectCardData {
  slug: string;
  title: string;
  description: string;
  category: string;
  techStack: readonly string[];
  coverImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  "web-app": "Web App",
  "website": "Website",
  "open-source": "Open Source",
  "other": "Other",
};

export function ProjectCard({ project, index }: { project: ProjectCardData; index?: number }) {
  const num = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-ring/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative shrink-0 aspect-[16/9] overflow-hidden bg-muted">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/40" />
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground border border-border">
            {categoryLabels[project.category] ?? project.category}
          </Badge>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {num && (
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {num}
              </span>
            )}
            <h3 className="font-semibold leading-tight group-hover:text-foreground transition-colors">
              {project.title}
            </h3>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" aria-hidden />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-[11px] font-medium border-border"
            >
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="outline" className="text-[11px] font-medium border-border">
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
          {project.liveUrl && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> Live
            </span>
          )}
          {project.githubUrl && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3" /> Code
            </span>
          )}
          <span className="ml-auto text-foreground/80 group-hover:text-foreground transition-colors">
            View case study →
          </span>
        </div>
      </div>
    </Link>
  );
}
