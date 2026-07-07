import BlurFade from "@/components/magicui/blur-fade";
import { allPosts } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";
import { normalizePage, paginate } from "@/lib/pagination";
import { readingTime } from "@/lib/content";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development, life, and more.",
  openGraph: {
    title: "Blog",
    description: "Thoughts on software development, life, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Thoughts on software development, life, and more.",
  },
};

const PAGE_SIZE = 5;
const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag: tagParam } = await searchParams;

  const sortedPosts = [...allPosts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;
    return 1;
  });

  const allTags = Array.from(
    new Set(sortedPosts.flatMap((p) => p.tags ?? []))
  ).sort();

  const filtered = tagParam
    ? sortedPosts.filter((p) => (p.tags ?? []).includes(tagParam))
    : sortedPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = normalizePage(pageParam, totalPages);
  const { items: paginatedPosts, pagination } = paginate(filtered, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <section id="blog">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Blog{" "}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {sortedPosts.length} posts
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          My thoughts on software development, life, and more.
        </p>
      </BlurFade>

      {allTags.length > 0 && (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/blog"
              className={`h-8 px-3 flex items-center text-sm rounded-lg border transition-colors ${
                !tagParam
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => {
              const isActive = tagParam === tag;
              return (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className={`h-8 px-3 flex items-center text-sm rounded-lg border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </BlurFade>
      )}

      {paginatedPosts.length > 0 ? (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-col gap-5">
              {paginatedPosts.map((post, id) => {
                const slug = post._meta.path.replace(/\.mdx$/, "");
                const indexNumber = (pagination.page - 1) * PAGE_SIZE + id + 1;
                const minutes = readingTime(post.content || post.summary);
                return (
                  <BlurFade delay={BLUR_FADE_DELAY * 3 + id * 0.05} key={slug}>
                    <Link
                      className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      href={`/blog/${slug}`}
                    >
                      <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">
                        {String(indexNumber).padStart(2, "0")}.
                      </span>
                      <div className="flex flex-col gap-y-2 flex-1">
                        <p className="tracking-tight text-lg font-medium">
                          <span className="group-hover:text-foreground transition-colors">
                            {post.title}
                            <ChevronRight
                              className="ml-1 inline-block size-4 stroke-3 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                              aria-hidden
                            />
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {post.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.publishedAt}</span>
                          <span>·</span>
                          <span>{minutes} min read</span>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="border border-border rounded px-1.5 py-0.5"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </BlurFade>
                );
              })}
            </div>
          </BlurFade>

          {pagination.totalPages > 1 && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex gap-3 flex-row items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2 sm:justify-end">
                  {pagination.hasPreviousPage ? (
                    <Link
                      href={`/blog?${tagParam ? `tag=${tagParam}&` : ""}page=${pagination.page - 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                  {pagination.hasNextPage ? (
                    <Link
                      href={`/blog?${tagParam ? `tag=${tagParam}&` : ""}page=${pagination.page + 1}`}
                      className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </div>
              </div>
            </BlurFade>
          )}
        </>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No blog posts yet. Check back soon!
            </p>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
