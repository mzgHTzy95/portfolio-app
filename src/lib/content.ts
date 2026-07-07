/**
 * Estimate reading time for a body of text.
 * Average adult reading speed: ~200 words per minute.
 */
export function readingTime(content: string, wordsPerMinute = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Extract headings from MDX/Markdown content for a table of contents.
 * Returns h2 and h3 entries with slug anchors.
 */
export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

export function extractToc(content: string): TocEntry[] {
  const lines = content.split("\n");
  const entries: TocEntry[] = [];
  let inFrontmatter = false;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) continue;
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      entries.push({ level, text, slug });
    }
  }
  return entries;
}
