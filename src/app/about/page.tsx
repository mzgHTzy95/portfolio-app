/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";
import { Download, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${DATA.name} — background, experience, and skills.`,
};

const BLUR_FADE_DELAY = 0.04;

const proficiency: Record<string, number> = {
  React: 95,
  "Next.js": 95,
  Typescript: 90,
  "Node.js": 85,
  Python: 80,
  Go: 70,
  Postgres: 85,
  Docker: 80,
  Kubernetes: 75,
  Java: 65,
  "C++": 60,
};

export default function AboutPage() {
  const timeline = [
    ...DATA.work.map((w) => ({
      type: "work" as const,
      title: w.title,
      org: w.company,
      href: w.href,
      logoUrl: w.logoUrl,
      start: w.start,
      end: (w.end ?? "Present") as string,
      description: w.description,
    })),
    ...DATA.education.map((e) => ({
      type: "education" as const,
      title: e.degree,
      org: e.school,
      href: e.href,
      logoUrl: e.logoUrl,
      start: e.start,
      end: e.end as string,
      description: "",
    })),
  ].sort((a, b) => {
    const aEnd = a.end === "Present" ? new Date().getFullYear() : parseInt(a.end);
    const bEnd = b.end === "Present" ? new Date().getFullYear() : parseInt(b.end);
    return bEnd - aEnd;
  });

  return (
    <section id="about">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-start gap-4">
            <Avatar className="size-20 border rounded-full shadow-lg ring-4 ring-muted shrink-0">
              <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tighter">{DATA.name}</h1>
              <p className="text-muted-foreground">{DATA.location}</p>
            </div>
          </div>
          <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
            <Markdown>{DATA.summary}</Markdown>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" /> Download resume
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="flex flex-col gap-y-6 mb-12">
          <h2 className="text-xl font-bold">Experience & Education</h2>
          <Timeline>
            {timeline.map((item, idx) => (
              <TimelineItem
                key={`${item.org}-${idx}`}
                className="w-full flex items-start justify-between gap-10"
              >
                <TimelineConnectItem className="flex items-start justify-center">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.org}
                      className="size-10 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border object-contain flex-none"
                    />
                  ) : (
                    <div className="size-10 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border flex-none" />
                  )}
                </TimelineConnectItem>
                <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5"
                    >
                      <h3 className="font-semibold leading-none">{item.org}</h3>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                    </Link>
                    <span className="text-xs tabular-nums text-muted-foreground shrink-0">
                      {item.start} - {item.end}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">Tech stack</h2>
          <div className="flex flex-col gap-3">
            {DATA.skills.map((skill, id) => {
              const level = proficiency[skill.name] ?? 70;
              return (
                <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 6 + id * 0.03}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {skill.icon && (
                          <skill.icon className="size-4 rounded overflow-hidden object-contain" />
                        )}
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">{level}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
