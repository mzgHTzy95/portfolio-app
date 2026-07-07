"use client";
import { useEffect, useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";

const BLUR_FADE_DELAY = 0.04;

interface Project {
  id: string;
  title: string;
  description: string;
  dates: string;
  active: boolean;
  technologies: string[];
  links: Array<{ type: string; href: string }>;
  image: string;
  video: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error("[v0] Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">My Projects</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Check out my latest work</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              I&apos;ve worked on a variety of projects, from simple
              websites to complex web applications. Here are a few of my
              favorites.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto auto-rows-fr">
          {loading && <div className="col-span-full text-center text-muted-foreground">Loading projects...</div>}
          {error && <div className="col-span-full text-center text-destructive">{error}</div>}
          {!loading && !error && projects.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No projects found</div>
          )}
          {projects.map((project, id) => (
            <BlurFade
              key={project.id}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              className="h-full"
            >
              <ProjectCard
                href={project.links?.[0]?.href || "#"}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

