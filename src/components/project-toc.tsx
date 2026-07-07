"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  level: number;
  text: string;
  slug: string;
}

/**
 * Extracts h2/h3 headings from the raw MDX code string.
 * The compiled `mdx` field contains the source markdown-ish content
 * with headings as plain text, so we parse for `## ` / `### ` patterns.
 */
function extractHeadings(mdx: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = mdx.split("\n");
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      items.push({ level, text, slug });
    }
  }
  return items;
}

export function ProjectToc({ mdx }: { mdx: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const items = extractHeadings(mdx);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden md:block w-56 shrink-0 sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="flex flex-col gap-1.5 border-l border-border">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={cn(
                "block text-sm py-1 -ml-px border-l-2 transition-colors",
                item.level === 3 && "pl-6",
                item.level === 2 && "pl-3",
                activeId === item.slug
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
