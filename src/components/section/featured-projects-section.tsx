import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card-v2";
import { allProjects } from "content-collections";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export default function FeaturedProjectsSection() {
  const featured = [...allProjects]
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const projects = featured.length > 0 ? featured : [...allProjects].slice(0, 3);

  return (
    <section id="featured-projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">Featured Work</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Selected projects</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              A few projects I&apos;m proud of, with full case studies behind each one.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, id) => {
            const slug = project._meta.path.replace(/\.mdx$/, "");
            return (
              <BlurFade key={slug} delay={BLUR_FADE_DELAY * 12 + id * 0.05} className="h-full">
                <ProjectCard
                  project={{
                    slug,
                    title: project.title,
                    description: project.description,
                    category: project.category,
                    techStack: project.techStack,
                    coverImage: project.coverImage,
                    githubUrl: project.githubUrl,
                    liveUrl: project.liveUrl,
                    featured: project.featured,
                  }}
                />
              </BlurFade>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-4 py-2 hover:bg-accent/50 transition-colors"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
