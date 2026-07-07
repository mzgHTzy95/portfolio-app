import { allProjects } from "content-collections";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import Link from "next/link";
import { ChevronLeft, Github, Globe, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectToc } from "@/components/project-toc";

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project._meta.path.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path.replace(/\.mdx$/, "") === slug);

  if (!project) return undefined;

  const { title, description, coverImage } = project;
  const url = `${DATA.url}/projects/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      ...(coverImage && { images: [{ url: coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(coverImage && { images: [coverImage] }),
    },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path.replace(/\.mdx$/, "") === slug);

  if (!project) notFound();

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: project.title,
    description: project.description,
    datePublished: project.publishedAt,
    url: `${DATA.url}/projects/${slug}`,
    author: { "@type": "Person", name: DATA.name },
  }).replace(/</g, "\\u003c");

  return (
    <section id="project">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Link
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-6 group"
      >
        <ChevronLeft className="size-3 group-hover:-translate-x-px transition-transform" />
        Back to Projects
      </Link>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {project.category.replace("-", " ")}
          </Badge>
          {project.featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
        </div>
        <h1 className="title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
          {project.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-1.5 hover:bg-accent/50 transition-colors"
            >
              <Globe className="h-4 w-4" /> Live demo
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-1.5 hover:bg-accent/50 transition-colors"
            >
              <Github className="h-4 w-4" /> Source
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {project.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden border border-border">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert flex-1 min-w-0">
          <MDXContent code={project.mdx} components={mdxComponents} />
        </article>
        <ProjectToc mdx={project.mdx} />
      </div>
    </section>
  );
}
