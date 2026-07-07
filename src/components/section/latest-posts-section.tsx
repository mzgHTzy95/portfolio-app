import BlurFade from "@/components/magicui/blur-fade";
import { allPosts } from "content-collections";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { readingTime } from "@/lib/content";

const BLUR_FADE_DELAY = 0.04;

export default function LatestPostsSection() {
  const posts = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="latest-posts">
      <div className="flex min-h-0 flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <h2 className="text-xl font-bold">Latest writing</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              All posts <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </BlurFade>
        </div>
        <div className="flex flex-col gap-3">
          {posts.map((post, id) => {
            const slug = post._meta.path.replace(/\.mdx$/, "");
            const minutes = readingTime(post.content || post.summary);
            return (
              <BlurFade key={slug} delay={BLUR_FADE_DELAY * 16 + id * 0.05}>
                <Link
                  href={`/blog/${slug}`}
                  className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  <div className="flex flex-col gap-y-1 flex-1">
                    <p className="tracking-tight text-base font-medium">
                      <span className="group-hover:text-foreground transition-colors">
                        {post.title}
                        <ChevronRight
                          className="ml-1 inline-block size-4 stroke-3 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                          aria-hidden
                        />
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.publishedAt} · {minutes} min read
                    </p>
                  </div>
                </Link>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
