import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card-v2";
import { allProjects } from "content-collections";
import type { Metadata } from "next";
import { getPaginationMeta, normalizePage, paginate } from "@/lib/pagination";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of my work — web apps, open source, and case studies.",
  openGraph: {
    title: "Projects",
    description: "A collection of my work — web apps, open source, and case studies.",
  },
};

const BLUR_FADE_DELAY = 0.04;

const categories = [
  { value: "all", label: "All" },
  { value: "web-app", label: "Web Apps" },
  { value: "website", label: "Websites" },
  { value: "open-source", label: "Open Source" },
  { value: "other", label: "Other" },
];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category: catParam, page: pageParam } = await searchParams;
  const activeCategory = catParam && categories.some((c) => c.value === catParam)
    ? catParam
    : "all";

  const allSorted = [...allProjects].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const filtered =
    activeCategory === "all"
      ? allSorted
      : allSorted.filter((p) => p.category === activeCategory);

  const PAGE_SIZE = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = normalizePage(pageParam, totalPages);
  const { items } = paginate(filtered, { page: currentPage, pageSize: PAGE_SIZE });

  return (
    <section id="projects">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Projects{" "}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {allSorted.length} total
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Selected work with full case studies — problem, solution, and tech stack.
        </p>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={`/projects?category=${cat.value}`}
                className={`h-8 px-3 flex items-center text-sm rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </BlurFade>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, id) => {
            const slug = project._meta.path.replace(/\.mdx$/, "");
            return (
              <BlurFade key={slug} delay={BLUR_FADE_DELAY * 3 + id * 0.05} className="h-full">
                <ProjectCard
                  index={(currentPage - 1) * PAGE_SIZE + id}
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
          <p className="text-muted-foreground text-center">
            No projects in this category yet.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-3 flex-row items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/projects?category=${activeCategory}&page=${currentPage - 1}`}
                className="h-8 px-3 flex items-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <span className="h-8 px-3 flex items-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                Previous
              </span>
            )}
            {currentPage < totalPages ? (
              <Link
                href={`/projects?category=${activeCategory}&page=${currentPage + 1}`}
                className="h-8 px-3 flex items-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span className="h-8 px-3 flex items-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
